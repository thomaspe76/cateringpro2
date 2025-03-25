import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import PlaceholderPage from './components/PlaceholderPage';

// Layout-Komponenten
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Seiten-Komponenten
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import EventFormPage from './pages/EventFormPage';
import ProposalsPage from './pages/ProposalsPage';
import ProposalFormPage from './pages/ProposalFormPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import InventoryPage from './pages/InventoryPage';
import StaffPage from './pages/StaffPage';
import KitchenPage from './pages/KitchenPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box display="flex" h="100vh">
          <Sidebar />
          <Box flex="1" overflow="auto">
            <Header />
            <Box as="main" p={4}>
              <Routes>
                {/* Dashboard */}
                <Route path="/" element={<Dashboard />} />
                
                {/* Events */}
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/new" element={<EventFormPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/events/:id/edit" element={<EventFormPage />} />
                
                {/* Proposals */}
                <Route path="/proposals" element={<ProposalsPage />} />
                <Route path="/proposals/new" element={<ProposalFormPage />} />
                <Route path="/proposals/:id" element={<ProposalFormPage />} />
                
                {/* Clients */}
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/:id" element={<ClientDetailPage />} />
                
                {/* Other pages */}
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/kitchen" element={<KitchenPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App; 