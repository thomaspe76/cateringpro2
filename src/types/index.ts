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
  id: string;
  firstName: string;
  lastName: string;
  type: 'private' | 'business';
  companyName?: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  previousOrders: number;
  totalRevenue: number;
  lastEventDate?: string;
  customerSince: string;
  createdAt: string;
  updatedAt: string;
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

export interface ProposalItem {
  id: string;
  category: 'food' | 'beverage' | 'staff' | 'equipment' | 'other';
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  subItems?: Array<{
    id: string;
    name: string;
    description?: string;
    quantity?: number;
    unit?: string;
  }>;
}

export interface Proposal {
  id: string;
  number: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  title: string;
  client: Client;
  eventName: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventAddress?: string;
  eventType: string;
  orderType: 'self_pickup' | 'delivery' | 'delivery_with_staff' | 'with_staff';
  guests: number;
  introText?: string;
  items: ProposalItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  depositAmount?: number;
  depositDueDate?: string;
  paymentTerms: string;
  validUntil: string;
  termsAndConditions: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalFormData {
  clientId: string;
  client: Client | null;
  title: string;
  eventName: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventAddress: string;
  eventType: string;
  orderType: 'self_pickup' | 'delivery' | 'delivery_with_staff' | 'with_staff';
  guests: number;
  introText: string;
  items: ProposalItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  depositAmount: number;
  depositDueDate: string;
  paymentTerms: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  termsAndConditions: string;
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

export interface ProposalFilters {
  status?: Proposal['status'];
  orderType?: Proposal['orderType'];
  search?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export * from './client';
export * from './proposal'; 