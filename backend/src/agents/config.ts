import 'dotenv/config';

export async function configureOpenAIAgents(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  try {
    const { setDefaultOpenAIKey } = await import('@openai/agents');
    setDefaultOpenAIKey(apiKey);
  } catch (error) {
    console.error('Error loading @openai/agents:', error);
    process.exit(1);
  }
}