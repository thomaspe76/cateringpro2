#!/bin/bash

while true; do
    # Prüfe auf Änderungen
    if [[ -n $(git status -s) ]]; then
        # Aktuelle Zeit für den Commit-Message
        TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
        
        # Füge alle Änderungen hinzu und erstelle einen Commit
        git add .
        git commit -m "auto-backup: $TIMESTAMP"
        
        # Push zum Remote-Repository
        git push origin main
        
        echo "Backup erstellt um $TIMESTAMP"
    else
        echo "Keine Änderungen gefunden um $(date +"%Y-%m-%d %H:%M:%S")"
    fi
    
    # Warte 30 Minuten
    sleep 1800
done 