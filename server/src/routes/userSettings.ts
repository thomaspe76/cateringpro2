import express from 'express';
import { UserSettings } from '../models/UserSettings';
import { authenticateToken } from '../middleware/auth';
import { Request } from 'express';
import { IUser } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const router = express.Router();

// GET /api/user-settings - Benutzereinstellungen abrufen
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const settings = await UserSettings.findOne({ userId: req.user?._id });
    if (!settings) {
      return res.json({});
    }
    return res.json(settings.settings);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzereinstellungen:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Benutzereinstellungen' });
  }
});

// PUT /api/user-settings - Benutzereinstellungen aktualisieren
router.put('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user?._id },
      { $set: { settings: req.body } },
      { new: true, upsert: true }
    );
    return res.json(settings.settings);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Benutzereinstellungen:', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren der Benutzereinstellungen' });
  }
});

// POST /api/user-settings/reset - Einstellungen zurücksetzen
router.post('/reset', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Nicht authentifiziert' });
    }

    const settings = await UserSettings.findOne({ userId: req.user.id });
    
    if (!settings) {
      return res.status(404).json({ message: 'Einstellungen nicht gefunden' });
    }

    const version = settings.version;
    Object.assign(settings, new UserSettings({ userId: req.user.id, version }));
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Zurücksetzen der Einstellungen' });
  }
});

// DELETE /api/user-settings - Benutzereinstellungen zurücksetzen
router.delete('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    await UserSettings.findOneAndDelete({ userId: req.user?._id });
    return res.json({ message: 'Benutzereinstellungen erfolgreich zurückgesetzt' });
  } catch (error) {
    console.error('Fehler beim Zurücksetzen der Benutzereinstellungen:', error);
    return res.status(500).json({ message: 'Fehler beim Zurücksetzen der Benutzereinstellungen' });
  }
});

export default router; 