import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { api } from '../utils/api';

interface DemoDataStats {
  customers: number;
  products: number;
  offers: number;
}

const DemoDataManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<DemoDataStats | null>(null);

  const handleCreateDemoData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.post('/demo/create');
      
      if (response.data.success) {
        setSuccess('Beispieldaten wurden erfolgreich erstellt');
        setStats(response.data.data);
      } else {
        setError(response.data.error || 'Fehler beim Erstellen der Beispieldaten');
      }
    } catch (err) {
      setError('Fehler beim Erstellen der Beispieldaten');
      console.error('Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDemoData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.delete('/demo/clear');
      
      if (response.data.success) {
        setSuccess('Beispieldaten wurden erfolgreich entfernt');
        setStats(null);
      } else {
        setError(response.data.error || 'Fehler beim Entfernen der Beispieldaten');
      }
    } catch (err) {
      setError('Fehler beim Entfernen der Beispieldaten');
      console.error('Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Beispieldaten verwalten
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Hier können Sie Beispieldaten für die Anwendung erstellen oder entfernen.
          Dies ist nützlich für Testzwecke und zur Demonstration der Anwendung.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {stats && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Erstellte Beispieldaten:
            </Typography>
            <Typography variant="body2">
              • {stats.customers} Kunden
            </Typography>
            <Typography variant="body2">
              • {stats.products} Produkte
            </Typography>
            <Typography variant="body2">
              • {stats.offers} Angebote
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateDemoData}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Beispieldaten erstellen'}
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearDemoData}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Beispieldaten entfernen'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DemoDataManager; 