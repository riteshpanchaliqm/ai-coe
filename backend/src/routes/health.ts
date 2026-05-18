import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { config } from '../config';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  try {
    const { error } = await supabaseAdmin.from('users').select('id').limit(1);
    res.json({
      status: error ? 'degraded' : 'healthy',
      app: config.appName,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      status: 'unhealthy',
      app: config.appName,
      timestamp: new Date().toISOString(),
    });
  }
});
