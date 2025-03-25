import mongoose from 'mongoose';

export interface IOfferItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  notes?: string;
}

export interface IOffer extends mongoose.Document {
  customer: mongoose.Types.ObjectId;
  items: IOfferItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const offerItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
});

const offerSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [offerItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'sent', 'accepted', 'rejected'],
    default: 'draft'
  },
  validUntil: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index für schnelle Suche
offerSchema.index({ customer: 1, status: 1 });
offerSchema.index({ validUntil: 1 });

export const Offer = mongoose.model<IOffer>('Offer', offerSchema); 