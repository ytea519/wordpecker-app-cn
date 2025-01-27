import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY'] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const environment = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY!,
  openaiBaseUrl: process.env.OPENAI_BASE_URL||'https://api.openai.com/v1',
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_KEY!,
  testUserId: process.env.TEST_USER_UUID
} as const; 