import React, { useState, useRef, useEffect } from 'react';
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
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue,
  TableContainer,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiEye, FiDownload, FiSearch, FiPlus } from 'react-icons/fi';
import { Event, EventStatus } from '../../types/event';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { mockEvents } from '../../mock/data';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Event; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const bgColor = useColorModeValue('white', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Filter und Sortierung
  useEffect(() => {
    let filtered = [...events];

    // Status-Filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Suchfilter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(query) ||
        event.clientId.toLowerCase().includes(query)
      );
    }

    // Sortierung
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredEvents(filtered);
  }, [events, statusFilter, searchQuery, sortConfig]);

  // Paginierung
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof Event) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    onOpen();
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      toast({
        title: 'Event gelöscht',
        description: 'Das Event wurde erfolgreich gelöscht.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
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

  const exportToCSV = () => {
    const headers = ['Name', 'Datum', 'Zeit', 'Ort', 'Gäste', 'Status', 'Typ'];
    const csvContent = [
      headers.join(','),
      ...filteredEvents.map(event => [
        event.name,
        event.date,
        `${event.startTime}-${event.endTime}`,
        event.location,
        event.guests,
        event.status,
        event.type
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `events_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <Box p={6}>
      <Flex mb={6} align="center" justify="space-between" flexWrap="wrap" gap={4}>
        <Heading size="lg">Events</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={() => navigate('/events/new')}
        >
          Neues Event
        </Button>
      </Flex>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6}>
        <InputGroup maxW={{ base: 'full', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Event suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Select
          maxW={{ base: 'full', md: '200px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'all')}
        >
          <option value="all">Alle Status</option>
          <option value="angefragt">Angefragt</option>
          <option value="geplant">Geplant</option>
          <option value="bestätigt">Bestätigt</option>
          <option value="abgeschlossen">Abgeschlossen</option>
          <option value="storniert">Storniert</option>
        </Select>

        <Button
          leftIcon={<FiDownload />}
          onClick={exportToCSV}
          variant="outline"
        >
          Exportieren
        </Button>
      </Stack>

      <TableContainer bg={bgColor} borderRadius="lg" boxShadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort('name')}>
                Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('date')}>
                Datum {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th>Zeit</Th>
              <Th>Ort</Th>
              <Th cursor="pointer" onClick={() => handleSort('guests')}>
                Gäste {sortConfig?.key === 'guests' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th>Status</Th>
              <Th>Typ</Th>
              <Th>Aktionen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedEvents.map((event) => (
              <Tr key={event.id}>
                <Td>{event.name}</Td>
                <Td>{format(new Date(event.date), 'dd.MM.yyyy', { locale: de })}</Td>
                <Td>{event.startTime} - {event.endTime}</Td>
                <Td>{event.location}</Td>
                <Td>{event.guests}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </Td>
                <Td>{event.type}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Weitere Optionen"
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEye />} onClick={() => navigate(`/events/${event.id}`)}>
                        Ansehen
                      </MenuItem>
                      <MenuItem icon={<FiEdit2 />} onClick={() => navigate(`/events/${event.id}/edit`)}>
                        Bearbeiten
                      </MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleDelete(event)}>
                        Löschen
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justify="center" mt={6} gap={2}>
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
        >
          Zurück
        </Button>
        <Text alignSelf="center">
          Seite {currentPage} von {totalPages}
        </Text>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          isDisabled={currentPage === totalPages}
        >
          Weiter
        </Button>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Event löschen</AlertDialogHeader>
            <AlertDialogBody>
              Sind Sie sicher, dass Sie das Event "{selectedEvent?.name}" löschen möchten?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Abbrechen
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
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