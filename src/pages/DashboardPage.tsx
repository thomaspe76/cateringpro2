import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiCalendar, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const quickActions = [
    {
      title: 'Event anlegen',
      icon: FiCalendar,
      onClick: () => navigate('/events/new'),
      colorScheme: 'brand',
    },
    {
      title: 'Kunde anlegen',
      icon: FiUsers,
      onClick: () => navigate('/clients/new'),
      colorScheme: 'blue',
    },
    {
      title: 'Angebot erstellen',
      icon: FiDollarSign,
      onClick: () => navigate('/proposals/new'),
      colorScheme: 'green',
    },
  ];

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Dashboard</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            onClick={() => navigate('/events/new')}
          >
            Event anlegen
          </Button>
        </HStack>

        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          <GridItem>
            <Stat>
              <StatLabel>Offene Events</StatLabel>
              <StatNumber>12</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                3 neue diese Woche
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Umsatz (MTD)</StatLabel>
              <StatNumber>€24,500</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% vs. Vormonat
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Kunden</StatLabel>
              <StatNumber>48</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5 neue diesen Monat
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Angebote</StatLabel>
              <StatNumber>8</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                2 weniger als letzte Woche
              </StatHelpText>
            </Stat>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Schnellzugriff</Heading>
                  {quickActions.map((action) => (
                    <Button
                      key={action.title}
                      leftIcon={<Icon as={action.icon} />}
                      colorScheme={action.colorScheme}
                      onClick={action.onClick}
                      justifyContent="flex-start"
                    >
                      {action.title}
                    </Button>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Kommende Events</Heading>
                  <Text>Keine anstehenden Events</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Umsatzentwicklung</Heading>
                  <Text>Keine Daten verfügbar</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default DashboardPage; 