import mongoose from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  notes?: string;
}

export interface IOrder extends mongoose.Document {
  customer: mongoose.Types.ObjectId;
  offer?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'draft' | 'confirmed' | 'in_preparation' | 'ready' | 'delivered' | 'cancelled';
  deliveryDate: Date;
  deliveryAddress: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'confirmed', 'in_preparation', 'ready', 'delivered', 'cancelled'],
    default: 'draft'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryAddress: {
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
orderSchema.index({ customer: 1, status: 1 });
orderSchema.index({ deliveryDate: 1 });
orderSchema.index({ offer: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema); 