import mongoose from 'mongoose';

export interface IDish {
  name: string;
  description: string;
  price: number;
  category: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
}

export interface IMenu extends mongoose.Document {
  name: string;
  description: string;
  dishes: IDish[];
  pricePerPerson: number;
  minimumGuests: number;
  maximumGuests: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dishSchema = new mongoose.Schema({
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
    trim: true
  },
  allergens: [{
    type: String,
    trim: true
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  }
});

const menuSchema = new mongoose.Schema({
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
  dishes: [dishSchema],
  pricePerPerson: {
    type: Number,
    required: true,
    min: 0
  },
  minimumGuests: {
    type: Number,
    required: true,
    min: 1
  },
  maximumGuests: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Menu = mongoose.model<IMenu>('Menu', menuSchema); 