import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Divider,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiCopy, FiX } from 'react-icons/fi';
import { Event, EventStatus } from '../../types/event';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const EventDetailPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const toast = useToast();

  const getStatusColor = (status: EventStatus) => {
    const colors = {
      angefragt: 'yellow',
      geplant: 'blue',
      bestätigt: 'green',
      abgeschlossen: 'purple',
      storniert: 'red',
    };
    return colors[status];
  };

  const handleStatusChange = (newStatus: EventStatus) => {
    if (!event) return;
    
    setEvent({ ...event, status: newStatus });
    toast({
      title: 'Status geändert',
      description: `Der Status wurde auf "${newStatus}" geändert.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (!event) {
    return <Box p={6}>Event nicht gefunden</Box>;
  }

  return (
    <Box p={6}>
      <Flex mb={6} align="center" justify="space-between">
        <Box>
          <Heading size="lg">{event.name}</Heading>
          <Text color="gray.600" mt={1}>
            {format(new Date(event.date), 'dd.MM.yyyy', { locale: de })} - {event.startTime} - {event.endTime}
          </Text>
        </Box>
        <HStack spacing={4}>
          <Badge colorScheme={getStatusColor(event.status)} fontSize="md" px={3} py={1}>
            {event.status}
          </Badge>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Weitere Optionen"
              icon={<FiMoreVertical />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<FiEdit2 />}>Bearbeiten</MenuItem>
              <MenuItem icon={<FiCopy />}>Duplizieren</MenuItem>
              <MenuItem icon={<FiX />} color="red.500">
                Stornieren
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Tabs>
        <TabList>
          <Tab>Übersicht</Tab>
          <Tab>Menü</Tab>
          <Tab>Personal</Tab>
          <Tab>Equipment</Tab>
          <Tab>Zeitplan</Tab>
          <Tab>Dokumente</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="md" mb={4}>Kundendaten</Heading>
                <Text>Kunde: {event.clientId}</Text>
                {/* TODO: Weitere Kundendaten */}
              </Box>

              <Box>
                <Heading size="md" mb={4}>Veranstaltungsdetails</Heading>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Text fontWeight="medium">Ort:</Text>
                    <Text>{event.location}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Adresse:</Text>
                    <Text>{event.address}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Gäste:</Text>
                    <Text>{event.guests}</Text>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>Beschreibung</Heading>
                <Text>{event.description}</Text>
              </Box>

              <Box>
                <Heading size="md" mb={4}>Statusverlauf</Heading>
                <VStack align="stretch" spacing={2}>
                  {/* TODO: Implementiere Statusverlauf */}
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={6}>
              <Heading size="md">Menüplanung</Heading>
              {/* TODO: Implementiere Menüplanung */}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={6}>
              <Heading size="md">Personalplanung</Heading>
              {/* TODO: Implementiere Personalplanung */}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={6}>
              <Heading size="md">Equipment</Heading>
              {/* TODO: Implementiere Equipment-Planung */}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={6}>
              <Heading size="md">Zeitplan</Heading>
              {/* TODO: Implementiere Zeitplan */}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={6}>
              <Heading size="md">Dokumente</Heading>
              {/* TODO: Implementiere Dokumentenverwaltung */}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EventDetailPage; 