import React from 'react';
import { 
  Box, 
  Heading, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  SimpleGrid, 
  Flex, 
  Icon,
  useColorModeValue 
} from '@chakra-ui/react';
import { FiTrendingUp, FiCalendar, FiClock, FiUsers } from 'react-icons/fi';

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
  return (
    <Box>
      <Heading size="lg" mb={6}>Dashboard</Heading>

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
    </Box>
  );
};

export default Dashboard; 