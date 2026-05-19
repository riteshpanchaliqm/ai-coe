import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { notifyVerdict } from '../lib/slack';

export const verdictsRouter = Router();

const createVerdictSchema = z.object({
  proposal_id: z.string().uuid(),
  decision: z.enum(['approved', 'approved_with_conditions', 'parked', 'rejected']),
  rationale: z.string().min(1),
  conditions: z.string().optional(),
});

/**
 * POST /verdicts — Chair only, requires 100% quorum.
 */
verdictsRouter.post(
  '/',
  authenticate,
  requireRole('chair'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createVerdictSchema.parse(req.body);

      // Check proposal state
      const { data: proposal } = await supabaseAdmin
        .from('proposals')
        .select('status')
        .eq('id', data.proposal_id)
        .single();

      if (!proposal) throw new AppError('Proposal not found', 404);
      if (!['in_review', 'awaiting_decision'].includes(proposal.status)) {
        throw new AppError('Proposal is not in a reviewable state', 400);
      }

      // Enforce 100% quorum
      const { data: reviewers } = await supabaseAdmin
        .from('user_roles')
        .select('user_id')
        .eq('role', 'reviewer');

      const { data: recommendations } = await supabaseAdmin
        .from('comments')
        .select('author_id')
        .eq('proposal_id', data.proposal_id)
        .not('recommendation', 'is', null);

      const uniqueRecommenders = new Set(recommendations?.map((r) => r.author_id));
      const reviewerIds = reviewers?.map((r) => r.user_id) || [];
      const reviewersWithRec = reviewerIds.filter((id) => uniqueRecommenders.has(id));

      if (reviewersWithRec.length < reviewerIds.length) {
        const missing = reviewerIds.length - reviewersWithRec.length;
        throw new AppError(`Quorum not met: ${missing} reviewer(s) missing recommendations`, 400);
      }

      if (data.decision === 'approved_with_conditions' && !data.conditions) {
        throw new AppError('Conditions required for conditional approval', 400);
      }

      // Insert verdict
      const { data: verdict, error } = await supabaseAdmin
        .from('verdicts')
        .insert({
          proposal_id: data.proposal_id,
          chair_id: req.user!.id,
          decision: data.decision,
          rationale: data.rationale,
          conditions: data.conditions || null,
        })
        .select()
        .single();

      if (error) throw new AppError(error.message, 500);

      // Update proposal status
      await supabaseAdmin
        .from('proposals')
        .update({ status: data.decision, updated_at: new Date().toISOString() })
        .eq('id', data.proposal_id);

      await supabaseAdmin.from('activity_log').insert({
        proposal_id: data.proposal_id,
        actor_id: req.user!.id,
        action: 'verdict_posted',
        payload: { decision: data.decision },
      });

      // Notify via Slack
      const { data: proposalData } = await supabaseAdmin
        .from('proposals')
        .select('title, users!submitter_id(email)')
        .eq('id', data.proposal_id)
        .single();

      if (proposalData) {
        notifyVerdict(
          { title: proposalData.title, id: data.proposal_id, submitter_email: (proposalData.users as any)?.email },
          data.decision,
          req.user!.name
        ).catch(console.error);
      }

      res.status(201).json({ verdict });
    } catch (error) {
      next(error);
    }
  }
);
