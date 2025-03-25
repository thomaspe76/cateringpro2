import { Types } from 'mongoose';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';
import { Offer } from '../models/Offer';
import { Order } from '../models/Order';
import { UserSettings } from '../models/UserSettings';

// Hilfsfunktion zum Generieren einer Demo-ID
const generateDemoId = (prefix: string) => `demo_${prefix}_${new Types.ObjectId()}`;

// Beispieldaten für Kunden
export const demoCustomers = [
  {
    _id: generateDemoId('customer'),
    name: 'TechConnect GmbH',
    type: 'company',
    email: 'events@techconnect.de',
    phone: '+49 123 456789',
    address: 'Innovationsstraße 1, 10115 Berlin',
    notes: 'Großes Unternehmen, regelmäßige Events, bevorzugt moderne Küche'
  },
  {
    _id: generateDemoId('customer'),
    name: 'Blumen Müller KG',
    type: 'company',
    email: 'info@blumen-mueller.de',
    phone: '+49 234 567890',
    address: 'Blumenweg 5, 10115 Berlin',
    notes: 'Kleines Unternehmen, gelegentliche Events'
  },
  {
    _id: generateDemoId('customer'),
    name: 'Familie Schmidt',
    type: 'private',
    email: 'schmidt@email.de',
    phone: '+49 345 678901',
    address: 'Familienstraße 10, 10115 Berlin',
    notes: 'Hochzeit, 85 Gäste, All-Inclusive gewünscht'
  },
  {
    _id: generateDemoId('customer'),
    name: 'Peter Wagner',
    type: 'private',
    email: 'wagner@email.de',
    phone: '+49 456 789012',
    address: 'Privatweg 15, 10115 Berlin',
    notes: 'Geburtstagsfeier, 30 Gäste'
  },
  {
    _id: generateDemoId('customer'),
    name: 'Stadtmuseum e.V.',
    type: 'organization',
    email: 'events@stadtmuseum.de',
    phone: '+49 567 890123',
    address: 'Museumsplatz 1, 10115 Berlin',
    notes: 'Kulturelle Veranstaltungen, Vernissagen'
  }
];

// Beispieldaten für Produkte
export const demoProducts = [
  {
    _id: generateDemoId('product'),
    name: 'Fingerfood-Menü',
    description: 'Verschiedene Canapés, Antipasti und kleine Snacks',
    price: 25,
    category: 'menu',
    unit: 'person',
    status: 'active'
  },
  {
    _id: generateDemoId('product'),
    name: '3-Gang-Menü',
    description: 'Suppe, Hauptgang mit Beilagen, Dessert',
    price: 45,
    category: 'menu',
    unit: 'person',
    status: 'active'
  },
  {
    _id: generateDemoId('product'),
    name: 'Buffet',
    description: 'Vorspeisen, Hauptgerichte, Beilagen, Desserts',
    price: 35,
    category: 'menu',
    unit: 'person',
    status: 'active'
  },
  {
    _id: generateDemoId('product'),
    name: 'Getränkepaket Basis',
    description: 'Softdrinks, Kaffee, Tee',
    price: 15,
    category: 'beverages',
    unit: 'person',
    status: 'active'
  },
  {
    _id: generateDemoId('product'),
    name: 'Getränkepaket Premium',
    description: 'Basis + Bier, Wein, Sekt',
    price: 25,
    category: 'beverages',
    unit: 'person',
    status: 'active'
  },
  {
    _id: generateDemoId('product'),
    name: 'Servicepersonal',
    description: 'Servicekraft pro Stunde',
    price: 25,
    category: 'staff',
    unit: 'hour',
    status: 'active'
  },
  {
    _id: generateDemoId('product'),
    name: 'Geschirr-Set',
    description: 'Komplettes Geschirr-Set pro Person',
    price: 5,
    category: 'equipment',
    unit: 'person',
    status: 'active'
  }
];

// Beispieldaten für Angebote
export const demoOffers = [
  {
    _id: generateDemoId('offer'),
    customer: demoCustomers[0]._id,
    items: [
      { product: demoProducts[1]._id, quantity: 120, price: demoProducts[1].price },
      { product: demoProducts[4]._id, quantity: 120, price: demoProducts[4].price },
      { product: demoProducts[5]._id, quantity: 8, price: demoProducts[5].price },
      { product: demoProducts[6]._id, quantity: 120, price: demoProducts[6].price }
    ],
    totalAmount: 12000,
    status: 'draft',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    notes: 'Jahreskonferenz mit 120 Teilnehmern',
    orderType: 'with_staff'
  },
  {
    _id: generateDemoId('offer'),
    customer: demoCustomers[2]._id,
    items: [
      { product: demoProducts[2]._id, quantity: 85, price: demoProducts[2].price },
      { product: demoProducts[4]._id, quantity: 85, price: demoProducts[4].price },
      { product: demoProducts[5]._id, quantity: 6, price: demoProducts[5].price },
      { product: demoProducts[6]._id, quantity: 85, price: demoProducts[6].price }
    ],
    totalAmount: 6375,
    status: 'sent',
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    notes: 'Hochzeitsfeier mit 85 Gästen',
    orderType: 'delivery_with_staff'
  },
  {
    _id: generateDemoId('offer'),
    customer: demoCustomers[3]._id,
    items: [
      { product: demoProducts[0]._id, quantity: 30, price: demoProducts[0].price },
      { product: demoProducts[3]._id, quantity: 30, price: demoProducts[3].price },
      { product: demoProducts[6]._id, quantity: 30, price: demoProducts[6].price }
    ],
    totalAmount: 1950,
    status: 'accepted',
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    notes: 'Geburtstagsfeier mit 30 Gästen',
    orderType: 'delivery'
  },
  {
    _id: generateDemoId('offer'),
    customer: demoCustomers[4]._id,
    items: [
      { product: demoProducts[0]._id, quantity: 50, price: demoProducts[0].price },
      { product: demoProducts[4]._id, quantity: 50, price: demoProducts[4].price },
      { product: demoProducts[6]._id, quantity: 50, price: demoProducts[6].price }
    ],
    totalAmount: 3250,
    status: 'rejected',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notes: 'Vernissage im Stadtmuseum',
    orderType: 'self_pickup'
  }
];

// Beispieldaten für Benutzereinstellungen
export const demoUserSettings = {
  theme: 'light',
  language: 'de',
  notifications: {
    email: true,
    push: true,
    orderUpdates: true,
    offerUpdates: true
  },
  displaySettings: {
    defaultView: 'list',
    itemsPerPage: 10,
    showDemoData: true
  },
  defaultValues: {
    customerType: 'private',
    paymentMethod: 'bank_transfer',
    deliveryAddress: '',
    defaultTaxRate: 19,
    defaultCurrency: 'EUR'
  },
  userData: {
    customers: {
      favorites: [demoCustomers[0]._id, demoCustomers[2]._id],
      recentlyViewed: [demoCustomers[0]._id, demoCustomers[2]._id, demoCustomers[1]._id],
      customCategories: [
        {
          name: 'VIP-Kunden',
          color: '#FFD700',
          customerIds: [demoCustomers[0]._id]
        }
      ]
    },
    products: {
      favorites: [demoProducts[1]._id, demoProducts[4]._id],
      recentlyViewed: [demoProducts[1]._id, demoProducts[4]._id, demoProducts[0]._id],
      customCategories: [
        {
          name: 'Hauptmenüs',
          color: '#4CAF50',
          productIds: [demoProducts[1]._id, demoProducts[2]._id]
        }
      ]
    },
    orders: {
      favorites: [],
      recentlyViewed: [],
      customStatuses: []
    },
    offers: {
      favorites: [demoOffers[0]._id],
      recentlyViewed: [demoOffers[0]._id, demoOffers[1]._id],
      customStatuses: []
    },
    dashboard: {
      widgets: [
        { id: 'recentOrders', position: { x: 0, y: 0 } },
        { id: 'upcomingEvents', position: { x: 1, y: 0 } }
      ]
    },
    calendar: {
      view: 'week',
      workingHours: {
        start: '08:00',
        end: '20:00'
      },
      defaultView: 'week'
    },
    documents: {
      templates: [],
      recentlyOpened: []
    }
  }
};

// Funktion zum Erstellen aller Beispieldaten
export const createDemoData = async (userId: string) => {
  try {
    // Kunden erstellen
    const customers = await Customer.insertMany(demoCustomers);
    
    // Produkte erstellen
    const products = await Product.insertMany(demoProducts);
    
    // Angebote erstellen
    const offers = await Offer.insertMany(demoOffers);
    
    // Benutzereinstellungen erstellen
    await UserSettings.create({
      userId,
      ...demoUserSettings
    });
    
    return {
      success: true,
      data: {
        customers: customers.length,
        products: products.length,
        offers: offers.length
      }
    };
  } catch (error) {
    console.error('Fehler beim Erstellen der Beispieldaten:', error);
    return {
      success: false,
      error: 'Fehler beim Erstellen der Beispieldaten'
    };
  }
};

// Funktion zum Entfernen aller Beispieldaten
export const clearDemoData = async (userId: string) => {
  try {
    // Beispieldaten aus allen Collections entfernen
    await Customer.deleteMany({ _id: { $regex: '^demo_' } });
    await Product.deleteMany({ _id: { $regex: '^demo_' } });
    await Offer.deleteMany({ _id: { $regex: '^demo_' } });
    await UserSettings.deleteOne({ userId });
    
    return {
      success: true,
      message: 'Beispieldaten erfolgreich entfernt'
    };
  } catch (error) {
    console.error('Fehler beim Entfernen der Beispieldaten:', error);
    return {
      success: false,
      error: 'Fehler beim Entfernen der Beispieldaten'
    };
  }
};

// Funktion zum Prüfen, ob es sich um Beispieldaten handelt
export const isDemoData = (id: string): boolean => {
  return id.startsWith('demo_');
}; 