import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Image, 
  Flex, 
  Icon, 
  Text, 
  Divider,
  IconButton,
  Tooltip,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiFileText, 
  FiUsers, 
  FiPackage, 
  FiUserCheck, 
  FiClipboard, 
  FiPieChart, 
  FiSettings,
  FiChevronRight,
  FiChevronLeft,
  FiMenu
} from 'react-icons/fi';

// Navigation Items
const navItems = [
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

interface NavItemProps {
  icon: React.ElementType;
  name: string;
  path: string;
  isExpanded: boolean;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  name, 
  path, 
  isExpanded,
  isActive
}) => {
  return (
    <Tooltip 
      label={name} 
      placement="right" 
      isDisabled={isExpanded}
      hasArrow
    >
      <Box
        as={Link}
        to={path}
        px={4}
        py={3}
        borderRadius="md"
        bg={isActive ? "blue.50" : "transparent"}
        color={isActive ? "blue.600" : "gray.700"}
        fontWeight={isActive ? "semibold" : "normal"}
        _hover={{ bg: isActive ? "blue.50" : "gray.100" }}
        display="flex"
        alignItems="center"
        justifyContent={isExpanded ? "flex-start" : "center"}
      >
        <Icon as={icon} fontSize="lg" />
        {isExpanded && (
          <Text 
            ml={3} 
            opacity={isExpanded ? 1 : 0}
            transition="opacity 0.2s ease-in-out"
            whiteSpace="nowrap"
          >
            {name}
          </Text>
        )}
      </Box>
    </Tooltip>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const defaultExpanded = useBreakpointValue({ base: false, lg: true });
  
  // State für ein- und ausgeklappte Sidebar
  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = localStorage.getItem('sidebarExpanded');
    return savedState ? JSON.parse(savedState) : defaultExpanded;
  });
  
  // Farben für Light/Dark Mode
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Breite der Sidebar je nach Zustand
  const sidebarWidth = isExpanded ? "250px" : "70px";
  
  // Toggle-Funktion für die Sidebar
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('sidebarExpanded', JSON.stringify(newState));
  };

  // Keyboard-Shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  // Responsive Design
  useEffect(() => {
    if (localStorage.getItem('sidebarExpanded') === null) {
      setIsExpanded(defaultExpanded || false);
    }
  }, [defaultExpanded]);
  
  return (
    <Box
      as="aside"
      bg={bgColor}
      w={sidebarWidth}
      h="100vh"
      boxShadow="sm"
      borderRight="1px"
      borderColor={borderColor}
      position="fixed"
      top={0}
      transition="width 0.2s ease-in-out"
      overflow="hidden"
      zIndex="1"
    >
      <Flex direction="column" h="full">
        {/* Header mit Logo und Toggle-Button */}
        <Flex 
          py={4} 
          px={4} 
          align="center" 
          justify={isExpanded ? "space-between" : "center"}
        >
          {isExpanded ? (
            <Text fontSize="xl" fontWeight="bold">CateringPro</Text>
          ) : (
            <Text fontSize="xl" fontWeight="bold">CP</Text>
          )}
          
          <IconButton
            aria-label={isExpanded ? "Sidebar einklappen" : "Sidebar ausklappen"}
            icon={isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
            size="sm"
            onClick={toggleSidebar}
            variant="ghost"
            display={isExpanded ? "flex" : "none"}
          />
        </Flex>
        
        <Divider />
        
        {/* Navigationspunkte */}
        <VStack spacing={1} align="stretch" py={4} flex="1">
          {navItems.map((item) => (
            <NavItem 
              key={item.name} 
              icon={item.icon} 
              name={item.name} 
              path={item.path} 
              isExpanded={isExpanded}
              isActive={location.pathname === item.path || 
                        (item.path !== '/' && location.pathname.startsWith(item.path))}
            />
          ))}
        </VStack>
        
        {/* Footer mit Version und Toggle-Button (wenn eingeklappt) */}
        <Flex 
          p={4} 
          fontSize="sm" 
          color="gray.500" 
          justify={isExpanded ? "space-between" : "center"}
          align="center"
        >
          {isExpanded && <Text>CateringPro v1.0</Text>}
          
          {!isExpanded && (
            <IconButton
              aria-label="Sidebar ausklappen"
              icon={<FiMenu />}
              size="sm"
              onClick={toggleSidebar}
              variant="ghost"
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Sidebar; 