export type ClientType = 'business' | 'private';
export type Salutation = 'Herr' | 'Frau' | 'Divers';
export type CompanySize = 'small' | 'medium' | 'large';
export type PreferredContactMethod = 'email' | 'phone' | 'whatsapp' | 'signal';
export type PaymentMethod = 'invoice' | 'direct_debit' | 'credit_card' | 'paypal';

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Client {
  // Basisdaten
  id: string;
  type: ClientType;
  createdAt: string;
  updatedAt: string;

  // Personendaten (Privatkunden)
  firstName?: string;
  lastName?: string;
  salutation?: Salutation;
  birthDate?: string;

  // Firmendaten (Firmenkunden)
  companyName?: string;
  industry?: string;
  vatId?: string;
  companySize?: CompanySize;

  // Kontaktdaten
  primaryContact?: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  preferredContactMethod: PreferredContactMethod;
  whatsappAvailable: boolean;
  signalAvailable: boolean;

  // Adressdaten
  street: string;
  postalCode: string;
  city: string;
  country: string;
  billingAddressSameAsMain: boolean;
  billingAddress?: Address;

  // Cateringspezifische Daten
  dietaryPreferences?: string[];
  allergies?: string[];
  preferences?: string;
  previousOrders: number;
  totalRevenue: number;
  lastEventDate?: string;

  // Vertragsdaten
  paymentTerms?: string;
  paymentMethod?: PaymentMethod;
  accountManager?: string;

  // Marketingdaten
  source?: string;
  newsletter: boolean;
  referralSource?: string;
  marketingConsent: boolean;

  // Notizen und Historie
  notes?: string;
  tags?: string[];
  customerSince: string;
}

export interface ClientFormData {
  type: ClientType;
  // Private client fields
  salutation?: Salutation;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  // Business client fields
  companyName?: string;
  industry?: string;
  vatId?: string;
  companySize?: CompanySize;
  primaryContactFirstName?: string;
  primaryContactLastName?: string;
  // Common fields
  email: string;
  phone: string;
  mobilePhone?: string;
  preferredContactMethod: PreferredContactMethod;
  whatsappAvailable: boolean;
  signalAvailable: boolean;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  billingAddressSameAsMain: boolean;
  billingAddress?: Address;
  // Catering specific
  dietaryPreferences?: string;
  allergies?: string;
  preferences?: string;
  // Contract data
  paymentTerms?: string;
  paymentMethod?: PaymentMethod;
  accountManager?: string;
  // Marketing data
  source?: string;
  newsletter: boolean;
  referralSource?: string;
  marketingConsent: boolean;
  // Notes and history
  notes?: string;
  tags?: string[];
}

export interface ClientStats {
  previousOrders: number;
  totalRevenue: number;
  lastEventDate?: string;
}

export interface ClientUpdateStats {
  previousOrders?: number;
  totalRevenue?: number;
  lastEventDate?: string;
}

export interface ClientFilters {
  type?: ClientType;
  search?: string;
  sortBy?: 'name' | 'date' | 'revenue';
  sortOrder?: 'asc' | 'desc';
  tags?: string[];
  newsletter?: boolean;
  hasEvents?: boolean;
} 