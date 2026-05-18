import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const guidelinesRouter = Router();

/**
 * GET /guidelines/active
 */
guidelinesRouter.get('/active', authenticate, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: guideline } = await supabaseAdmin
      .from('guidelines')
      .select('*')
      .eq('is_active', true)
      .single();

    res.json({ guideline: guideline || null });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /guidelines — admin only
 */
guidelinesRouter.get('/', authenticate, requireRole('admin'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: guidelines, error } = await supabaseAdmin
      .from('guidelines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    res.json({ guidelines });
  } catch (error) {
    next(error);
  }
});

const createGuidelineSchema = z.object({
  version: z.string().min(1),
  effective_from: z.string(),
  sections: z.array(z.object({ title: z.string(), body_markdown: z.string() })),
  checkpoints: z.array(z.object({ id: z.string(), label: z.string(), description: z.string().optional() })),
  is_active: z.boolean().optional(),
});

/**
 * POST /guidelines — admin only
 */
guidelinesRouter.post('/', authenticate, requireRole('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createGuidelineSchema.parse(req.body);

    // Deactivate all if setting as active
    if (data.is_active) {
      await supabaseAdmin.from('guidelines').update({ is_active: false }).eq('is_active', true);
    }

    const { data: guideline, error } = await supabaseAdmin
      .from('guidelines')
      .insert({
        version: data.version,
        effective_from: data.effective_from,
        sections: data.sections,
        checkpoints: data.checkpoints,
        is_active: data.is_active || false,
        created_by: req.user!.id,
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    res.status(201).json({ guideline });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /guidelines/:id/activate — admin only
 */
guidelinesRouter.patch('/:id/activate', authenticate, requireRole('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Deactivate all, then activate this one
    await supabaseAdmin.from('guidelines').update({ is_active: false }).eq('is_active', true);

    const { data: updated, error } = await supabaseAdmin
      .from('guidelines')
      .update({ is_active: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    res.json({ guideline: updated });
  } catch (error) {
    next(error);
  }
});
