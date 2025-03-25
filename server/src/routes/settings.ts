import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { UserSettings } from '../models/UserSettings';
import { IUser } from '../models/User';

interface AuthRequest extends express.Request {
  user?: IUser;
}

const router = express.Router();

// Benutzereinstellungen abrufen
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
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

// Benutzereinstellungen aktualisieren
router.put('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
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

// Benutzereinstellungen zurücksetzen
router.delete('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    await UserSettings.findOneAndDelete({ userId: req.user?._id });
    return res.json({ message: 'Benutzereinstellungen erfolgreich zurückgesetzt' });
  } catch (error) {
    console.error('Fehler beim Zurücksetzen der Benutzereinstellungen:', error);
    return res.status(500).json({ message: 'Fehler beim Zurücksetzen der Benutzereinstellungen' });
  }
});

export default router; 