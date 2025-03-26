import React, { useState } from 'react';
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
  Select,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Client, ClientType } from '../../types/client';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  initialData?: Partial<Client>;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    type: 'business',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newClient: Client = {
      id: initialData.id || Date.now().toString(),
      name: formData.name!,
      type: formData.type as ClientType,
      contactName: formData.contactName,
      email: formData.email!,
      phone: formData.phone,
      address: formData.address,
      createdAt: initialData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newClient);
    onClose();
  };

  const handleChange = (field: keyof Client, value: string) => {
    setFormData((prev: Partial<Client>) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialData.id ? 'Kunde bearbeiten' : 'Neuer Kunde'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Firmenname oder vollständiger Name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Kundentyp</FormLabel>
              <Select
                value={formData.type || 'business'}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="business">Geschäftskunde</option>
                <option value="private">Privatkunde</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Ansprechpartner</FormLabel>
              <Input
                value={formData.contactName || ''}
                onChange={(e) => handleChange('contactName', e.target.value)}
                placeholder="Name des Ansprechpartners"
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>E-Mail</FormLabel>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@beispiel.de"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Telefon</FormLabel>
              <Input
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+49 123 456789"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Adresse</FormLabel>
              <Input
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Straße, PLZ Ort"
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

export default ClientFormModal; 