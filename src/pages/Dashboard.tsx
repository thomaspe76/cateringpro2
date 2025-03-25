import React from 'react';
import { 
  Box, 
  Grid, 
  Heading, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  SimpleGrid, 
  Flex, 
  Text, 
  Button, 
  Icon, 
  HStack,
  useColorModeValue 
} from '@chakra-ui/react';
import { FiTrendingUp, FiCalendar, FiClock, FiUsers, FiPlus } from 'react-icons/fi';

// Dashboard-Komponenten (später in eigene Dateien auslagern)
import CalendarView from '../components/dashboard/CalendarView';
import TasksList from '../components/dashboard/TasksList';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import RevenueChart from '../components/dashboard/RevenueChart';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  colorScheme: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon, colorScheme }) => {
  const isPositive = change.startsWith('+');
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Stat
      px={5}
      py={4}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="sm"
    >
      <Flex justifyContent="space-between">
        <Box>
          <StatLabel color="gray.500" fontWeight="medium">{label}</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
          <StatHelpText
            color={isPositive ? `${colorScheme}.500` : 'red.500'}
            mb={0}
          >
            {change}
          </StatHelpText>
        </Box>
        <Flex
          alignItems="center"
          justifyContent="center"
          h="50px"
          w="50px"
          rounded="md"
          bg={`${colorScheme}.50`}
          color={`${colorScheme}.500`}
        >
          <Icon as={icon} boxSize="24px" />
        </Flex>
      </Flex>
    </Stat>
  );
};

const Dashboard: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Dashboard</Heading>
        <HStack>
          <Button leftIcon={<FiCalendar />} variant="outline">Diese Woche</Button>
          <Button leftIcon={<FiPlus />} colorScheme="blue">Neues Event</Button>
        </HStack>
      </Flex>

      {/* KPI-Karten */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={6}>
        <StatCard 
          label="Gesamtumsatz" 
          value="8.654 €" 
          change="+14%" 
          icon={FiTrendingUp} 
          colorScheme="green" 
        />
        <StatCard 
          label="Events diesen Monat" 
          value="24" 
          change="+3" 
          icon={FiCalendar} 
          colorScheme="blue" 
        />
        <StatCard 
          label="Ausstehende Angebote" 
          value="12" 
          change="-2" 
          icon={FiClock} 
          colorScheme="orange" 
        />
        <StatCard 
          label="Neue Kunden" 
          value="6" 
          change="+2" 
          icon={FiUsers} 
          colorScheme="purple" 
        />
      </SimpleGrid>

      {/* Hauptinhaltsbereich */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap={6}>
        <Box>
          <Box bg={bgColor} borderRadius="lg" boxShadow="sm" mb={6} p={4}>
            <Heading size="md" mb={4}>Umsatzentwicklung</Heading>
            <Box h="220px">
              <RevenueChart />
            </Box>
          </Box>
          
          <Box bg={bgColor} borderRadius="lg" boxShadow="sm" p={4}>
            <Heading size="md" mb={4}>Kalender</Heading>
            <CalendarView />
          </Box>
        </Box>
        
        <Box>
          <Box bg={bgColor} borderRadius="lg" boxShadow="sm" mb={6} p={4}>
            <Heading size="md" mb={4}>Ausstehende Aufgaben</Heading>
            <TasksList />
          </Box>
          
          <Box bg={bgColor} borderRadius="lg" boxShadow="sm" p={4}>
            <Heading size="md" mb={4}>Anstehende Events</Heading>
            <UpcomingEvents />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Dashboard; 