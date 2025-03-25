import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: string;
  unit: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Vorspeise', 'Hauptspeise', 'Dessert', 'Getränk', 'Sonstiges']
  },
  unit: {
    type: String,
    required: true,
    trim: true,
    enum: ['Stück', 'Portion', 'Kilogramm', 'Liter', 'Packung']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index für schnelle Suche
productSchema.index({ name: 1, category: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema); 