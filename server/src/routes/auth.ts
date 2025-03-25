import express from 'express';
import { User } from '../models/User';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { IUser } from '../models/User';
import bcrypt from 'bcrypt';

interface AuthRequest extends express.Request {
  user?: IUser;
}

const router = express.Router();

// Validierungsregeln für die Registrierung
const registerValidation = [
  body('email').isEmail().withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  body('password').isLength({ min: 6 }).withMessage('Das Passwort muss mindestens 6 Zeichen lang sein'),
  body('firstName').notEmpty().withMessage('Vorname ist erforderlich'),
  body('lastName').notEmpty().withMessage('Nachname ist erforderlich')
];

// Test-Benutzer erstellen
router.post('/create-test-user', async (_req: express.Request, res: express.Response) => {
  try {
    // Prüfe, ob bereits ein Test-Benutzer existiert
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      return res.status(400).json({ message: 'Test-Benutzer existiert bereits' });
    }

    // Erstelle einen neuen Test-Benutzer
    const testUser = new User({
      email: 'test@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin'
    });

    await testUser.save();
    return res.status(201).json({ message: 'Test-Benutzer erfolgreich erstellt' });
  } catch (error) {
    console.error('Fehler beim Erstellen des Test-Benutzers:', error);
    return res.status(500).json({ message: 'Fehler beim Erstellen des Test-Benutzers' });
  }
});

// Registrierung
router.post('/register', registerValidation, async (req: express.Request, res: express.Response) => {
  try {
    // Validiere die Eingabedaten
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    // Prüfe, ob der Benutzer bereits existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Benutzer existiert bereits' });
    }

    // Erstelle einen neuen Benutzer
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await user.save();

    // Generiere Token
    const token = user.generateAuthToken();

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    return res.status(500).json({ message: 'Fehler bei der Registrierung' });
  }
});

// Login
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    // Finde den Benutzer
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Überprüfe das Passwort
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Generiere Token
    const token = user.generateAuthToken();

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    console.error('Login-Fehler:', error);
    return res.status(500).json({ message: 'Fehler beim Login' });
  }
});

// Benutzerinformationen abrufen
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Nicht authentifiziert' });
    }

    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server-Fehler' });
  }
});

// Benutzer abmelden
router.post('/logout', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    // Hier könnte man den Token auf eine Blacklist setzen
    return res.json({ message: 'Benutzer erfolgreich abgemeldet' });
  } catch (error) {
    console.error('Fehler beim Logout:', error);
    return res.status(500).json({ message: 'Fehler beim Logout' });
  }
});

export default router; 