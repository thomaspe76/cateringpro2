# CateringPro Server

Dies ist der Backend-Server für die CateringPro-Anwendung. Er bietet eine RESTful API für die Verwaltung von Catering-Veranstaltungen, Kunden, Menüs und Bestellungen.

## Voraussetzungen

- Node.js (v14 oder höher)
- MongoDB (v4.4 oder höher)
- npm oder yarn

## Installation

1. Klonen Sie das Repository:
```bash
git clone https://github.com/ihr-username/cateringpro.git
cd cateringpro/server
```

2. Installieren Sie die Abhängigkeiten:
```bash
npm install
```

3. Erstellen Sie eine `.env`-Datei im Server-Verzeichnis mit folgenden Umgebungsvariablen:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/cateringpro
JWT_SECRET=ihr_geheimer_schlüssel
```

## Entwicklung

Starten Sie den Server im Entwicklungsmodus:
```bash
npm run dev
```

Der Server wird dann mit nodemon gestartet, der bei Änderungen automatisch neu startet.

## Produktion

1. Bauen Sie das Projekt:
```bash
npm run build
```

2. Starten Sie den Server:
```bash
npm start
```

## API-Endpunkte

### Authentifizierung
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/user` - Benutzerinformationen abrufen

### Kunden
- `GET /api/clients` - Alle Kunden abrufen
- `POST /api/clients` - Neuen Kunden erstellen
- `GET /api/clients/:id` - Kunde nach ID abrufen
- `PUT /api/clients/:id` - Kunde aktualisieren
- `DELETE /api/clients/:id` - Kunde löschen

### Veranstaltungen
- `GET /api/events` - Alle Veranstaltungen abrufen
- `POST /api/events` - Neue Veranstaltung erstellen
- `GET /api/events/:id` - Veranstaltung nach ID abrufen
- `PUT /api/events/:id` - Veranstaltung aktualisieren
- `DELETE /api/events/:id` - Veranstaltung löschen

### Menüs
- `GET /api/menus` - Alle Menüs abrufen
- `POST /api/menus` - Neues Menü erstellen
- `GET /api/menus/:id` - Menü nach ID abrufen
- `PUT /api/menus/:id` - Menü aktualisieren
- `DELETE /api/menus/:id` - Menü löschen

### Bestellungen
- `GET /api/orders` - Alle Bestellungen abrufen
- `POST /api/orders` - Neue Bestellung erstellen
- `GET /api/orders/:id` - Bestellung nach ID abrufen
- `PUT /api/orders/:id` - Bestellung aktualisieren
- `DELETE /api/orders/:id` - Bestellung löschen

## Tests

Führen Sie die Tests aus:
```bash
npm test
```

## Lizenz

MIT 