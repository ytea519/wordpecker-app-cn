import { Request, Response } from 'express';
import { WordList, Word } from '../models';
import { Question, QuizResponse } from '../types';
import { openaiService } from '../services/openaiService';
import { shuffleArray } from '../utils/arrayUtils';
import mongoose from 'mongoose';

export const quizController = {
  async startQuiz(req: Request, res: Response) {
    try {
      const { listId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(404).json({ message: 'List not found' });
      }

      // First verify the list exists
      const list = await WordList.findById(listId).lean();

      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      // Get words for this list
      const words = await Word.find({ list_id: listId }).lean();

      if (!words.length) {
        return res.status(400).json({ message: 'List has no words' });
      }

      // Transform words to the format expected by openaiService
      const transformedWords = words.map(word => ({
        id: word._id.toString(),
        value: word.value,
        meaning: word.meaning
      }));

      // Shuffle the words array to randomize the quiz
      const shuffledWords = transformedWords.sort(() => Math.random() - 0.5);

      // Generate quiz questions using OpenAI
      const questions = await openaiService.createQuizQuestions(
        shuffledWords.slice(0, 5),
        list.context
      );

      // Return list details along with questions
      res.json({ 
        questions,
        total_questions: shuffledWords.length,
        list: {
          id: list._id.toString(),
          name: list.name,
          context: list.context
        }
      });
    } catch (error) {
      console.error('Start quiz error:', error);
      res.status(500).json({ message: 'Error starting quiz' });
    }
  },

  async getMoreQuestions(req: Request, res: Response) {
    try {
      const { listId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(404).json({ message: 'List not found' });
      }

      // First verify the list exists
      const list = await WordList.findById(listId).lean();

      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      // Get words for this list
      const words = await Word.find({ list_id: listId }).lean();

      if (!words.length) {
        return res.status(400).json({ message: 'List has no words' });
      }

      // Transform words to the format expected by openaiService
      const transformedWords = words.map(word => ({
        id: word._id.toString(),
        value: word.value,
        meaning: word.meaning
      }));

      // Shuffle all words and take 5 random ones
      const shuffledWords = shuffleArray(transformedWords);
      const selectedWords = shuffledWords.slice(0, Math.min(5, shuffledWords.length));

      // Generate quiz questions using OpenAI
      const questions = await openaiService.createQuizQuestions(
        selectedWords,
        list.context
      );

      res.json({ questions });
    } catch (error) {
      console.error('Get more questions error:', error);
      res.status(500).json({ message: 'Error getting more questions' });
    }
  }
}; 