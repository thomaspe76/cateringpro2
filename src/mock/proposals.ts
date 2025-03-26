import { Proposal } from '../types/proposal';

export const mockProposals: Proposal[] = [
  {
    id: '1',
    number: 'A-2024-001',
    clientId: 'client-1',
    eventName: 'Weihnachtsfeier 2024',
    eventFormat: 'Firmenfeier',
    eventDate: '2024-12-20',
    eventStartTime: '18:00',
    eventEndTime: '23:00',
    eventLocation: 'Festsaal Lindenhof',
    eventAddress: 'Lindenstraße 123, 12345 Berlin',
    guests: 100,
    status: 'sent',
    orderType: 'with_staff_and_delivery',
    introText: 'Vielen Dank für Ihre Anfrage. Wir freuen uns, Ihnen folgendes Angebot für Ihre Weihnachtsfeier unterbreiten zu können.',
    items: [
      {
        id: 'item-1',
        name: 'Weihnachtliches Buffet',
        description: 'Festliches Buffet mit traditionellen und modernen Gerichten',
        category: 'food',
        quantity: 100,
        unit: 'Person',
        unitPrice: 45.00,
        taxRate: 19,
        subItems: [
          {
            id: 'sub-1',
            name: 'Vorspeisen und Salate',
            quantity: 1,
            unit: 'Portion',
            price: 15.00
          },
          {
            id: 'sub-2',
            name: 'Hauptgerichte',
            quantity: 1,
            unit: 'Portion',
            price: 25.00
          }
        ]
      },
      {
        id: 'item-2',
        name: 'Getränkepauschale',
        description: 'Softgetränke, Bier, Wein und Sekt',
        category: 'beverage',
        quantity: 100,
        unit: 'Person',
        unitPrice: 29.00,
        taxRate: 19
      }
    ],
    subtotal: 7400.00,
    taxRate: 19,
    taxAmount: 1406.00,
    totalAmount: 8806.00,
    depositAmount: 2000.00,
    depositDueDate: '2024-11-20',
    depositReceived: false,
    paymentTerms: 'Zahlung innerhalb von 14 Tagen nach Rechnungsstellung',
    termsAndConditions: 'Es gelten unsere allgemeinen Geschäftsbedingungen',
    validUntil: '2024-11-01',
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-01T10:00:00Z',
    history: [
      {
        id: 'hist-1',
        date: '2024-10-01T10:00:00Z',
        action: 'Erstellt',
        details: 'Angebot wurde erstellt',
        user: 'Max Mustermann'
      },
      {
        id: 'hist-2',
        date: '2024-10-01T11:00:00Z',
        action: 'Gesendet',
        details: 'Angebot wurde per E-Mail versendet',
        user: 'Max Mustermann'
      }
    ],
    tags: ['weihnachten', 'firmenfeier'],
    companyInfo: {
      name: 'CateringPro GmbH',
      address: 'Hauptstraße 1, 10115 Berlin',
      phone: '+49 30 123456',
      email: 'info@cateringpro.de',
      website: 'www.cateringpro.de',
      taxId: 'DE123456789',
      vatId: 'UST-ID123'
    },
    settings: {
      template: 'premium',
      language: 'de',
      currency: 'EUR',
      taxRate: 19,
      showPrices: true,
      showSubItems: true
    },
    emailTemplates: [
      {
        id: 'template-1',
        name: 'Standard-Vorlage',
        subject: 'Ihr Angebot für die Weihnachtsfeier',
        body: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage...',
        isDefault: true
      }
    ],
    lastSentDate: '2024-10-01T11:00:00Z',
    createdBy: 'max.mustermann',
    lastModifiedBy: 'max.mustermann'
  },
  {
    id: '2',
    number: 'A-2024-002',
    clientId: 'client-2',
    eventName: 'Sommerfest 2024',
    eventFormat: 'Firmenevent',
    eventDate: '2024-07-15',
    eventStartTime: '14:00',
    eventEndTime: '22:00',
    eventLocation: 'Stadtpark',
    eventAddress: 'Parkweg 1, 12345 Berlin',
    guests: 150,
    status: 'draft',
    orderType: 'with_staff_and_delivery',
    introText: 'Hier finden Sie unser Angebot für Ihr Sommerfest.',
    items: [
      {
        id: 'item-3',
        name: 'BBQ-Buffet',
        description: 'Grillspezialitäten mit verschiedenen Beilagen',
        category: 'food',
        quantity: 150,
        unit: 'Person',
        unitPrice: 35.00,
        taxRate: 19
      },
      {
        id: 'item-4',
        name: 'Getränkepauschale',
        description: 'Alkoholfreie Getränke und Bier',
        category: 'beverage',
        quantity: 150,
        unit: 'Person',
        unitPrice: 25.00,
        taxRate: 19
      }
    ],
    subtotal: 9000.00,
    taxRate: 19,
    taxAmount: 1710.00,
    totalAmount: 10710.00,
    validUntil: '2024-06-15',
    createdAt: '2024-05-15T09:00:00Z',
    updatedAt: '2024-05-15T09:00:00Z',
    history: [
      {
        id: 'hist-3',
        date: '2024-05-15T09:00:00Z',
        action: 'Erstellt',
        details: 'Angebot wurde erstellt',
        user: 'Anna Schmidt'
      }
    ],
    tags: ['sommer', 'bbq'],
    companyInfo: {
      name: 'CateringPro GmbH',
      address: 'Hauptstraße 1, 10115 Berlin',
      phone: '+49 30 123456',
      email: 'info@cateringpro.de'
    },
    settings: {
      template: 'standard',
      language: 'de',
      currency: 'EUR',
      taxRate: 19,
      showPrices: true,
      showSubItems: true
    },
    createdBy: 'anna.schmidt',
    lastModifiedBy: 'anna.schmidt'
  }
]; 