import mongoose, { Schema, Document } from 'mongoose';

export interface IWord extends Document {
  _id: mongoose.Types.ObjectId;
  list_id: mongoose.Types.ObjectId;
  value: string;
  meaning: string;
  created_at: Date;
  updated_at: Date;
}

const WordSchema = new Schema<IWord>({
  list_id: {
    type: Schema.Types.ObjectId,
    ref: 'WordList',
    required: true
  },
  value: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  meaning: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

export const Word = mongoose.model<IWord>('Word', WordSchema);