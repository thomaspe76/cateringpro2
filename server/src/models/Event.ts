import mongoose from 'mongoose';
import { IClient } from './Client';

export interface IEvent extends mongoose.Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  client: IClient['_id'];
  numberOfGuests: number;
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['planned', 'confirmed', 'completed', 'cancelled'],
    default: 'planned'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Event = mongoose.model<IEvent>('Event', eventSchema); 