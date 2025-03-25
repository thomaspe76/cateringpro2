import { Event, EventFormData } from '../types/event';

// Mock-Daten für Events
let events: Event[] = [];

// Hilfsfunktion zum Generieren einer eindeutigen ID
const generateEventId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `E-${year}-${random}`;
};

export const eventService = {
  createEvent: async (formData: EventFormData): Promise<{ success: boolean; data?: Event; error?: string }> => {
    try {
      const now = new Date().toISOString();
      const newEvent: Event = {
        ...formData,
        id: generateEventId(),
        createdAt: now,
        updatedAt: now,
        status: 'angefragt',
      };

      events.push(newEvent);
      
      return {
        success: true,
        data: newEvent,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Fehler beim Erstellen des Events',
      };
    }
  },

  getEvents: async (): Promise<Event[]> => {
    return events;
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    return events.find(event => event.id === id);
  },

  updateEvent: async (id: string, data: Partial<Event>): Promise<{ success: boolean; data?: Event; error?: string }> => {
    try {
      const index = events.findIndex(event => event.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Event nicht gefunden',
        };
      }

      events[index] = {
        ...events[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: events[index],
      };
    } catch (error) {
      return {
        success: false,
        error: 'Fehler beim Aktualisieren des Events',
      };
    }
  },

  deleteEvent: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const index = events.findIndex(event => event.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Event nicht gefunden',
        };
      }

      events.splice(index, 1);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Fehler beim Löschen des Events',
      };
    }
  },
}; 