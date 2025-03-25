import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cateringpro';

// MongoDB Verbindung
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Verbindung erfolgreich hergestellt');
    
    // Server starten
    app.listen(port, () => {
      console.log(`Server läuft auf Port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB Verbindungsfehler:', error);
    process.exit(1);
  }); 