import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  useToast,
  Text,
  Spacer,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiEye, FiDownload } from 'react-icons/fi';
import { Event, EventStatus } from '../../types/event';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Event; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleDelete = async (event: Event) => {
    try {
      // TODO: Implementiere API-Aufruf zum Löschen
      setEvents(events.filter(e => e.id !== event.id));
      toast({
        title: 'Event gelöscht',
        description: 'Das Event wurde erfolgreich gelöscht.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Das Event konnte nicht gelöscht werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleExport = () => {
    // TODO: Implementiere Export-Funktion
    toast({
      title: 'Export gestartet',
      description: 'Die Event-Liste wird exportiert...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

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

  const handleSort = (key: keyof Event) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Box p={6}>
      <Flex mb={6} align="center">
        <Heading size="lg">Events</Heading>
        <Spacer />
        <Button
          leftIcon={<FiDownload />}
          colorScheme="brand"
          variant="outline"
          onClick={handleExport}
        >
          Exportieren
        </Button>
        <Button
          ml={4}
          colorScheme="brand"
          onClick={() => navigate('/events/new')}
        >
          Neues Event
        </Button>
      </Flex>

      <Flex mb={6} gap={4}>
        <Input
          placeholder="Suche nach Name oder Kunde..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxW="300px"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'all')}
          maxW="200px"
        >
          <option value="all">Alle Status</option>
          <option value="angefragt">Angefragt</option>
          <option value="geplant">Geplant</option>
          <option value="bestätigt">Bestätigt</option>
          <option value="abgeschlossen">Abgeschlossen</option>
          <option value="storniert">Storniert</option>
        </Select>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort('name')}>Name</Th>
              <Th cursor="pointer" onClick={() => handleSort('date')}>Datum</Th>
              <Th cursor="pointer" onClick={() => handleSort('location')}>Ort</Th>
              <Th cursor="pointer" onClick={() => handleSort('guests')}>Gäste</Th>
              <Th cursor="pointer" onClick={() => handleSort('status')}>Status</Th>
              <Th>Aktionen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEvents.map((event) => (
              <Tr key={event.id}>
                <Td>{event.name}</Td>
                <Td>{format(new Date(event.date), 'dd.MM.yyyy', { locale: de })}</Td>
                <Td>{event.location}</Td>
                <Td>{event.guests}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Details anzeigen"
                      icon={<FiEye />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {/* TODO: Implementiere Detailansicht */}}
                    />
                    <IconButton
                      aria-label="Event bearbeiten"
                      icon={<FiEdit2 />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {/* TODO: Implementiere Bearbeitung */}}
                    />
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Weitere Optionen"
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={() => {
                            setSelectedEvent(event);
                            onOpen();
                          }}
                        >
                          Löschen
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Event löschen</AlertDialogHeader>
            <AlertDialogBody>
              Sind Sie sicher, dass Sie das Event "{selectedEvent?.name}" löschen möchten?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} variant="ghost" onClick={onClose}>
                Abbrechen
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (selectedEvent) {
                    handleDelete(selectedEvent);
                    onClose();
                  }
                }}
                ml={3}
              >
                Löschen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default EventsPage; 