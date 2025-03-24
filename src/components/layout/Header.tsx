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
  MenuDivider,
  Avatar, 
  HStack, 
  Text, 
  InputGroup, 
  Input, 
  InputLeftElement,
  Badge
} from '@chakra-ui/react';
import { 
  FiBell, 
  FiSearch, 
  FiChevronDown,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut
} from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case path.match(/^\/events/)?.input:
        return 'Events';
      case path.match(/^\/proposals/)?.input:
        return 'Angebote';
      case path.match(/^\/clients/)?.input:
        return 'Kunden';
      case path.match(/^\/inventory/)?.input:
        return 'Material';
      case path.match(/^\/staff/)?.input:
        return 'Personal';
      case path.match(/^\/kitchen/)?.input:
        return 'Küche';
      case path.match(/^\/reports/)?.input:
        return 'Berichte';
      case path.match(/^\/settings/)?.input:
        return 'Einstellungen';
      default:
        return 'CateringPro';
    }
  };

  return (
    <Box 
      as="header" 
      bg="white" 
      borderBottom="1px"
      borderColor="gray.200"
      px={6} 
      py={4}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex alignItems="center">
        <Heading size="lg" color="gray.800">{getTitle()}</Heading>
        <Spacer />
        
        <HStack spacing={4}>
          <InputGroup maxW="300px" display={{ base: 'none', md: 'block' }}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="var(--chakra-colors-gray-400)" />
            </InputLeftElement>
            <Input 
              placeholder="Suchen..." 
              borderRadius="full"
              bg="gray.50"
              _hover={{ bg: "gray.100" }}
              _focus={{
                bg: "white",
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
              }}
            />
          </InputGroup>
          
          <Menu>
            <MenuButton
              as={IconButton}
              variant="ghost"
              aria-label="Benachrichtigungen"
              position="relative"
              icon={<FiBell />}
            >
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                bg="brand.500"
                color="white"
                borderRadius="full"
                w="5"
                h="5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
              >
                3
              </Badge>
            </MenuButton>
            <MenuList>
              <MenuItem>Neue Eventanfrage</MenuItem>
              <MenuItem>Angebot bestätigt</MenuItem>
              <MenuItem>Personalzuweisung ausstehend</MenuItem>
            </MenuList>
          </Menu>
          
          <Menu>
            <MenuButton
              as={HStack}
              spacing={3}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
            >
              <Avatar 
                size="sm" 
                name="Max Mustermann"
                bg="brand.500"
              />
              <Box display={{ base: 'none', md: 'block' }}>
                <Text fontWeight="medium" fontSize="sm">
                  Max Mustermann
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Administrator
                </Text>
              </Box>
              <Box>
                <FiChevronDown />
              </Box>
            </MenuButton>
            <MenuList>
              <Box px={4} py={2}>
                <Text fontWeight="medium">Max Mustermann</Text>
                <Text fontSize="sm" color="gray.500">
                  max@cateringpro.de
                </Text>
              </Box>
              <MenuDivider />
              <MenuItem icon={<FiUser />}>Profil</MenuItem>
              <MenuItem icon={<FiSettings />}>Einstellungen</MenuItem>
              <MenuItem icon={<FiHelpCircle />}>Hilfe</MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} color="red.500">
                Abmelden
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header; 