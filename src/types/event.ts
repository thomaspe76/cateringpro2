export type EventStatus = 'angefragt' | 'geplant' | 'bestätigt' | 'abgeschlossen' | 'storniert';

export interface Event {
  id: string;
  name: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  guests: number;
  description?: string;
  status: EventStatus;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventStatusHistory {
  id: string;
  eventId: string;
  status: EventStatus;
  changedBy: string;
  changedAt: string;
  notes?: string;
}

export interface EventFormData extends Omit<Event, 'id' | 'createdAt' | 'updatedAt'> {
  menuItems?: string[];
  equipment?: string[];
  staff?: string[];
  documents?: File[];
} 