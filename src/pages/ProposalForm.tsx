import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  useToast,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import { ProposalFormData, ProposalItem, Client } from '../types';
import ClientSelection from '../components/proposals/forms/ClientSelection';
import EventDetails from '../components/proposals/forms/EventDetails';
import ItemsSelection from '../components/proposals/forms/ItemsSelection';
import { FiSave, FiX } from 'react-icons/fi';

const ProposalForm: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ProposalFormData>({
    clientId: '',
    client: null,
    title: '',
    eventName: '',
    eventDate: '',
    eventStartTime: '',
    eventEndTime: '',
    eventLocation: '',
    eventAddress: '',
    eventType: '',
    orderType: 'delivery',
    guests: 0,
    introText: '',
    items: [],
    subtotal: 0,
    taxRate: 19,
    taxAmount: 0,
    total: 0,
    depositAmount: 0,
    depositDueDate: '',
    paymentTerms: '',
    validUntil: '',
    status: 'draft',
    termsAndConditions: ''
  });

  const handleFieldChange = (field: keyof ProposalFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientSelect = (client: Client | null) => {
    setSelectedClient(client);
    if (client) {
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        client: client
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        clientId: '',
        client: null
      }));
    }
  };

  const handleItemsChange = (items: ProposalItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;

    setFormData(prev => ({
      ...prev,
      items,
      subtotal,
      taxAmount,
      total
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Implementiere die Speicherlogik
      toast({
        title: 'Angebot gespeichert',
        description: 'Das Angebot wurde erfolgreich gespeichert.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Beim Speichern ist ein Fehler aufgetreten.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    onOpen();
  };

  const handleConfirmCancel = () => {
    // TODO: Implementiere die Abbruchlogik
    onClose();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Neues Angebot erstellen</Heading>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <VStack spacing={8} align="stretch">
            <ClientSelection
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
            />

            <EventDetails
              formData={formData}
              onChange={handleFieldChange}
            />

            <ItemsSelection
              items={formData.items}
              onChange={handleItemsChange}
              guests={formData.guests}
            />

            <HStack justify="flex-end" spacing={4}>
              <Button
                leftIcon={<FiX />}
                variant="outline"
                onClick={handleCancel}
              >
                Abbrechen
              </Button>
              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={handleSave}
              >
                Angebot speichern
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>

      {/* Bestätigungsmodal für Abbruch */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Änderungen verwerfen?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text>
                Möchten Sie wirklich alle Änderungen verwerfen? Diese Aktion kann nicht rückgängig gemacht werden.
              </Text>
              <HStack spacing={4} justify="flex-end" width="100%">
                <Button variant="ghost" onClick={onClose}>
                  Abbrechen
                </Button>
                <Button colorScheme="red" onClick={handleConfirmCancel}>
                  Verwerfen
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProposalForm; 