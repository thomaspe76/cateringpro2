import { Proposal, ProposalStatus, OrderType, ItemCategory } from '../types/proposal';

export const mockProposals: Proposal[] = [
  {
    id: '1',
    number: 'ANG-2024-001',
    clientId: 'Kunde 1',
    eventName: 'Firmenjubiläum',
    eventDate: '2024-06-15',
    eventFormat: 'Buffet',
    eventStartTime: '18:00',
    eventEndTime: '23:00',
    eventLocation: 'Festsaal',
    eventAddress: 'Musterstraße 1, 12345 Berlin',
    guests: 50,
    status: 'sent' as ProposalStatus,
    orderType: 'with_staff' as OrderType,
    introText: 'Sehr geehrte Damen und Herren, vielen Dank für Ihr Interesse an unserem Catering-Service.',
    items: [
      {
        id: '1',
        name: 'Kaltes Buffet',
        description: 'Verschiedene kalte Speisen',
        quantity: 1,
        unit: 'Buffet',
        unitPrice: 500,
        category: 'food' as ItemCategory,
        taxRate: 19
      },
      {
        id: '2',
        name: 'Servicepersonal',
        description: '2 Personen für 5 Stunden',
        quantity: 2,
        unit: 'Person',
        unitPrice: 25,
        category: 'staff' as ItemCategory,
        taxRate: 19
      }
    ],
    subtotal: 550,
    taxRate: 19,
    taxAmount: 104.50,
    totalAmount: 654.50,
    validUntil: '2024-05-15',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    history: [
      {
        id: '1',
        date: '2024-03-15T10:00:00Z',
        action: 'Angebot erstellt',
        details: 'Angebot wurde als Entwurf erstellt',
        user: 'Max Mustermann'
      }
    ]
  },
  {
    id: '2',
    number: 'ANG-2024-002',
    clientId: 'Kunde 2',
    eventName: 'Hochzeit',
    eventDate: '2024-08-20',
    eventFormat: 'Menü',
    eventStartTime: '16:00',
    eventEndTime: '02:00',
    eventLocation: 'Schlossgarten',
    eventAddress: 'Schlossallee 10, 54321 München',
    guests: 100,
    status: 'draft' as ProposalStatus,
    orderType: 'with_staff_and_delivery' as OrderType,
    introText: 'Herzlichen Glückwunsch zur Hochzeit! Wir freuen uns, Sie bei diesem besonderen Anlass unterstützen zu dürfen.',
    items: [
      {
        id: '1',
        name: '3-Gänge-Menü',
        description: 'Vorspeise, Hauptgang, Dessert',
        quantity: 100,
        unit: 'Portion',
        unitPrice: 45,
        category: 'food' as ItemCategory,
        taxRate: 19
      },
      {
        id: '2',
        name: 'Servicepersonal',
        description: '5 Personen für 10 Stunden',
        quantity: 5,
        unit: 'Person',
        unitPrice: 25,
        category: 'staff' as ItemCategory,
        taxRate: 19
      },
      {
        id: '3',
        name: 'Lieferung',
        description: 'Anlieferung und Aufbau',
        quantity: 1,
        unit: 'Pauschale',
        unitPrice: 200,
        category: 'delivery' as ItemCategory,
        taxRate: 19
      }
    ],
    subtotal: 5125,
    taxRate: 19,
    taxAmount: 973.75,
    totalAmount: 6098.75,
    validUntil: '2024-07-20',
    createdAt: '2024-03-16T14:30:00Z',
    updatedAt: '2024-03-16T14:30:00Z',
    history: [
      {
        id: '1',
        date: '2024-03-16T14:30:00Z',
        action: 'Angebot erstellt',
        details: 'Angebot wurde als Entwurf erstellt',
        user: 'Anna Schmidt'
      }
    ]
  }
]; 