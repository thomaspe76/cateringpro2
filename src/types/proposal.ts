import { Client } from './client';

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';
export type OrderType = 'self_pickup' | 'delivery' | 'delivery_with_staff' | 'with_staff';
export type ItemCategory = 'food' | 'beverage' | 'staff' | 'equipment' | 'other';

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  vatId?: string;
}

export interface ProposalSubItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  price?: number;
}

export interface ProposalItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  totalPrice: number;
  category: 'food' | 'beverage' | 'staff' | 'equipment' | 'other';
}

export interface ProposalHistory {
  id: string;
  date: string;
  action: string;
  details: string;
  user: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault?: boolean;
}

export interface ProposalDisplaySettings {
  template: string;
  language: string;
  currency: string;
  taxRate: number;
  showPrices: boolean;
  showSubItems: boolean;
}

export interface ProposalSettings {
  companyInfo: CompanyInfo;
  defaultTermsAndConditions: string;
  defaultPaymentInstructions: string;
  defaultTaxRate: number;
  defaultExpiryDays: number;
  emailTemplates: ProposalEmailTemplate[];
  defaultTags: {
    id: string;
    name: string;
    color: string;
  }[];
  display: ProposalDisplaySettings;
}

export interface Proposal {
  id: string;
  number: string;
  clientId: string;
  eventName: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  guests: number;
  eventLocation: string;
  items: ProposalItem[];
  taxRate: number;
  notes: string;
  status: ProposalStatus;
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
  orderType: OrderType;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalFormData {
  clientId: string;
  title: string;
  eventName: string;
  eventDate: string;
  eventTime?: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventAddress?: string;
  eventType: string;
  orderType: OrderType;
  guests: number;
  location: string;
  items: ProposalItem[];
  taxRate: number;
  notes: string;
  introText: string;
}

export interface ProposalEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isDefault: boolean;
} 