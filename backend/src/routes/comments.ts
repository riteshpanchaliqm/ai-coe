import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const commentsRouter = Router();

const createCommentSchema = z.object({
  proposal_id: z.string().uuid(),
  body: z.string().min(1),
  parent_comment_id: z.string().uuid().optional(),
  recommendation: z
    .enum(['approve', 'approve_with_conditions', 'needs_more_info', 'reject'])
    .optional(),
  conditions: z.string().optional(),
});

/**
 * GET /comments?proposal_id=xxx
 */
commentsRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { proposal_id } = req.query;
    if (!proposal_id) throw new AppError('proposal_id is required', 400);

    const { data: comments, error } = await supabaseAdmin
      .from('comments')
      .select('*, users!author_id(name, email)')
      .eq('proposal_id', proposal_id as string)
      .order('created_at', { ascending: true });

    if (error) throw new AppError(error.message, 500);

    // Fetch author roles
    const authorIds = [...new Set(comments?.map((c) => c.author_id) || [])];
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', authorIds);

    const rolesMap: Record<string, string[]> = {};
    roles?.forEach((r) => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    });

    const enriched = comments?.map((c) => ({
      ...c,
      author_name: (c.users as any)?.name,
      author_email: (c.users as any)?.email,
      author_roles: rolesMap[c.author_id] || [],
      users: undefined,
    }));

    res.json({ comments: enriched });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /comments
 */
commentsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCommentSchema.parse(req.body);

    const { data: proposal } = await supabaseAdmin
      .from('proposals')
      .select('submitter_id, status')
      .eq('id', data.proposal_id)
      .single();

    if (!proposal) throw new AppError('Proposal not found', 404);

    const isSubmitter = proposal.submitter_id === req.user!.id;
    const isReviewer = req.user!.roles.some((r) => ['reviewer', 'chair'].includes(r));

    if (!isSubmitter && !isReviewer) {
      throw new AppError('You do not have permission to comment', 403);
    }

    if (data.recommendation && !isReviewer) {
      throw new AppError('Only reviewers can post recommendations', 403);
    }

    if (data.recommendation === 'approve_with_conditions' && !data.conditions) {
      throw new AppError('Conditions required for conditional approval', 400);
    }

    const { data: comment, error } = await supabaseAdmin
      .from('comments')
      .insert({
        proposal_id: data.proposal_id,
        author_id: req.user!.id,
        parent_comment_id: data.parent_comment_id || null,
        body: data.body,
        recommendation: data.recommendation || null,
        conditions: data.conditions || null,
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    await supabaseAdmin.from('activity_log').insert({
      proposal_id: data.proposal_id,
      actor_id: req.user!.id,
      action: data.recommendation ? 'recommendation_posted' : 'comment_posted',
      payload: { comment_id: comment.id, recommendation: data.recommendation },
    });

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /comments/recommendations/:proposalId
 */
commentsRouter.get(
  '/recommendations/:proposalId',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data: reviewers } = await supabaseAdmin
        .from('user_roles')
        .select('user_id, users!user_id(name, email)')
        .eq('role', 'reviewer');

      const { data: recommendations } = await supabaseAdmin
        .from('comments')
        .select('author_id, recommendation, conditions, created_at')
        .eq('proposal_id', req.params.proposalId)
        .not('recommendation', 'is', null)
        .order('created_at', { ascending: false });

      // Deduplicate: latest per author
      const latestByAuthor: Record<string, any> = {};
      recommendations?.forEach((r) => {
        if (!latestByAuthor[r.author_id]) {
          latestByAuthor[r.author_id] = r;
        }
      });

      const quorum = {
        total_reviewers: reviewers?.length || 0,
        recommendations_received: Object.keys(latestByAuthor).length,
        quorum_met: Object.keys(latestByAuthor).length >= (reviewers?.length || 0),
        reviewers: reviewers?.map((r) => ({
          user_id: r.user_id,
          name: (r.users as any)?.name,
          email: (r.users as any)?.email,
          recommendation: latestByAuthor[r.user_id]?.recommendation || null,
          recommended_at: latestByAuthor[r.user_id]?.created_at || null,
        })),
      };

      res.json(quorum);
    } catch (error) {
      next(error);
    }
  }
);
