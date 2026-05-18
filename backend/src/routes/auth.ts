import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';

export const authRouter = Router();

/**
 * GET /auth/me
 * Returns the current authenticated user's profile and roles.
 */
authRouter.get('/me', authenticate, (req: Request, res: Response) => {
  res.json({ user: req.user });
});
