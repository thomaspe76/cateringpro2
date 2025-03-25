import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { Event } from '../models/Event';
import { IUser } from '../models/User';

interface AuthRequest extends express.Request {
  user?: IUser;
}

const router = express.Router();

// Alle Events abrufen (nur für Admin)
router.get('/', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const events = await Event.find();
    return res.json(events);
  } catch (error) {
    console.error('Fehler beim Abrufen der Events:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Events' });
  }
});

// Neues Event erstellen (für alle authentifizierten Benutzer)
router.post('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const event = new Event(req.body);
    await event.save();
    return res.status(201).json(event);
  } catch (error) {
    console.error('Fehler beim Erstellen des Events:', error);
    return res.status(500).json({ message: 'Fehler beim Erstellen des Events' });
  }
});

// Event nach ID abrufen (für alle authentifizierten Benutzer)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event nicht gefunden' });
    }
    return res.json(event);
  } catch (error) {
    console.error('Fehler beim Abrufen des Events:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen des Events' });
  }
});

// Event aktualisieren (für alle authentifizierten Benutzer)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event nicht gefunden' });
    }
    return res.json(event);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Events:', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des Events' });
  }
});

// Event löschen (nur für Admins)
router.delete('/:id', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event nicht gefunden' });
    }
    return res.json({ message: 'Event erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Events:', error);
    return res.status(500).json({ message: 'Fehler beim Löschen des Events' });
  }
});

export default router; 