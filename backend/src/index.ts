import { config } from './config';
import app from './app';
import { supabaseAdmin } from './lib/supabase';

const start = async () => {
  try {
    // Verify Supabase connection
    const { error } = await supabaseAdmin.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.warn(`[${config.appName}] Supabase check warning:`, error.message);
    }
    console.log(`[${config.appName}] Supabase connected: ${config.supabaseUrl}`);

    app.listen(config.port, () => {
      console.log(`[${config.appName}] Server running on port ${config.port}`);
      console.log(`[${config.appName}] API base path: ${config.apiBasePath}`);
    });
  } catch (error) {
    console.error(`[${config.appName}] Failed to start:`, error);
    process.exit(1);
  }
};

start();
