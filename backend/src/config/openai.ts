import { completion } from 'litellm';
import { environment } from './environment';

if (!environment.openaiApiKey) {
  throw new Error('Missing OpenAI API key. Check OPENAI_API_KEY in .env');
}

export const DEFAULT_MODEL = 'gpt-3.5-turbo';

// Set OpenAI API key for LiteLLM
process.env['OPENAI_API_KEY'] = environment.openaiApiKey;

// LiteLLM wrapper for standardized completions
export const llm = {
  completion: async (params: any) => {
    const response = await completion({
      baseUrl: environment.openaiBaseUrl,
      model: params.model || DEFAULT_MODEL, // example "gemini/gemini-2.0-flash-exp" check for models https://models.litellm.ai/
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.max_tokens,
      stream: false
    });
    
    return {
      choices: [{
        message: {
          content: response.choices[0]?.message?.content || '',
          role: response.choices[0]?.message?.role || 'assistant'
        }
      }]
    };
  }
};