import React from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout-Komponenten
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Seiten-Komponenten
import Dashboard from './pages/Dashboard';
import ProposalsPage from './pages/ProposalsPage';
import ProposalForm from './pages/ProposalForm';
import ProposalDetail from './pages/ProposalDetail';

function App() {
  return (
    <Router>
      <Box display="flex" minH="100vh">
        <Sidebar />
        <Box flex="1" ml={{ base: "70px", lg: "250px" }} transition="margin-left 0.2s ease-in-out">
          <Header />
          <Box as="main" p={4}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/proposals/new" element={<ProposalForm />} />
              <Route path="/proposals/:id" element={<ProposalDetail />} />
              <Route path="/proposals/:id/edit" element={<ProposalForm />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App; 