import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { Client } from '../models/Client';
import { IUser } from '../models/User';

interface AuthRequest extends express.Request {
  user?: IUser;
}

const router = express.Router();

// Alle Kunden abrufen (nur für Admin)
router.get('/', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const clients = await Client.find();
    return res.json(clients);
  } catch (error) {
    console.error('Fehler beim Abrufen der Kunden:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Kunden' });
  }
});

// Neuen Kunden erstellen (für alle authentifizierten Benutzer)
router.post('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const client = new Client(req.body);
    await client.save();
    return res.status(201).json(client);
  } catch (error) {
    console.error('Fehler beim Erstellen des Kunden:', error);
    return res.status(500).json({ message: 'Fehler beim Erstellen des Kunden' });
  }
});

// Kunde nach ID abrufen (für alle authentifizierten Benutzer)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Kunde nicht gefunden' });
    }
    return res.json(client);
  } catch (error) {
    console.error('Fehler beim Abrufen des Kunden:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen des Kunden' });
  }
});

// Kunde aktualisieren (für alle authentifizierten Benutzer)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Kunde nicht gefunden' });
    }
    return res.json(client);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Kunden:', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des Kunden' });
  }
});

// Kunde löschen (nur für Admins)
router.delete('/:id', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Kunde nicht gefunden' });
    }
    return res.json({ message: 'Kunde erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Kunden:', error);
    return res.status(500).json({ message: 'Fehler beim Löschen des Kunden' });
  }
});

export default router; 