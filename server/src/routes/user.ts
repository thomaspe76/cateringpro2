import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { User } from '../models/User';
import { IUser } from '../models/User';

interface AuthRequest extends express.Request {
  user?: IUser;
}

const router = express.Router();

// Alle Benutzer abrufen (nur für Admin)
router.get('/', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer' });
  }
});

// Neuen Benutzer erstellen (nur für Admin)
router.post('/', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
    return res.status(500).json({ message: 'Fehler beim Erstellen des Benutzers' });
  }
});

// Benutzer nach ID abrufen (für alle authentifizierten Benutzer)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen des Benutzers' });
  }
});

// Benutzer aktualisieren (für alle authentifizierten Benutzer)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des Benutzers' });
  }
});

// Benutzer löschen (nur für Admins)
router.delete('/:id', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    return res.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    return res.status(500).json({ message: 'Fehler beim Löschen des Benutzers' });
  }
});

export default router; 