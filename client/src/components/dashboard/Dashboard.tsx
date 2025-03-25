import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  VStack,
  Button,
  IconButton,
  useToast,
  Divider,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUsers, FiShoppingCart, FiFileText, FiPackage, FiLogOut, FiSettings, FiMenu } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('customers')) return 0;
    if (path.includes('orders')) return 1;
    if (path.includes('offers')) return 2;
    if (path.includes('products')) return 3;
    return 0;
  };

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box w="250px" bg={bgColor} borderRight="1px" borderColor={borderColor} p={4}>
        <VStack spacing={6} align="stretch" h="100%">
          <Heading size="md" color="blue.500" mb={6}>CateringPro</Heading>
          
          <VStack spacing={2} align="stretch">
            <Button
              leftIcon={<FiUsers />}
              variant={getActiveTab() === 0 ? 'solid' : 'ghost'}
              colorScheme={getActiveTab() === 0 ? 'blue' : 'gray'}
              justifyContent="flex-start"
              onClick={() => navigate('/dashboard/customers')}
            >
              Kunden
            </Button>
            <Button
              leftIcon={<FiShoppingCart />}
              variant={getActiveTab() === 1 ? 'solid' : 'ghost'}
              colorScheme={getActiveTab() === 1 ? 'blue' : 'gray'}
              justifyContent="flex-start"
              onClick={() => navigate('/dashboard/orders')}
            >
              Aufträge
            </Button>
            <Button
              leftIcon={<FiFileText />}
              variant={getActiveTab() === 2 ? 'solid' : 'ghost'}
              colorScheme={getActiveTab() === 2 ? 'blue' : 'gray'}
              justifyContent="flex-start"
              onClick={() => navigate('/dashboard/offers')}
            >
              Angebote
            </Button>
            <Button
              leftIcon={<FiPackage />}
              variant={getActiveTab() === 3 ? 'solid' : 'ghost'}
              colorScheme={getActiveTab() === 3 ? 'blue' : 'gray'}
              justifyContent="flex-start"
              onClick={() => navigate('/dashboard/products')}
            >
              Produkte
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} display="flex" flexDirection="column">
        {/* Header */}
        <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} px={6} py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <IconButton
                aria-label="Menu"
                icon={<FiMenu />}
                variant="ghost"
                colorScheme="gray"
                size="lg"
              />
              <Heading size="md" color="gray.700">Dashboard</Heading>
            </HStack>
            
            <HStack spacing={4}>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rightIcon={<FiSettings />}
                  colorScheme="gray"
                >
                  Einstellungen
                </MenuButton>
                <MenuList>
                  <MenuItem>Profil bearbeiten</MenuItem>
                  <MenuItem>Benachrichtigungen</MenuItem>
                  <MenuItem>Systemeinstellungen</MenuItem>
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  leftIcon={<Avatar size="sm" name="User" />}
                  colorScheme="gray"
                >
                  <Text>Max Mustermann</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiSettings />}>Profil</MenuItem>
                  <MenuItem icon={<FiLogOut />} onClick={handleLogout}>Abmelden</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>

        {/* Content Area */}
        <Box flex={1} overflowY="auto" bg="gray.50" p={0}>
          <Box p={6}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}; 