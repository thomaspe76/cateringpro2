#!/bin/bash

# Verzeichnis zum Server-Ordner wechseln
cd "$(dirname "$0")/.."

# Prüfen ob es Änderungen gibt
if git diff --quiet; then
    echo "Keine Änderungen seit dem letzten Backup"
    exit 0
fi

# Zeitstempel für den Commit erstellen
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Änderungen stagen und committen
git add .
git commit -m "Automatisches Backup: $TIMESTAMP"

# Änderungen pushen
git push

echo "Backup erfolgreich erstellt und gepusht: $TIMESTAMP" 