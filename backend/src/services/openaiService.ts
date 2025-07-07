import { openai, DEFAULT_MODEL } from '../config/openai';
import { Exercise, Question } from '../types';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const ExerciseSchema = z.object({
  word_id: z.string(),
  type: z.literal('multiple_choice'),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correct_answer: z.string(),
});

const ExercisesResponseSchema = z.object({
  exercises: z.array(ExerciseSchema),
});

const QuestionSchema = z.object({
  word_id: z.string(),
  type: z.literal('quiz'),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correct_answer: z.string(),
});

const QuestionsResponseSchema = z.object({
  questions: z.array(QuestionSchema),
});

export const openaiService = {
  async generateWordMeaning(word: string, context?: string): Promise<string> {
    const prompt = context
      ? `Define the word "${word}" in the context of ${context}.`
      : `Define the word "${word}" clearly and concisely.`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a helpful language learning assistant. Provide clear, concise definitions suitable for language learners."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    return response.choices[0].message.content?.trim() || 'No definition available';
  },

  async createExercises(words: Array<{ id: string; value: string; meaning: string }>, context?: string): Promise<Exercise[]> {
    const prompt = `Create vocabulary-focused multiple choice exercises for these words. ${context ? `The words appear in the context of "${context}". Use this context to enrich the exercises with relevant examples or scenarios, but ensure questions test the word's general meaning and usage.` : ''}

Words to create exercises for:
${words.map(word => `${word.value}: ${word.meaning}`).join('\n')}

Instructions:
1. Create one multiple choice question for each word
2. Focus on testing the word's meaning and usage while incorporating contextual examples
3. Structure questions to test vocabulary comprehension, using context-relevant examples in the options
4. Each question should have exactly 4 options
5. DO NOT ask questions about the context itself - use it only to create relevant examples

Example approaches:
- Define the word using a context-relevant example: "What does [word] mean in this sentence: [example from context]?"
- Test usage with context-themed scenarios: "Which situation best demonstrates the use of [word]?"
- Use context-relevant synonyms: "In [context-relevant scenario], which word could replace [word]?"
- Apply meaning to similar situations: "Based on how [word] is used in [context], which scenario shows a similar usage?"

Remember: Questions should test vocabulary knowledge while using context to provide relevant examples and scenarios.`;

    try {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a vocabulary learning exercise generator. Create exercises that test word comprehension using context-relevant examples, but never test the context itself. The goal is to help users understand words through familiar scenarios."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
        response_format: zodResponseFormat(ExercisesResponseSchema, "exercises"),
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content in response');
      
      const parsed = JSON.parse(content);
      return parsed.exercises || [];
    } catch (error) {
      console.error('Error creating exercises:', error);
      return [];
    }
  },

  async createQuizQuestions(words: Array<{ id: string; value: string; meaning: string }>, context?: string): Promise<Question[]> {
    const prompt = `Create challenging quiz questions for these words${context ? ` in the context of ${context}` : ''}:
${words.map(w => `- ${w.value}: ${w.meaning}`).join('\n')}

Instructions:
1. Create one quiz question for each word
2. Each question should have exactly 4 options
3. Make questions challenging and context-aware when possible`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: "You are a language learning quiz generator. Create challenging, context-aware questions with exactly 4 options each."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 1000,
        response_format: zodResponseFormat(QuestionsResponseSchema, "questions"),
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content in response');
      
      const parsed = JSON.parse(content);
      return parsed.questions || [];
    } catch (error) {
      console.error('Error creating quiz questions:', error);
      return [];
    }
  }
};