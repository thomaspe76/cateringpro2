import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  settings: {
    theme?: string;
    language?: string;
    notifications?: boolean;
    [key: string]: any;
  };
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSettingsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    type: Schema.Types.Mixed,
    default: {}
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index für schnelle Suche
userSettingsSchema.index({ userId: 1 });

// Middleware für Versionsverwaltung
userSettingsSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.version += 1;
  }
  next();
});

// Methode zum Migrieren der Einstellungen auf eine neue Version
userSettingsSchema.methods.migrateToVersion = async function(targetVersion: number) {
  const currentVersion = this.version;
  
  if (currentVersion >= targetVersion) {
    return;
  }

  // Hier können wir spezifische Migrationsschritte für jede Version definieren
  for (let version = currentVersion + 1; version <= targetVersion; version++) {
    switch (version) {
      case 2:
        // Beispiel für eine zukünftige Migration
        // this.someNewField = this.someOldField;
        break;
      case 3:
        // Weitere zukünftige Migrationen
        break;
      // Weitere Versionen hier hinzufügen
    }
  }

  this.version = targetVersion;
  await this.save();
};

export const UserSettings = mongoose.model<IUserSettings>('UserSettings', userSettingsSchema); 