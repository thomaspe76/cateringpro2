import mongoose from 'mongoose';

export interface IEmployee extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'chef' | 'staff';
  isActive: boolean;
  hourlyRate: number;
  availability: {
    monday: { start: string; end: string }[];
    tuesday: { start: string; end: string }[];
    wednesday: { start: string; end: string }[];
    thursday: { start: string; end: string }[];
    friday: { start: string; end: string }[];
    saturday: { start: string; end: string }[];
    sunday: { start: string; end: string }[];
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
    pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  end: {
    type: String,
    required: true,
    pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
});

const availabilitySchema = new mongoose.Schema({
  monday: [timeSlotSchema],
  tuesday: [timeSlotSchema],
  wednesday: [timeSlotSchema],
  thursday: [timeSlotSchema],
  friday: [timeSlotSchema],
  saturday: [timeSlotSchema],
  sunday: [timeSlotSchema]
});

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
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
  role: {
    type: String,
    required: true,
    enum: ['admin', 'manager', 'chef', 'staff']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: availabilitySchema,
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
employeeSchema.index({ firstName: 1, lastName: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ role: 1, isActive: 1 });

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema); 