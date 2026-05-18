import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('admin'));

/**
 * GET /admin/members
 */
adminRouter.get('/members', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new AppError(error.message, 500);

    const { data: roles } = await supabaseAdmin.from('user_roles').select('*');

    const rolesMap: Record<string, string[]> = {};
    roles?.forEach((r) => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    });

    const members = users?.map((u) => ({
      ...u,
      roles: rolesMap[u.id] || ['submitter'],
    }));

    res.json({ members });
  } catch (error) {
    next(error);
  }
});

const assignRoleSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(['submitter', 'reviewer', 'chair', 'admin']),
});

/**
 * POST /admin/members/roles
 */
adminRouter.post('/members/roles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = assignRoleSchema.parse(req.body);

    const { error } = await supabaseAdmin.from('user_roles').insert({
      user_id: data.user_id,
      role: data.role,
      granted_by: req.user!.id,
    });

    if (error) {
      if (error.code === '23505') throw new AppError('Role already assigned', 409);
      throw new AppError(error.message, 500);
    }

    res.status(201).json({ message: 'Role assigned' });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /admin/members/roles
 */
adminRouter.delete('/members/roles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = assignRoleSchema.parse(req.body);

    const { error } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', data.user_id)
      .eq('role', data.role);

    if (error) throw new AppError(error.message, 500);
    res.json({ message: 'Role removed' });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /admin/analytics
 */
adminRouter.get('/analytics', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { count: totalProposals } = await supabaseAdmin
      .from('proposals')
      .select('*', { count: 'exact', head: true });

    const { data: statusData } = await supabaseAdmin.rpc('get_proposal_counts_by_status');
    const { data: deptData } = await supabaseAdmin.rpc('get_proposal_counts_by_department');

    res.json({
      total_proposals: totalProposals || 0,
      by_status: statusData || [],
      by_department: deptData || [],
      avg_days_to_decision: null, // Will implement with DB function
    });
  } catch (error) {
    next(error);
  }
});
