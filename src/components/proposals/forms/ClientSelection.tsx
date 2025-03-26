import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Input,
  FormErrorMessage,
  HStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Client } from '../../../types';
import { clientService } from '../../../services/clientService';

interface ClientSelectionProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client | null) => void;
}

const ClientSelection: React.FC<ClientSelectionProps> = ({
  selectedClient,
  onClientSelect,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newClient, setNewClient] = useState<Partial<Client>>({
    firstName: '',
    lastName: '',
    type: 'private',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'Deutschland',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Fehler beim Laden der Kunden');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async () => {
    try {
      const clientToCreate = {
        ...newClient,
        name: `${newClient.firstName} ${newClient.lastName}`.trim(),
      };
      const createdClient = await clientService.createClient(clientToCreate as Client);
      setClients([...clients, createdClient]);
      onClientSelect(createdClient);
      onClose();
      setNewClient({
        firstName: '',
        lastName: '',
        type: 'private',
        email: '',
        phone: '',
        street: '',
        postalCode: '',
        city: '',
        country: 'Deutschland',
      });
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Fehler beim Erstellen des Kunden');
    }
  };

  return (
    <Box>
      <FormControl isInvalid={!!error}>
        <FormLabel>Kunde</FormLabel>
        <Select
          value={selectedClient?.id || ''}
          onChange={(e) => {
            const client = clients.find(c => c.id === e.target.value);
            onClientSelect(client || null);
          }}
        >
          <option value="">Kunde auswählen</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>

      {selectedClient && (
        <VStack align="start" mt={4} spacing={1}>
          <Text fontWeight="medium">{selectedClient.firstName} {selectedClient.lastName}</Text>
          <Text color="gray.600">{selectedClient.email}</Text>
          <Text color="gray.600">{selectedClient.phone}</Text>
          <Text color="gray.600">
            {selectedClient.street}, {selectedClient.postalCode} {selectedClient.city}
          </Text>
        </VStack>
      )}

      <Button
        leftIcon={<AddIcon />}
        variant="outline"
        mt={4}
        onClick={onOpen}
      >
        Neuen Kunden erstellen
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Neuen Kunden erstellen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <HStack spacing={4} width="100%">
                <FormControl>
                  <FormLabel>Vorname</FormLabel>
                  <Input
                    value={newClient.firstName}
                    onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                    placeholder="Vorname"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Nachname</FormLabel>
                  <Input
                    value={newClient.lastName}
                    onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                    placeholder="Nachname"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>E-Mail</FormLabel>
                <Input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="E-Mail-Adresse"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Telefon</FormLabel>
                <Input
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="Telefonnummer"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Straße</FormLabel>
                <Input
                  value={newClient.street}
                  onChange={(e) => setNewClient({ ...newClient, street: e.target.value })}
                  placeholder="Straße und Hausnummer"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Postleitzahl</FormLabel>
                <Input
                  value={newClient.postalCode}
                  onChange={(e) => setNewClient({ ...newClient, postalCode: e.target.value })}
                  placeholder="PLZ"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Stadt</FormLabel>
                <Input
                  value={newClient.city}
                  onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                  placeholder="Stadt"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Abbrechen
            </Button>
            <Button colorScheme="blue" onClick={handleCreateClient}>
              Erstellen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClientSelection; 