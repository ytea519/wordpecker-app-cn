import { Request, Response } from 'express';
import { WordList, Word } from '../models';
import mongoose from 'mongoose';

export const listController = {
  async createList(req: Request, res: Response) {
    try {
      const { name, description, context } = req.body;

      const wordList = new WordList({
        name,
        description,
        context
      });

      const savedList = await wordList.save();
      
      // Convert to plain object and transform _id to id
      const responseData = {
        id: savedList._id.toString(),
        name: savedList.name,
        description: savedList.description,
        context: savedList.context,
        created_at: savedList.created_at.toISOString(),
        updated_at: savedList.updated_at.toISOString()
      };

      res.status(201).json(responseData);
    } catch (error) {
      console.error('Create list error:', error);
      res.status(500).json({ message: 'Error creating list' });
    }
  },

  async getLists(req: Request, res: Response) {
    try {
      const lists = await WordList.find()
        .sort({ created_at: -1 })
        .lean();

      // Transform MongoDB documents to API format
      const responseData = lists.map(list => ({
        id: list._id.toString(),
        name: list.name,
        description: list.description,
        context: list.context,
        created_at: list.created_at.toISOString(),
        updated_at: list.updated_at.toISOString()
      }));

      res.json(responseData);
    } catch (error) {
      console.error('Get lists error:', error);
      res.status(500).json({ message: 'Error fetching lists' });
    }
  },

  async getList(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'List not found' });
      }

      const list = await WordList.findById(id).lean();

      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      // Transform MongoDB document to API format
      const responseData = {
        id: list._id.toString(),
        name: list.name,
        description: list.description,
        context: list.context,
        created_at: list.created_at.toISOString(),
        updated_at: list.updated_at.toISOString()
      };

      res.json(responseData);
    } catch (error) {
      console.error('Get list error:', error);
      res.status(500).json({ message: 'Error fetching list' });
    }
  },

  async updateList(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, context } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'List not found' });
      }

      const updatedList = await WordList.findByIdAndUpdate(
        id,
        { name, description, context },
        { new: true, lean: true }
      );

      if (!updatedList) {
        return res.status(404).json({ message: 'List not found' });
      }

      // Transform MongoDB document to API format
      const responseData = {
        id: updatedList._id.toString(),
        name: updatedList.name,
        description: updatedList.description,
        context: updatedList.context,
        created_at: updatedList.created_at.toISOString(),
        updated_at: updatedList.updated_at.toISOString()
      };

      res.json(responseData);
    } catch (error) {
      console.error('Update list error:', error);
      res.status(500).json({ message: 'Error updating list' });
    }
  },

  async deleteList(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'List not found' });
      }

      // First delete all words in the list
      await Word.deleteMany({ list_id: id });

      // Then delete the list
      const deletedList = await WordList.findByIdAndDelete(id);

      if (!deletedList) {
        return res.status(404).json({ message: 'List not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete list error:', error);
      res.status(500).json({ message: 'Error deleting list' });
    }
  }
}; 