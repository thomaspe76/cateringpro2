import React from 'react';
import { 
  Box, 
  VStack, 
  Image, 
  Flex, 
  Icon, 
  Text, 
  Divider 
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiFileText, 
  FiUsers, 
  FiPackage, 
  FiUserCheck, 
  FiClipboard, 
  FiPieChart, 
  FiSettings 
} from 'react-icons/fi';

// Navigationspunkte
interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Events', icon: FiCalendar, path: '/events' },
  { name: 'Angebote', icon: FiFileText, path: '/proposals' },
  { name: 'Kunden', icon: FiUsers, path: '/clients' },
  { name: 'Material', icon: FiPackage, path: '/inventory' },
  { name: 'Personal', icon: FiUserCheck, path: '/staff' },
  { name: 'Küche', icon: FiClipboard, path: '/kitchen' },
  { name: 'Berichte', icon: FiPieChart, path: '/reports' },
  { name: 'Einstellungen', icon: FiSettings, path: '/settings' },
];

const Sidebar: React.FC = () => {
  return (
    <Box
      as="aside"
      bg="white"
      w="250px"
      h="100vh"
      boxShadow="sm"
      position="sticky"
      top={0}
    >
      <Flex direction="column" h="full">
        <Box py={5} px={4}>
          <Image src="/logo.png" h="40px" alt="CateringPro Logo" fallbackSrc="https://via.placeholder.com/160x40" />
        </Box>
        <Divider />
        <VStack spacing={1} align="stretch" py={4} flex="1">
          {navItems.map((item) => (
            <NavItem 
              key={item.name} 
              icon={item.icon} 
              name={item.name} 
              path={item.path} 
            />
          ))}
        </VStack>
        <Box p={4} fontSize="sm" color="gray.500">
          <Text>CateringPro v1.0</Text>
        </Box>
      </Flex>
    </Box>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  name: string;
  path: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, name, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path || 
                  (path !== '/' && location.pathname.startsWith(path));
  
  return (
    <Box
      as={NavLink}
      to={path}
      px={4}
      py={3}
      borderRadius="md"
      bg={isActive ? "brand.50" : "transparent"}
      color={isActive ? "brand.600" : "gray.700"}
      fontWeight={isActive ? "semibold" : "normal"}
      _hover={{ bg: isActive ? "brand.50" : "gray.100" }}
      display="flex"
      alignItems="center"
    >
      <Icon as={icon} mr={3} fontSize="lg" />
      <Text>{name}</Text>
    </Box>
  );
};

export default Sidebar; 