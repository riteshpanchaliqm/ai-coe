import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const proposalsRouter = Router();

const createProposalSchema = z.object({
  title: z.string().max(50),
  department: z.enum([
    'Tech', 'Finance', 'Sales', 'Marketing', 'Tech Support',
    'Customer Service', 'Legal', 'Product', 'AI Department',
  ]),
  problem_statement: z.string().max(500),
  proposed_solution: z.string().max(500),
  expected_impact: z.string().max(300),
  current_status: z.enum(['idea', 'exploring', 'partial', 'nearly_complete', 'stuck']),
  urgency: z.enum(['two_weeks', 'one_month', 'one_quarter', 'no_deadline']),
  urgency_reason: z.string().optional(),
  support_needs: z.array(z.string()).optional(),
  support_other_text: z.string().optional(),
  where_stuck: z.string().max(300).optional(),
});

const updateProposalSchema = createProposalSchema.partial();

/**
 * GET /proposals
 */
proposalsRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, department, page = '1', limit = '20', mine } = req.query;
    const offset = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

    let query = supabaseAdmin
      .from('proposals')
      .select('*, users!submitter_id(name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit as string, 10) - 1);

    if (status) {
      // Support multiple status values: ?status=submitted&status=in_review
      const statuses = Array.isArray(status) ? status : [status];
      query = query.in('status', statuses as string[]);
    }
    if (department) query = query.eq('department', department as string);
    if (mine === 'true') query = query.eq('submitter_id', req.user!.id);

    const { data, count, error } = await query;
    if (error) throw new AppError(error.message, 500);

    const proposals = data?.map((p) => ({
      ...p,
      submitter_name: (p.users as any)?.name,
      submitter_email: (p.users as any)?.email,
      users: undefined,
    }));

    res.json({
      proposals,
      pagination: {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        total: count || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /proposals/:id
 */
proposalsRouter.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: proposal, error } = await supabaseAdmin
      .from('proposals')
      .select('*, users!submitter_id(name, email)')
      .eq('id', req.params.id)
      .single();

    if (error || !proposal) throw new AppError('Proposal not found', 404);

    const { data: supportNeeds } = await supabaseAdmin
      .from('proposal_support_needs')
      .select('*')
      .eq('proposal_id', req.params.id);

    const { data: verdict } = await supabaseAdmin
      .from('verdicts')
      .select('*')
      .eq('proposal_id', req.params.id)
      .single();

    res.json({
      proposal: {
        ...proposal,
        submitter_name: (proposal.users as any)?.name,
        submitter_email: (proposal.users as any)?.email,
        users: undefined,
      },
      supportNeeds,
      verdict,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /proposals
 */
proposalsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submit, ...body } = req.body;
    const data = createProposalSchema.parse(body);

    const status = submit ? 'submitted' : 'draft';
    const submittedAt = submit ? new Date().toISOString() : null;

    // Get active guidelines version
    const { data: activeGuideline } = await supabaseAdmin
      .from('guidelines')
      .select('version')
      .eq('is_active', true)
      .single();

    const { data: proposal, error } = await supabaseAdmin
      .from('proposals')
      .insert({
        submitter_id: req.user!.id,
        title: data.title,
        department: data.department,
        problem_statement: data.problem_statement,
        proposed_solution: data.proposed_solution,
        expected_impact: data.expected_impact,
        current_status: data.current_status,
        urgency: data.urgency,
        urgency_reason: data.urgency_reason || null,
        status,
        submitted_at: submittedAt,
        guidelines_version: activeGuideline?.version || null,
        tech_frontend: req.body.tech_frontend || [],
        tech_backend: req.body.tech_backend || [],
        tech_database: req.body.tech_database || [],
        tech_ai_tools: req.body.tech_ai_tools || [],
        tech_integrations: req.body.tech_integrations || [],
        other_details: req.body.other_details || null,
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    // Insert support needs
    if (data.support_needs?.length) {
      const supportRows = data.support_needs.map((type: string) => ({
        proposal_id: proposal.id,
        support_type: type,
        other_text: type === 'Other' ? data.support_other_text : null,
      }));
      await supabaseAdmin.from('proposal_support_needs').insert(supportRows);
    }

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      proposal_id: proposal.id,
      actor_id: req.user!.id,
      action: submit ? 'submitted' : 'draft_created',
      payload: { title: data.title },
    });

    res.status(201).json({ proposal });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /proposals/:id
 */
proposalsRouter.patch('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: proposal, error: fetchError } = await supabaseAdmin
      .from('proposals')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !proposal) throw new AppError('Proposal not found', 404);
    if (proposal.submitter_id !== req.user!.id) throw new AppError('Only the submitter can edit', 403);
    if (!['draft', 'needs_clarification'].includes(proposal.status)) {
      throw new AppError('Proposal cannot be edited in its current status', 400);
    }

    const { submit, ...body } = req.body;
    const data = updateProposalSchema.parse(body);

    const updateData: Record<string, unknown> = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    if (submit) {
      updateData.status = 'submitted';
      updateData.submitted_at = new Date().toISOString();
    }

    const { data: updated, error } = await supabaseAdmin
      .from('proposals')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    res.json({ proposal: updated });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /proposals/:id/status
 */
proposalsRouter.patch(
  '/:id/status',
  authenticate,
  requireRole('reviewer', 'chair', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const validTransitions: Record<string, string[]> = {
        submitted: ['under_triage', 'in_review'],
        under_triage: ['needs_clarification', 'meeting_scheduled', 'in_review'],
        needs_clarification: ['submitted'],
        meeting_scheduled: ['in_review'],
        in_review: ['awaiting_decision'],
      };

      const { data: proposal, error: fetchError } = await supabaseAdmin
        .from('proposals')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (fetchError || !proposal) throw new AppError('Proposal not found', 404);

      const allowed = validTransitions[proposal.status];
      if (!allowed || !allowed.includes(status)) {
        throw new AppError(`Cannot transition from "${proposal.status}" to "${status}"`, 400);
      }

      const { data: updated, error } = await supabaseAdmin
        .from('proposals')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw new AppError(error.message, 500);

      await supabaseAdmin.from('activity_log').insert({
        proposal_id: proposal.id,
        actor_id: req.user!.id,
        action: 'status_changed',
        payload: { from: proposal.status, to: status },
      });

      res.json({ proposal: updated });
    } catch (error) {
      next(error);
    }
  }
);
