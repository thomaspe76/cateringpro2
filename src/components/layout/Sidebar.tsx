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
  Badge,
  Button,
  useColorModeValue,
  Tooltip,
  Image,
  Divider,
  VStack,
  Icon
} from '@chakra-ui/react';
import { 
  FiBell, 
  FiSearch, 
  FiChevronDown, 
  FiUser, 
  FiSettings, 
  FiHelpCircle, 
  FiLogOut,
  FiHome,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiPackage,
  FiUserCheck,
  FiClipboard,
  FiPieChart
} from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: number; // Optional: Für Benachrichtigungsanzeige
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Events', icon: FiCalendar, path: '/events', badge: 3 },
  { name: 'Angebote', icon: FiFileText, path: '/proposals', badge: 2 },
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
      minH="100vh"
      borderRight="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex="sticky"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--chakra-colors-gray-300)',
          borderRadius: '24px',
        },
      }}
    >
      <Flex direction="column" h="full">
        <Box py={5} px={4}>
          <Image 
            src="/logo.png" 
            h="40px" 
            alt="CateringPro Logo" 
            fallbackSrc="https://via.placeholder.com/160x40" 
          />
        </Box>
        <Divider />
        <VStack spacing={1} align="stretch" py={4} flex="1">
          {navItems.map((item) => (
            <NavItem 
              key={item.name} 
              {...item}
            />
          ))}
        </VStack>
        <Divider />
        <Box p={4} fontSize="sm" color="gray.500">
          <Text>CateringPro v1.0</Text>
        </Box>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends NavItem {}

const NavItem: React.FC<NavItemProps> = ({ icon, name, path, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === path || 
                  (path !== '/' && location.pathname.startsWith(path));
  
  return (
    <Tooltip label={name} placement="right" hasArrow openDelay={500}>
      <Box
        as={NavLink}
        to={path}
        px={4}
        py={3}
        mx={2}
        borderRadius="md"
        bg={isActive ? "brand.50" : "transparent"}
        color={isActive ? "brand.600" : "gray.700"}
        fontWeight={isActive ? "semibold" : "medium"}
        _hover={{ 
          bg: isActive ? "brand.50" : "gray.100",
          color: isActive ? "brand.600" : "gray.800"
        }}
        transition="all 0.2s"
      >
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <Icon as={icon} fontSize="lg" />
            <Text>{name}</Text>
          </HStack>
          {badge && (
            <Badge
              colorScheme="brand"
              borderRadius="full"
              px={2}
            >
              {badge}
            </Badge>
          )}
        </Flex>
      </Box>
    </Tooltip>
  );
};

export default Sidebar; 