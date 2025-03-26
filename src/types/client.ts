export type ClientType = 'business' | 'private';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
} 