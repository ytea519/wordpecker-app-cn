import axios, { AxiosInstance } from 'axios';
import { WordList, Word, Exercise, Question } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors and unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper type for API responses
type ApiResponse<T> = Promise<T>;

// Response types
interface LearnStartResponse {
  exercises: Exercise[];
}

interface LearnExercisesResponse {
  exercises: Exercise[];
}

interface QuizStartResponse {
  questions: Question[];
  total_questions: number;
}

interface QuizQuestionsResponse {
  questions: Question[];
  completed: boolean;
}

// need to manually create the tables in supabase...
export const apiService = {
  // Lists
  getLists: (): ApiResponse<WordList[]> => api.get('/api/lists'),
  getList: (id: string): ApiResponse<WordList> => api.get(`/api/lists/${id}`),
  createList: (data: Partial<WordList>): ApiResponse<WordList> => api.post('/api/lists', data),
  updateList: (id: string, data: Partial<WordList>): ApiResponse<WordList> => api.put(`/api/lists/${id}`, data),
  deleteList: async (listId: string): Promise<void> => {
    await api.delete(`/api/lists/${listId}`);
  },

  // Words
  getWords: (listId: string): ApiResponse<Word[]> => api.get(`/api/lists/${listId}/words`),
  addWord: (listId: string, word: string): ApiResponse<Word> => api.post(`/api/lists/${listId}/words`, { word }),
  deleteWord: (listId: string, wordId: string): ApiResponse<void> => api.delete(`/api/lists/${listId}/words/${wordId}`),

  // Learning
  startLearning: (listId: string): ApiResponse<LearnStartResponse> => 
    api.post(`/api/learn/${listId}/start`),
  getExercises: (listId: string): ApiResponse<LearnExercisesResponse> => 
    api.post(`/api/learn/${listId}/more`),

  // Quiz
  startQuiz: (listId: string): ApiResponse<QuizStartResponse> => 
    api.post(`/api/quiz/${listId}/start`),
  getQuestions: (listId: string): ApiResponse<QuizQuestionsResponse> => 
    api.post(`/api/quiz/${listId}/more`)
}; 