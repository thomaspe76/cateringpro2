import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { Order } from '../models/Order';
import { IUser } from '../models/User';

interface AuthRequest extends express.Request {
  user?: IUser;
}

const router = express.Router();

// Alle Bestellungen abrufen (nur für Admin)
router.get('/', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const orders = await Order.find();
    return res.json(orders);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Bestellungen' });
  }
});

// Neue Bestellung erstellen (für alle authentifizierten Benutzer)
router.post('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    return res.status(201).json(order);
  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellung:', error);
    return res.status(500).json({ message: 'Fehler beim Erstellen der Bestellung' });
  }
});

// Bestellung nach ID abrufen (für alle authentifizierten Benutzer)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }
    return res.json(order);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellung:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Bestellung' });
  }
});

// Bestellung aktualisieren (für alle authentifizierten Benutzer)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }
    return res.json(order);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Bestellung:', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren der Bestellung' });
  }
});

// Bestellung löschen (nur für Admins)
router.delete('/:id', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }
    return res.json({ message: 'Bestellung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen der Bestellung:', error);
    return res.status(500).json({ message: 'Fehler beim Löschen der Bestellung' });
  }
});

export default router; 