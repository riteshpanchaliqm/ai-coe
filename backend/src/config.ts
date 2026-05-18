import dotenv from 'dotenv';

// Load .env file for local development (in Docker, env vars come from docker-compose env_file)
dotenv.config();

export const config = {
  appName: process.env.APP_NAME || 'ai-coe',
  basePath: process.env.BASE_PATH || '/ai-coe',
  apiBasePath: process.env.API_BASE_PATH || '/api/v1/ai-coe',
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Auth
  allowedEmailDomain: process.env.ALLOWED_EMAIL_DOMAIN || 'iqm.com',

  // Slack
  slackBotToken: process.env.SLACK_BOT_TOKEN || '',
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET || '',
  slackChannelAiCoe: process.env.SLACK_CHANNEL_AI_COE || 'ai-coe',

  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
} as const;
