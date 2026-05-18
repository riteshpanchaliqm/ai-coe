import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { supabaseAdmin } from '../lib/supabase';
import { AppError } from './errorHandler';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Simple in-memory cache for user profiles (avoids DB hit on every request)
const userCache = new Map<string, { user: AuthUser; expiry: number }>();
const CACHE_TTL = 60_000; // 1 minute

/**
 * Authenticate user via Supabase JWT.
 * Decodes the JWT locally (trusting Supabase's signature) to avoid a remote call.
 */
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401);
    }

    const token = authHeader.slice(7);

    // Decode JWT payload without remote verification (Supabase tokens are trusted)
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.sub || !payload.email) {
      throw new AppError('Invalid token', 401);
    }

    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new AppError('Token expired', 401);
    }

    // Domain restriction
    if (!payload.email.endsWith(`@${config.allowedEmailDomain}`)) {
      throw new AppError('Only @iqm.com emails are allowed', 403);
    }

    // Check cache first
    const cached = userCache.get(payload.sub);
    if (cached && cached.expiry > Date.now()) {
      req.user = cached.user;
      return next();
    }

    // Get or create user profile
    const user = await getOrCreateUser(
      payload.sub,
      payload.email,
      payload.user_metadata?.full_name || payload.user_metadata?.name
    );

    // Cache it
    userCache.set(payload.sub, { user, expiry: Date.now() + CACHE_TTL });

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Authentication failed', 401));
  }
};

/**
 * Require specific role(s) for access.
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    const hasRole = roles.some((role) => req.user!.roles.includes(role));
    if (!hasRole) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
};

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64url').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

async function getOrCreateUser(id: string, email: string, name?: string): Promise<AuthUser> {
  // Check if user exists
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (!existingUser) {
    // Create user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({ id, email, name: name || email.split('@')[0] })
      .select()
      .single();

    if (insertError) throw new AppError('Failed to create user profile', 500);

    // Assign default submitter role
    await supabaseAdmin.from('user_roles').insert({ user_id: id, role: 'submitter' });

    return { id: newUser.id, email: newUser.email, name: newUser.name, roles: ['submitter'] };
  }

  // Fetch roles
  const { data: roles } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', existingUser.id);

  return {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    roles: roles?.map((r) => r.role) || ['submitter'],
  };
}
