import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Select, 
  Button,
  SimpleGrid,
  VStack,
  HStack,
  IconButton,
  useToast,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup as ChakraInputGroup,
  Input as ChakraInput
} from '@chakra-ui/react';
import { FiSave, FiX, FiArrowLeft, FiSearch } from 'react-icons/fi';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Event, Client, EventFormData } from '../types';
import { mockClients, mockEvents } from '../mock/data';

const EventFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditMode = !!id;
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  
  // Formular-Hook initialisieren
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<EventFormData>();

  // Beispieldaten für die Bearbeitung
  useEffect(() => {
    if (isEditMode) {
      const event = mockEvents.find(e => e.id === id);
      if (event) {
        const client = mockClients.find(c => c.id === event.clientId);
        reset({
          name: event.name,
          client: client?.name || '',
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          address: event.address || '',
          guests: event.guests,
          description: event.description || '',
          status: event.status,
          type: event.type
        });
      }
    }
  }, [isEditMode, reset, id]);

  // Formular absenden
  const onSubmit = (data: EventFormData) => {
    // In einer realen Anwendung würden wir hier die Daten an eine API senden
    console.log('Formulardaten:', data);
    
    // Erfolgsmeldung anzeigen
    toast({
      title: isEditMode ? 'Event aktualisiert' : 'Event erstellt',
      description: `${data.name} wurde erfolgreich ${isEditMode ? 'aktualisiert' : 'erstellt'}.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Zurück zur Event-Liste navigieren
    navigate('/events');
  };

  const bgColor = useColorModeValue('white', 'gray.700');

  // Gefilterte Kunden für das Menü
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <HStack mb={6} spacing={4}>
        <IconButton
          aria-label="Zurück"
          icon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/events')}
        />
        <Heading size="lg">
          {isEditMode ? 'Event bearbeiten' : 'Neues Event erstellen'}
        </Heading>
      </HStack>

      <Box 
        as="form" 
        onSubmit={handleSubmit(onSubmit)}
        bg={bgColor}
        p={6}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Tabs colorScheme="blue" mb={6}>
          <TabList>
            <Tab>Allgemein</Tab>
            <Tab>Details</Tab>
            <Tab>Menü</Tab>
            <Tab>Personal</Tab>
            <Tab>Equipment</Tab>
          </TabList>

          <TabPanels mt={4}>
            {/* Allgemeine Informationen */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Veranstaltungsname*</FormLabel>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Name ist erforderlich' }}
                    render={({ field }) => <Input {...field} />}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.client}>
                  <FormLabel>Kunde*</FormLabel>
                  <Controller
                    name="client"
                    control={control}
                    rules={{ required: 'Kunde ist erforderlich' }}
                    render={({ field }) => (
                      <Select {...field} placeholder="Kunde auswählen">
                        {mockClients.map((client) => (
                          <option key={client.id} value={client.name}>
                            {client.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <FormErrorMessage>{errors.client?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.date}>
                  <FormLabel>Datum*</FormLabel>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: 'Datum ist erforderlich' }}
                    render={({ field }) => <Input {...field} type="date" />}
                  />
                  <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                </FormControl>

                <SimpleGrid columns={2} spacing={3}>
                  <FormControl isInvalid={!!errors.startTime}>
                    <FormLabel>Beginn*</FormLabel>
                    <Controller
                      name="startTime"
                      control={control}
                      rules={{ required: 'Startzeit ist erforderlich' }}
                      render={({ field }) => <Input {...field} type="time" />}
                    />
                    <FormErrorMessage>{errors.startTime?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.endTime}>
                    <FormLabel>Ende*</FormLabel>
                    <Controller
                      name="endTime"
                      control={control}
                      rules={{ required: 'Endzeit ist erforderlich' }}
                      render={({ field }) => <Input {...field} type="time" />}
                    />
                    <FormErrorMessage>{errors.endTime?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <FormControl isInvalid={!!errors.location}>
                  <FormLabel>Veranstaltungsort*</FormLabel>
                  <Controller
                    name="location"
                    control={control}
                    rules={{ required: 'Veranstaltungsort ist erforderlich' }}
                    render={({ field }) => <Input {...field} />}
                  />
                  <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.address}>
                  <FormLabel>Adresse</FormLabel>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.guests}>
                  <FormLabel>Anzahl Gäste*</FormLabel>
                  <Controller
                    name="guests"
                    control={control}
                    rules={{ required: 'Gästeanzahl ist erforderlich' }}
                    render={({ field }) => (
                      <NumberInput min={1} max={1000} {...field}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>{errors.guests?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.status}>
                  <FormLabel>Status*</FormLabel>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: 'Status ist erforderlich' }}
                    render={({ field }) => (
                      <Select {...field} placeholder="Status auswählen">
                        <option value="angefragt">Angefragt</option>
                        <option value="geplant">Geplant</option>
                        <option value="bestätigt">Bestätigt</option>
                        <option value="abgeschlossen">Abgeschlossen</option>
                        <option value="storniert">Storniert</option>
                      </Select>
                    )}
                  />
                  <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.type}>
                  <FormLabel>Event-Typ*</FormLabel>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Event-Typ ist erforderlich' }}
                    render={({ field }) => (
                      <Select {...field} placeholder="Typ auswählen">
                        <option value="firmenevent">Firmenevent</option>
                        <option value="hochzeit">Hochzeit</option>
                        <option value="geburtstag">Geburtstag</option>
                        <option value="konferenz">Konferenz</option>
                        <option value="produktpräsentation">Produktpräsentation</option>
                        <option value="messe">Messe</option>
                        <option value="andere">Andere</option>
                      </Select>
                    )}
                  />
                  <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl mt={6} isInvalid={!!errors.description}>
                <FormLabel>Beschreibung</FormLabel>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} rows={4} />
                  )}
                />
                <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
              </FormControl>
            </TabPanel>

            {/* Details Tab */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={4}>Event-Details</Heading>
                <Text color="gray.500">
                  Dieser Bereich wird in der nächsten Phase implementiert. 
                  Hier können zusätzliche Details zum Event hinzugefügt werden.
                </Text>
              </Box>
            </TabPanel>

            {/* Menü Tab */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={4}>Menüplanung</Heading>
                <Text color="gray.500">
                  Dieser Bereich wird in der nächsten Phase implementiert.
                  Hier können Menüs und Getränke für das Event geplant werden.
                </Text>
              </Box>
            </TabPanel>

            {/* Personal Tab */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={4}>Personaleinsatz</Heading>
                <Text color="gray.500">
                  Dieser Bereich wird in der nächsten Phase implementiert.
                  Hier kann das Personal für das Event geplant werden.
                </Text>
              </Box>
            </TabPanel>

            {/* Equipment Tab */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={4}>Equipment</Heading>
                <Text color="gray.500">
                  Dieser Bereich wird in der nächsten Phase implementiert.
                  Hier kann das benötigte Equipment für das Event geplant werden.
                </Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <HStack justify="flex-end" spacing={4} mt={8}>
          <Button 
            as={Link} 
            to="/events"
            variant="outline" 
            leftIcon={<FiX />}
          >
            Abbrechen
          </Button>
          <Button 
            type="submit" 
            colorScheme="blue" 
            leftIcon={<FiSave />}
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default EventFormPage; 