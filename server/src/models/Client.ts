import mongoose from 'mongoose';

export interface IClient extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Client = mongoose.model<IClient>('Client', clientSchema); 