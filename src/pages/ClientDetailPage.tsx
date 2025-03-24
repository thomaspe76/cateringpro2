import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  IconButton,
  useToast,
  Spinner,
  Flex,
  Heading,
  Divider,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { EditIcon, PhoneIcon, EmailIcon, ViewIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '../types';
import clientService from '../services/clientService';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ClientStats {
  totalEvents: number;
  totalRevenue: number;
  averageOrderValue: number;
  lastEventDate: string | null;
}

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ClientStats>({
    totalEvents: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    lastEventDate: null,
  });

  useEffect(() => {
    if (id) {
      loadClient();
      loadClientStats();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      const data = await clientService.getClient(id!);
      if (data) {
        setClient(data);
      } else {
        throw new Error('Kunde nicht gefunden');
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kunde konnte nicht geladen werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadClientStats = async () => {
    try {
      const data = await clientService.getClientStats(id!);
      setStats({
        ...data,
        lastEventDate: data.lastEventDate || null,
      });
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
    }
  };

  if (loading || !client) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">
          {client.type === 'private'
            ? `${client.firstName} ${client.lastName}`
            : client.companyName}
        </Heading>
        <IconButton
          aria-label="Bearbeiten"
          icon={<EditIcon />}
          colorScheme="blue"
          onClick={() => navigate(`/clients/${id}/edit`)}
        />
      </Flex>

      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
        <GridItem>
          <Stat>
            <StatLabel>Gesamt Events</StatLabel>
            <StatNumber>{stats.totalEvents}</StatNumber>
            <StatHelpText>
              Kunde seit {format(new Date(client.customerSince), 'dd.MM.yyyy', { locale: de })}
            </StatHelpText>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>Gesamtumsatz</StatLabel>
            <StatNumber>
              {stats.totalRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </StatNumber>
            <StatHelpText>
              Durchschnittlich {stats.averageOrderValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </StatHelpText>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>Letztes Event</StatLabel>
            <StatNumber>
              {stats.lastEventDate
                ? format(new Date(stats.lastEventDate), 'dd.MM.yyyy', { locale: de })
                : '-'}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={stats.totalEvents > 0 ? 'increase' : 'decrease'} />
            </StatHelpText>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>Status</StatLabel>
            <StatNumber>
              <Badge colorScheme={stats.totalEvents > 0 ? 'green' : 'gray'}>
                {stats.totalEvents > 0 ? 'Aktiv' : 'Neu'}
              </Badge>
            </StatNumber>
            <StatHelpText>
              {client.type === 'private' ? 'Privatkunde' : 'Geschäftskunde'}
            </StatHelpText>
          </Stat>
        </GridItem>
      </Grid>

      <Tabs>
        <TabList>
          <Tab>Kontakt</Tab>
          <Tab>Events</Tab>
          <Tab>Dokumente</Tab>
          <Tab>Notizen</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <HStack>
                <PhoneIcon />
                <Text>{client.phone}</Text>
              </HStack>
              <HStack>
                <EmailIcon />
                <Text>{client.email}</Text>
              </HStack>
              <HStack>
                <ViewIcon />
                <Text>
                  {client.street}, {client.postalCode} {client.city}
                </Text>
              </HStack>
              <Divider />
              <Text fontWeight="bold">Kontaktpräferenzen</Text>
              <Text>Bevorzugte Kontaktmethode: {client.preferredContactMethod}</Text>
              <Text>WhatsApp verfügbar: {client.whatsappAvailable ? 'Ja' : 'Nein'}</Text>
              <Text>Signal verfügbar: {client.signalAvailable ? 'Ja' : 'Nein'}</Text>
            </VStack>
          </TabPanel>

          <TabPanel>
            <Text>Hier werden die Events des Kunden angezeigt.</Text>
          </TabPanel>

          <TabPanel>
            <Text>Hier werden die Dokumente des Kunden angezeigt.</Text>
          </TabPanel>

          <TabPanel>
            <Text>Hier werden die Notizen zum Kunden angezeigt.</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ClientDetailPage; 