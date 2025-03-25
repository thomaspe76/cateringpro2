import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { Menu } from '../models/Menu';
import { IUser } from '../models/User';

interface AuthRequest extends express.Request {
  user?: IUser;
}

const router = express.Router();

// Alle Menüs abrufen (nur für Admin)
router.get('/', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const menus = await Menu.find();
    return res.json(menus);
  } catch (error) {
    console.error('Fehler beim Abrufen der Menüs:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Menüs' });
  }
});

// Neues Menü erstellen (für alle authentifizierten Benutzer)
router.post('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    return res.status(201).json(menu);
  } catch (error) {
    console.error('Fehler beim Erstellen des Menüs:', error);
    return res.status(500).json({ message: 'Fehler beim Erstellen des Menüs' });
  }
});

// Menü nach ID abrufen (für alle authentifizierten Benutzer)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menü nicht gefunden' });
    }
    return res.json(menu);
  } catch (error) {
    console.error('Fehler beim Abrufen des Menüs:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen des Menüs' });
  }
});

// Menü aktualisieren (für alle authentifizierten Benutzer)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!menu) {
      return res.status(404).json({ message: 'Menü nicht gefunden' });
    }
    return res.json(menu);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Menüs:', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des Menüs' });
  }
});

// Menü löschen (nur für Admins)
router.delete('/:id', authenticateToken, isAdmin, async (req: AuthRequest, res: express.Response) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menü nicht gefunden' });
    }
    return res.json({ message: 'Menü erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Menüs:', error);
    return res.status(500).json({ message: 'Fehler beim Löschen des Menüs' });
  }
});

export default router; 