import { Proposal, ProposalStatus, OrderType } from '../types/proposal';

export const mockProposals: Proposal[] = [
  {
    id: '1',
    number: 'AN-2024-001',
    clientId: 'CL-001',
    eventId: 'EV-001',
    eventName: 'Weihnachtsfeier 2024',
    orderType: 'with_staff_and_delivery',
    status: 'sent',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    validUntil: '2024-04-15T23:59:59Z',
    expiryDate: '2024-04-15T23:59:59Z',
    introText: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage. Wir freuen uns, Ihnen ein individuelles Angebot für Ihre Weihnachtsfeier unterbreiten zu können.',
    items: [
      {
        id: '1',
        category: 'food',
        name: 'Weihnachtliches 3-Gänge-Menü',
        description: 'Traditionelles Weihnachtsmenü mit Suppe, Hauptgang und Dessert',
        quantity: 50,
        unit: 'Portion',
        price: 45.00,
        total: 2250.00,
        subItems: [
          {
            id: '1-1',
            name: 'Kürbissuppe',
            quantity: 50,
            unit: 'Portion',
            price: 8.00,
            description: 'Cremige Kürbissuppe mit Croutons'
          },
          {
            id: '1-2',
            name: 'Gefüllte Pute',
            quantity: 50,
            unit: 'Portion',
            price: 25.00,
            description: 'Gefüllte Pute mit Rotkohl und Klößen'
          },
          {
            id: '1-3',
            name: 'Weihnachtspudding',
            quantity: 50,
            unit: 'Portion',
            price: 12.00,
            description: 'Klassischer Weihnachtspudding mit Vanillesauce'
          }
        ]
      },
      {
        id: '2',
        category: 'beverages',
        name: 'Getränkepaket',
        description: 'Auswahl an alkoholfreien Getränken',
        quantity: 50,
        unit: 'Person',
        price: 15.00,
        total: 750.00
      },
      {
        id: '3',
        category: 'staff',
        name: 'Servicepersonal',
        description: 'Erfahrenes Servicepersonal für die Bewirtung',
        quantity: 5,
        unit: 'Person',
        price: 150.00,
        total: 750.00
      },
      {
        id: '4',
        category: 'delivery',
        name: 'Lieferung',
        description: 'Lieferung und Aufbau vor Ort',
        quantity: 1,
        unit: 'Pauschale',
        price: 200.00,
        total: 200.00
      }
    ],
    subtotal: 3950.00,
    taxRate: 19,
    taxAmount: 750.50,
    totalAmount: 4700.50,
    notes: 'Bitte beachten Sie, dass die Preise für Getränke vor Ort separat abgerechnet werden.',
    termsAndConditions: 'Standard AGBs für Catering-Services',
    paymentTerms: 'Rechnungstellung erfolgt nach der Veranstaltung, Zahlungsziel 14 Tage',
    companyInfo: {
      name: 'CateringPro GmbH',
      address: 'Musterstraße 123, 12345 Berlin',
      phone: '+49 30 123456789',
      email: 'info@cateringpro.de',
      website: 'www.cateringpro.de',
      taxId: '123/456/78901',
      vatId: 'DE123456789'
    },
    clientInfo: {
      name: 'Musterfirma GmbH',
      address: 'Beispielweg 45, 54321 München',
      contactPerson: 'Max Mustermann',
      email: 'max.mustermann@musterfirma.de',
      phone: '+49 89 987654321'
    },
    settings: {
      language: 'de',
      currency: 'EUR',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: 'HH:mm',
      showPrices: true,
      showTaxes: true,
      showTotals: true
    },
    emailTemplates: {
      subject: 'Ihr Angebot für die Weihnachtsfeier 2024',
      body: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage. Wir freuen uns, Ihnen ein individuelles Angebot für Ihre Weihnachtsfeier unterbreiten zu können.\n\nMit freundlichen Grüßen\nIhr CateringPro Team',
      footer: 'CateringPro GmbH - Ihr Partner für exklusive Catering-Services'
    },
    tags: ['weihnachten', 'unternehmen', 'feier'],
    attachments: [
      {
        id: '1',
        name: 'AGBs.pdf',
        type: 'application/pdf',
        url: '/documents/agbs.pdf',
        size: 1024
      }
    ],
    history: [
      {
        id: '1',
        date: '2024-03-15T10:00:00Z',
        action: 'created',
        userId: 'US-001',
        details: 'Angebot erstellt'
      },
      {
        id: '2',
        date: '2024-03-15T11:00:00Z',
        action: 'sent',
        userId: 'US-001',
        details: 'Angebot per E-Mail versendet'
      }
    ]
  },
  {
    id: '2',
    number: 'AN-2024-002',
    clientId: 'CL-002',
    eventId: 'EV-002',
    eventName: 'Sommerfest 2024',
    orderType: 'delivery_only',
    status: 'draft',
    createdAt: '2024-03-16T09:00:00Z',
    updatedAt: '2024-03-16T09:00:00Z',
    validUntil: '2024-04-16T23:59:59Z',
    expiryDate: '2024-04-16T23:59:59Z',
    introText: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage. Wir freuen uns, Ihnen ein individuelles Angebot für Ihr Sommerfest unterbreiten zu können.',
    items: [
      {
        id: '1',
        category: 'food',
        name: 'Grillpaket Premium',
        description: 'Umfangreiches Grillpaket mit verschiedenen Fleischsorten und Beilagen',
        quantity: 100,
        unit: 'Person',
        price: 35.00,
        total: 3500.00
      },
      {
        id: '2',
        category: 'beverages',
        name: 'Getränkepaket',
        description: 'Auswahl an alkoholfreien Getränken',
        quantity: 100,
        unit: 'Person',
        price: 15.00,
        total: 1500.00
      },
      {
        id: '3',
        category: 'delivery',
        name: 'Lieferung',
        description: 'Lieferung und Aufbau vor Ort',
        quantity: 1,
        unit: 'Pauschale',
        price: 200.00,
        total: 200.00
      }
    ],
    subtotal: 5200.00,
    taxRate: 19,
    taxAmount: 988.00,
    totalAmount: 6188.00,
    notes: 'Bitte beachten Sie, dass die Preise für Getränke vor Ort separat abgerechnet werden.',
    termsAndConditions: 'Standard AGBs für Catering-Services',
    paymentTerms: 'Rechnungstellung erfolgt nach der Veranstaltung, Zahlungsziel 14 Tage',
    companyInfo: {
      name: 'CateringPro GmbH',
      address: 'Musterstraße 123, 12345 Berlin',
      phone: '+49 30 123456789',
      email: 'info@cateringpro.de',
      website: 'www.cateringpro.de',
      taxId: '123/456/78901',
      vatId: 'DE123456789'
    },
    clientInfo: {
      name: 'Beispiel GmbH',
      address: 'Testweg 78, 98765 Hamburg',
      contactPerson: 'Anna Schmidt',
      email: 'anna.schmidt@beispiel.de',
      phone: '+49 40 123456789'
    },
    settings: {
      language: 'de',
      currency: 'EUR',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: 'HH:mm',
      showPrices: true,
      showTaxes: true,
      showTotals: true
    },
    emailTemplates: {
      subject: 'Ihr Angebot für das Sommerfest 2024',
      body: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage. Wir freuen uns, Ihnen ein individuelles Angebot für Ihr Sommerfest unterbreiten zu können.\n\nMit freundlichen Grüßen\nIhr CateringPro Team',
      footer: 'CateringPro GmbH - Ihr Partner für exklusive Catering-Services'
    },
    tags: ['sommer', 'fest', 'grillen'],
    history: [
      {
        id: '1',
        date: '2024-03-16T09:00:00Z',
        action: 'created',
        userId: 'US-001',
        details: 'Angebot erstellt'
      }
    ]
  }
]; 