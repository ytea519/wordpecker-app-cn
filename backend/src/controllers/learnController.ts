import { Request, Response } from 'express';
import { WordList, Word } from '../models';
import { Exercise, ExerciseResponse } from '../types';
import { openaiService } from '../services/openaiService';
import { shuffleArray } from '../utils/arrayUtils';
import mongoose from 'mongoose';

export const learnController = {
  async startLearning(req: Request, res: Response) {
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

      // Shuffle words and take 5 random ones
      const shuffledWords = shuffleArray(transformedWords);
      const selectedWords = shuffledWords.slice(0, Math.min(5, shuffledWords.length));

      // Generate exercises using OpenAI
      const exercises = await openaiService.createExercises(
        selectedWords,
        list.context
      );

      // Return both list and exercises
      res.json({
        exercises,
        list: {
          id: list._id.toString(),
          name: list.name,
          context: list.context
        }
      });
    } catch (error) {
      console.error('Start learning error:', error);
      res.status(500).json({ message: 'Error starting learning session' });
    }
  },

  async getMoreExercises(req: Request, res: Response) {
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

      // Generate exercises using OpenAI
      const exercises = await openaiService.createExercises(
        selectedWords,
        list.context
      );

      res.json({ exercises });
    } catch (error) {
      console.error('Get more exercises error:', error);
      res.status(500).json({ message: 'Error getting more exercises' });
    }
  }
}; 