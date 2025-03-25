import { Client, ClientFormData, ClientUpdateStats } from '../types';

const generateClientId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CLT-${year}-${random}`;
};

const clients: Client[] = [
  {
    id: 'CLT-2024-0001',
    name: 'Max Mustermann',
    type: 'private',
    contactName: 'Max Mustermann',
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 123 456789',
    street: 'Musterstraße 1',
    postalCode: '12345',
    city: 'Berlin',
    country: 'Deutschland',
    preferredContactMethod: 'email',
    whatsappAvailable: true,
    signalAvailable: false,
    billingAddressSameAsMain: true,
    previousOrders: 3,
    totalRevenue: 2500,
    lastEventDate: '2024-02-15',
    newsletter: true,
    marketingConsent: true,
    customerSince: '2024-01-01',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'CLT-2024-0002',
    name: 'Firma ABC GmbH',
    type: 'business',
    contactName: 'Anna Schmidt',
    companyName: 'Firma ABC GmbH',
    industry: 'IT',
    vatId: 'DE123456789',
    companySize: 'medium',
    primaryContact: 'Anna Schmidt',
    email: 'info@firma-abc.de',
    phone: '+49 987 654321',
    street: 'Geschäftsstraße 10',
    postalCode: '54321',
    city: 'Hamburg',
    country: 'Deutschland',
    preferredContactMethod: 'phone',
    whatsappAvailable: false,
    signalAvailable: false,
    billingAddressSameAsMain: true,
    previousOrders: 5,
    totalRevenue: 7500,
    lastEventDate: '2024-03-01',
    paymentMethod: 'invoice',
    accountManager: 'John Doe',
    newsletter: false,
    marketingConsent: true,
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

const clientService = {
  createClient: async (data: ClientFormData): Promise<{ success: boolean; data?: Client; error?: string }> => {
    try {
      const clientData = convertFormDataToClient(data);
      const newClient: Client = {
        id: generateClientId(),
        ...clientData,
        previousOrders: 0,
        totalRevenue: 0,
        customerSince: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Client;

      clients.push(newClient);
      return { success: true, data: newClient };
    } catch (error) {
      return { success: false, error: 'Fehler beim Erstellen des Kunden' };
    }
  },

  updateClient: async (id: string, data: ClientFormData): Promise<{ success: boolean; data?: Client; error?: string }> => {
    try {
      const index = clients.findIndex(c => c.id === id);
      if (index === -1) {
        return { success: false, error: 'Kunde nicht gefunden' };
      }

      const clientData = convertFormDataToClient(data);
      clients[index] = {
        ...clients[index],
        ...clientData,
        updatedAt: new Date().toISOString(),
      };

      return { success: true, data: clients[index] };
    } catch (error) {
      return { success: false, error: 'Fehler beim Aktualisieren des Kunden' };
    }
  },

  deleteClient: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const index = clients.findIndex(c => c.id === id);
      if (index === -1) {
        return { success: false, error: 'Kunde nicht gefunden' };
      }
      clients.splice(index, 1);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Fehler beim Löschen des Kunden' };
    }
  },

  getClient: async (id: string): Promise<Client | null> => {
    return clients.find(c => c.id === id) || null;
  },

  getClients: async (filters?: {
    type?: 'private' | 'business';
    search?: string;
    tags?: string[];
    newsletter?: boolean;
    eventHistory?: boolean;
    sortBy?: 'name' | 'createdAt' | 'lastEventDate';
    sortOrder?: 'asc' | 'desc';
  }): Promise<Client[]> => {
    let filteredClients = [...clients];

    if (filters?.type) {
      filteredClients = filteredClients.filter(c => c.type === filters.type);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredClients = filteredClients.filter(c => {
        const name = c.type === 'private'
          ? `${c.firstName || ''} ${c.lastName || ''}`
          : c.companyName || '';
        return name.toLowerCase().includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm) ||
          c.phone.toLowerCase().includes(searchTerm);
      });
    }

    if (filters?.tags?.length) {
      filteredClients = filteredClients.filter(c =>
        filters.tags!.every(tag => c.tags?.includes(tag))
      );
    }

    if (filters?.newsletter !== undefined) {
      filteredClients = filteredClients.filter(c => c.newsletter === filters.newsletter);
    }

    if (filters?.eventHistory) {
      filteredClients = filteredClients.filter(c => c.previousOrders > 0);
    }

    if (filters?.sortBy) {
      filteredClients.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'name':
            const nameA = a.type === 'private'
              ? `${a.firstName || ''} ${a.lastName || ''}`
              : a.companyName || '';
            const nameB = b.type === 'private'
              ? `${b.firstName || ''} ${b.lastName || ''}`
              : b.companyName || '';
            comparison = nameA.localeCompare(nameB);
            break;
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          case 'lastEventDate':
            comparison = new Date(a.lastEventDate || '').getTime() - new Date(b.lastEventDate || '').getTime();
            break;
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filteredClients;
  },

  searchClients: async (query: string): Promise<Client[]> => {
    const searchTerm = query.toLowerCase();
    return clients.filter(c => {
      const name = c.type === 'private'
        ? `${c.firstName || ''} ${c.lastName || ''}`
        : c.companyName || '';
      return name.toLowerCase().includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm) ||
        c.phone.toLowerCase().includes(searchTerm);
    });
  },

  // Zusätzliche Hilfsfunktionen
  getClientStats: async (id: string): Promise<{
    totalEvents: number;
    totalRevenue: number;
    averageOrderValue: number;
    lastEventDate?: string;
  }> => {
    const client = await clientService.getClient(id);
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
  },

  updateClientStats: async (id: string, eventAmount: number): Promise<void> => {
    const client = await clientService.getClient(id);
    if (!client) return;

    const now = new Date().toISOString();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return;

    const updateData: ClientUpdateStats = {
      previousOrders: client.previousOrders + 1,
      totalRevenue: client.totalRevenue + eventAmount,
      lastEventDate: now,
    };

    clients[index] = {
      ...clients[index],
      ...updateData,
      updatedAt: now,
    };
  },
};

export default clientService; 