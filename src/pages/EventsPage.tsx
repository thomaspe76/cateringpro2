import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  Button, 
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
  Input, 
  InputGroup, 
  InputLeftElement, 
  useColorModeValue,
  HStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Link
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiSearch, 
  FiMoreVertical, 
  FiEdit2, 
  FiEye, 
  FiTrash2, 
  FiCalendar,
  FiFilter,
  FiDownload
} from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

// Beispieldaten für Events
const events = [
  { 
    id: 'E-2025-001', 
    name: 'Jahreskonferenz', 
    client: 'Technologie AG', 
    date: '15.04.2025', 
    location: 'Konferenzzentrum', 
    guests: 120, 
    status: 'geplant' 
  },
  { 
    id: 'E-2025-002', 
    name: 'Produktlaunch', 
    client: 'Marketing GmbH', 
    date: '22.04.2025', 
    location: 'Messehalle', 
    guests: 70, 
    status: 'bestätigt' 
  },
  { 
    id: 'E-2025-003', 
    name: 'Firmenjubiläum', 
    client: 'Baumeister KG', 
    date: '30.04.2025',
    location: 'Festsaal Stadtgarten', 
    guests: 150, 
    status: 'bestätigt' 
  },
  { 
    id: 'E-2025-004', 
    name: 'Mitarbeiterfeier', 
    client: 'Müller & Söhne', 
    date: '05.05.2025', 
    location: 'Firmengelände', 
    guests: 45, 
    status: 'geplant' 
  },
  { 
    id: 'E-2025-005', 
    name: 'Hochzeit Schmidt', 
    client: 'Familie Schmidt', 
    date: '02.05.2025', 
    location: 'Landgut Wald', 
    guests: 85, 
    status: 'angefragt' 
  },
];

// Statusfarben für Events
const getStatusColor = (status: string) => {
  switch (status) {
    case 'angefragt': return 'yellow';
    case 'geplant': return 'blue';
    case 'bestätigt': return 'green';
    case 'abgeschlossen': return 'gray';
    case 'storniert': return 'red';
    default: return 'gray';
  }
};

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  // Filtern der Events basierend auf dem Suchbegriff
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Löschen eines Events (in einer realen Anwendung würde hier ein API-Aufruf stattfinden)
  const handleDeleteEvent = () => {
    console.log(`Event mit ID ${eventToDelete} wurde gelöscht`);
    onClose();
    setEventToDelete(null);
  };

  const showDeleteConfirmation = (id: string) => {
    setEventToDelete(id);
    onOpen();
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Events</Heading>
        <Button 
          as={RouterLink} 
          to="/events/new" 
          leftIcon={<FiPlus />} 
          colorScheme="blue"
        >
          Neues Event
        </Button>
      </Flex>

      <Box 
        bg={useColorModeValue('white', 'gray.700')} 
        borderRadius="lg" 
        boxShadow="sm" 
        mb={6}
        overflow="hidden"
      >
        <Flex p={4} wrap="wrap" justifyContent="space-between" alignItems="center">
          <HStack>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Events durchsuchen..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Menu>
              <MenuButton 
                as={Button} 
                leftIcon={<FiFilter />} 
                variant="outline"
                size="md"
              >
                Filter
              </MenuButton>
              <MenuList>
                <MenuItem>Alle Events</MenuItem>
                <MenuItem>Angefragt</MenuItem>
                <MenuItem>Geplant</MenuItem>
                <MenuItem>Bestätigt</MenuItem>
                <MenuItem>Abgeschlossen</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          
          <Button leftIcon={<FiDownload />} variant="ghost" mr={2}>Exportieren</Button>
        </Flex>
        
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
              <Tr>
                <Th>Event-ID</Th>
                <Th>Veranstaltung</Th>
                <Th>Kunde</Th>
                <Th>Datum</Th>
                <Th>Ort</Th>
                <Th isNumeric>Gäste</Th>
                <Th>Status</Th>
                <Th width="100px">Aktionen</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEvents.map((event) => (
                <Tr key={event.id}>
                  <Td fontWeight="medium">{event.id}</Td>
                  <Td>
                    <Link as={RouterLink} to={`/events/${event.id}`} color="blue.500">
                      {event.name}
                    </Link>
                  </Td>
                  <Td>{event.client}</Td>
                  <Td>
                    <HStack>
                      <FiCalendar size="14px" />
                      <Text>{event.date}</Text>
                    </HStack>
                  </Td>
                  <Td>{event.location}</Td>
                  <Td isNumeric>{event.guests}</Td>
                  <Td>
                    <Badge 
                      colorScheme={getStatusColor(event.status)}
                      borderRadius="full" 
                      px={2}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      <IconButton
                        as={RouterLink}
                        to={`/events/${event.id}`}
                        aria-label="Event ansehen"
                        icon={<FiEye />}
                        size="sm"
                        variant="ghost"
                      />
                      <IconButton
                        as={RouterLink}
                        to={`/events/${event.id}/edit`}
                        aria-label="Event bearbeiten"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
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
                          <MenuItem as={RouterLink} to={`/events/${event.id}`} icon={<FiEye />}>
                            Details ansehen
                          </MenuItem>
                          <MenuItem as={RouterLink} to={`/events/${event.id}/edit`} icon={<FiEdit2 />}>
                            Bearbeiten
                          </MenuItem>
                          <MenuItem 
                            icon={<FiTrash2 />} 
                            color="red.500"
                            onClick={() => showDeleteConfirmation(event.id)}
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

          {filteredEvents.length === 0 && (
            <Box p={8} textAlign="center">
              <Text color="gray.500">Keine Events gefunden</Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Löschen-Bestätigungsdialog */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event löschen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Sind Sie sicher, dass Sie dieses Event löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Abbrechen
            </Button>
            <Button colorScheme="red" onClick={handleDeleteEvent}>
              Löschen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventsPage; 