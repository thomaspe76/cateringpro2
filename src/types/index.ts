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
  name: string;
  type: ClientType;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
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
  tags?: string[];
  customerSince: string;
}

export interface ClientFormData {
  name: string;
  type: ClientType;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  salutation?: Salutation;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  companyName?: string;
  industry?: string;
  vatId?: string;
  companySize?: CompanySize;
  primaryContactFirstName?: string;
  primaryContactLastName?: string;
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
  dietaryPreferences?: string;
  allergies?: string;
  preferences?: string;
  paymentTerms?: string;
  paymentMethod?: PaymentMethod;
  accountManager?: string;
  source?: string;
  newsletter: boolean;
  referralSource?: string;
  marketingConsent: boolean;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
}

export interface Event {
  id: string;
  name: string;
  clientId: string;
  client?: Client;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  guests: number;
  description?: string;
  status: 'angefragt' | 'geplant' | 'bestätigt' | 'abgeschlossen' | 'storniert';
  type: string;
  proposalId?: string;
  staffIds?: string[];
  menuIds?: string[];
  equipmentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  id: string;
  clientId: string;
  client?: Client;
  eventName: string;
  eventDate: string;
  amount: number;
  status: 'entwurf' | 'gesendet' | 'akzeptiert' | 'abgelehnt';
  validUntil: string;
  eventId?: string;
  items: ProposalItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProposalItem {
  id: string;
  category: 'menu' | 'beverage' | 'staff' | 'equipment' | 'venue' | 'other';
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  totalPrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: 'vorspeise' | 'hauptgang' | 'dessert' | 'beilage' | 'snack' | 'getränk';
  price: number;
  costPrice?: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  allergens?: string[];
  ingredients?: string[];
  imageUrl?: string;
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  pricePerPerson: number;
  costPerPerson?: number;
}

export interface Staff {
  id: string;
  name: string;
  position: 'küchenchef' | 'koch' | 'service' | 'barkeeper' | 'fahrer' | 'helfer';
  hourlyRate: number;
  phone?: string;
  email?: string;
  availability?: Availability[];
}

export interface Availability {
  date: string;
  startTime: string;
  endTime: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'geschirr' | 'besteck' | 'gläser' | 'tische' | 'stühle' | 'dekoration' | 'technik' | 'anderes';
  quantity: number;
  inStock: number;
  rentalCost?: number;
  replacementCost?: number;
  notes?: string;
}

export interface Inventory {
  id: string;
  name: string;
  category: string;
  unitType: string;
  quantity: number;
  minimumStock: number;
  costPerUnit: number;
  supplier?: string;
  location?: string;
  lastRestocked?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  category: string[];
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'hoch' | 'mittel' | 'niedrig';
  assignedTo?: string;
  relatedTo?: {
    type: 'event' | 'proposal' | 'client';
    id: string;
  };
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateEventRequest {
  name: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  guests: number;
  description?: string;
  status: Event['status'];
  type: string;
  proposalId?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

export interface CreateProposalRequest {
  clientId: string;
  eventName: string;
  eventDate: string;
  validUntil: string;
  items: Omit<ProposalItem, 'id'>[];
}

export interface UpdateProposalRequest extends Partial<CreateProposalRequest> {
  id: string;
  status?: Proposal['status'];
}

export interface EventFormData {
  name: string;
  client: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  guests: number;
  description?: string;
  status: string;
  type: string;
}

export interface ProposalFormData {
  client: string;
  eventName: string;
  eventDate: string;
  validUntil: string;
  items: {
    category: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    unit: string;
  }[];
} 