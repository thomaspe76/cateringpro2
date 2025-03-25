export type OrderType = 'with_staff' | 'with_staff_and_delivery' | 'delivery_only' | 'self_pickup';
export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type ProposalItemCategory = 'food' | 'beverages' | 'staff' | 'delivery' | 'equipment' | 'other';

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  taxId?: string;
  vatId?: string;
}

export interface ProposalSubItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  description?: string;
}

export interface ProposalItem {
  id: string;
  category: ProposalItemCategory;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  subItems?: ProposalSubItem[];
  notes?: string;
}

export interface Proposal {
  id: string;
  number: string;
  clientId: string;
  eventId?: string;
  eventName: string;
  orderType: OrderType;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
  expiryDate: string;
  introText: string;
  items: ProposalItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  termsAndConditions?: string;
  paymentTerms?: string;
  companyInfo: CompanyInfo;
  clientInfo: {
    name: string;
    address: string;
    contactPerson?: string;
    email: string;
    phone?: string;
  };
  settings: {
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
    showPrices: boolean;
    showTaxes: boolean;
    showTotals: boolean;
  };
  emailTemplates: {
    subject: string;
    body: string;
    footer?: string;
  };
  tags?: string[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }[];
  history: {
    id: string;
    date: string;
    action: string;
    userId: string;
    details?: string;
  }[];
}

export interface ProposalFormData {
  clientId: string;
  eventId?: string;
  eventName: string;
  eventDate: string;
  orderType: OrderType;
  introText: string;
  expiryDate: string;
  eventFormat: string;
  items: ProposalItem[];
  taxRate: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  paymentInstructions: string;
  depositAmount: number;
  termsAndConditions: string;
  tags: string[];
}

export interface ProposalEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isDefault: boolean;
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
} 