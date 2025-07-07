import { Request, Response } from 'express';
import { WordList, Word } from '../models';
import { openaiService } from '../services/openaiService';
import mongoose from 'mongoose';

export const wordController = {
  async addWord(req: Request, res: Response) {
    try {
      const { listId } = req.params;
      const { word: value } = req.body;

      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(404).json({ message: 'List not found' });
      }

      // First verify the list exists and get context
      const list = await WordList.findById(listId).lean();

      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      // Generate word meaning using OpenAI
      const meaning = await openaiService.generateWordMeaning(value, list.context);

      // Add the word with generated meaning
      const word = new Word({
        list_id: listId,
        value,
        meaning
      });

      const savedWord = await word.save();

      // Transform MongoDB document to API format
      const responseData = {
        id: savedWord._id.toString(),
        list_id: savedWord.list_id.toString(),
        value: savedWord.value,
        meaning: savedWord.meaning,
        created_at: savedWord.created_at.toISOString(),
        updated_at: savedWord.updated_at.toISOString()
      };

      res.status(201).json(responseData);
    } catch (error) {
      console.error('Add word error:', error);
      res.status(500).json({ message: 'Error adding word' });
    }
  },

  async getWords(req: Request, res: Response) {
    try {
      const { listId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(404).json({ message: 'List not found' });
      }

      // First verify the list exists
      const list = await WordList.findById(listId);

      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      const words = await Word.find({ list_id: listId })
        .sort({ created_at: 1 })
        .lean();

      // Transform MongoDB documents to API format
      const responseData = words.map(word => ({
        id: word._id.toString(),
        list_id: word.list_id.toString(),
        value: word.value,
        meaning: word.meaning,
        created_at: word.created_at.toISOString(),
        updated_at: word.updated_at.toISOString()
      }));

      res.json(responseData);
    } catch (error) {
      console.error('Get words error:', error);
      res.status(500).json({ message: 'Error fetching words' });
    }
  },

  async deleteWord(req: Request, res: Response) {
    try {
      const { listId, wordId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(listId) || !mongoose.Types.ObjectId.isValid(wordId)) {
        return res.status(404).json({ message: 'Word or list not found' });
      }

      // First verify the list exists
      const list = await WordList.findById(listId);

      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      const deletedWord = await Word.findOneAndDelete({
        _id: wordId,
        list_id: listId
      });

      if (!deletedWord) {
        return res.status(404).json({ message: 'Word not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete word error:', error);
      res.status(500).json({ message: 'Error deleting word' });
    }
  }
}; 