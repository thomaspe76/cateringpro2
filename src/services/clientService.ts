import { Client, ClientFormData, ClientUpdateStats } from '../types';

const generateClientId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CLT-${year}-${random}`;
};

const clients: Client[] = [
  {
    id: 'CLT-2024-0001',
    firstName: 'Max',
    lastName: 'Mustermann',
    type: 'private',
    email: 'max.mustermann@example.com',
    phone: '+49 123 456789',
    street: 'Musterstraße 1',
    postalCode: '12345',
    city: 'Berlin',
    country: 'Deutschland',
    previousOrders: 3,
    totalRevenue: 2500,
    lastEventDate: '2024-02-15',
    customerSince: '2024-01-01',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'CLT-2024-0002',
    firstName: 'Anna',
    lastName: 'Schmidt',
    type: 'business',
    companyName: 'Firma ABC GmbH',
    email: 'info@firma-abc.de',
    phone: '+49 987 654321',
    street: 'Geschäftsstraße 10',
    postalCode: '54321',
    city: 'Hamburg',
    country: 'Deutschland',
    previousOrders: 5,
    totalRevenue: 7500,
    lastEventDate: '2024-03-01',
    customerSince: '2024-01-15',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const convertFormDataToClient = (formData: ClientFormData): Partial<Client> => {
  const {
    primaryContactFirstName,
    primaryContactLastName,
    ...restData
  } = formData;

  return {
    ...restData,
    primaryContact: formData.type === 'business' && primaryContactFirstName && primaryContactLastName
      ? `${primaryContactFirstName} ${primaryContactLastName}`
      : undefined,
    dietaryPreferences: formData.dietaryPreferences ? formData.dietaryPreferences.split(',').map(item => item.trim()) : undefined,
    allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()) : undefined,
  };
};

class ClientService {
  private clients: Client[] = clients;

  async getClients(): Promise<Client[]> {
    return this.clients;
  }

  async getClient(id: string): Promise<Client | null> {
    return this.clients.find(client => client.id === id) || null;
  }

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: `CLT-${new Date().getFullYear()}-${(this.clients.length + 1).toString().padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.clients.push(newClient);
    return newClient;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client | null> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.clients[index] = {
      ...this.clients[index],
      ...client,
      updatedAt: new Date().toISOString(),
    };
    return this.clients[index];
  }

  async deleteClient(id: string): Promise<boolean> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.clients.splice(index, 1);
    return true;
  }

  async getClientStats(id: string): Promise<{
    totalEvents: number;
    totalRevenue: number;
    averageOrderValue: number;
    lastEventDate?: string;
  }> {
    const client = await this.getClient(id);
    if (!client) {
      throw new Error('Kunde nicht gefunden');
    }

    return {
      totalEvents: client.previousOrders,
      totalRevenue: client.totalRevenue,
      averageOrderValue: client.previousOrders > 0 
        ? client.totalRevenue / client.previousOrders 
        : 0,
      lastEventDate: client.lastEventDate,
    };
  }

  async updateClientStats(id: string, eventAmount: number): Promise<void> {
    const client = await this.getClient(id);
    if (!client) return;

    const now = new Date().toISOString();
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return;

    this.clients[index] = {
      ...this.clients[index],
      previousOrders: client.previousOrders + 1,
      totalRevenue: client.totalRevenue + eventAmount,
      lastEventDate: now,
      updatedAt: now,
    };
  }
}

export const clientService = new ClientService(); 