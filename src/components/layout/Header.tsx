import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Spacer, 
  IconButton, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Avatar, 
  HStack, 
  Text, 
  InputGroup, 
  Input, 
  InputLeftElement 
} from '@chakra-ui/react';
import { FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Dynamischen Titel basierend auf dem aktuellen Pfad generieren
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/events')) return 'Events';
    if (path.startsWith('/proposals')) return 'Angebote';
    if (path.startsWith('/clients')) return 'Kunden';
    if (path.startsWith('/inventory')) return 'Material';
    if (path.startsWith('/staff')) return 'Personal';
    if (path.startsWith('/kitchen')) return 'Küche';
    if (path.startsWith('/reports')) return 'Berichte';
    if (path.startsWith('/settings')) return 'Einstellungen';
    return 'CateringPro';
  };

  return (
    <Box as="header" bg="white" boxShadow="sm" px={6} py={4}>
      <Flex alignItems="center">
        <Heading size="lg" color="gray.800">{getTitle()}</Heading>
        <Spacer />
        
        <HStack spacing={4}>
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Suchen..." borderRadius="full" />
          </InputGroup>
          
          <IconButton
            aria-label="Benachrichtigungen"
            icon={<FiBell />}
            variant="ghost"
            fontSize="20px"
          />
          
          <Menu>
            <MenuButton>
              <HStack>
                <Avatar size="sm" name="Max Mustermann" />
                <Text display={{ base: 'none', md: 'block' }}>Max Mustermann</Text>
                <FiChevronDown />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>Profil</MenuItem>
              <MenuItem>Einstellungen</MenuItem>
              <MenuItem>Hilfe</MenuItem>
              <MenuItem>Abmelden</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header; 