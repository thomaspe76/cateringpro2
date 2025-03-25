import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id'>) => Promise<void>;
  customer?: Customer;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  customer,
}) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const toast = useToast();

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        notes: customer.notes,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
      });
    }
  }, [customer]);

  const handleSubmit = async () => {
    if (!formData.name) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie einen Namen ein',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.email) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie eine E-Mail-Adresse ein',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kunde konnte nicht gespeichert werden',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {customer ? 'Kunde bearbeiten' : 'Neuer Kunde'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name eingeben"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>E-Mail</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="E-Mail-Adresse eingeben"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Telefon</FormLabel>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Telefonnummer eingeben"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Adresse</FormLabel>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse eingeben"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Notizen</FormLabel>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notizen eingeben"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Abbrechen
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Speichern
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 