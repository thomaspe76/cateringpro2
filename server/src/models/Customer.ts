import mongoose from 'mongoose';

export interface ICustomer extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
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

// Index für schnelle Suche
customerSchema.index({ name: 1, email: 1 });

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema); 