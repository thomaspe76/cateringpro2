import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DemoDataManager from '../components/DemoDataManager';

const AdminPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Administration
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph>
          Hier finden Sie administrative Funktionen für die Anwendung.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <DemoDataManager />
        </Box>
      </Box>
    </Container>
  );
};

export default AdminPage; 