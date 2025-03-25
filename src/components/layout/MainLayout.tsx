import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Flex>
      <Sidebar />
      <Box flex="1" ml="64">
        <Header />
        <Box as="main" p={4} mt="16">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default MainLayout; 