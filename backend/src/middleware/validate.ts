import { body, param, query } from 'express-validator';
import { validateRequest } from './validateRequest';
import mongoose from 'mongoose';

// Custom validator for MongoDB ObjectId
const isValidObjectId = (value: string) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const validate = {
  listId: [
    param('listId')
      .custom(isValidObjectId)
      .withMessage('Invalid list ID format'),
    validateRequest
  ],

  id: [
    param('id')
      .custom(isValidObjectId)
      .withMessage('Invalid list ID format'),
    validateRequest
  ],

  wordId: [
    param('wordId')
      .custom(isValidObjectId)
      .withMessage('Invalid word ID format'),
    validateRequest
  ],

  createList: [
    body('name').trim().notEmpty().withMessage('List name is required'),
    body('description').optional().trim(),
    body('context').optional().trim(),
    validateRequest
  ],

  updateList: [
    body('name').optional().trim().notEmpty().withMessage('List name cannot be empty'),
    body('description').optional().trim(),
    body('context').optional().trim(),
    validateRequest
  ],

  addWord: [
    body('word').trim().notEmpty().withMessage('Word is required'),
    validateRequest
  ]
}; 