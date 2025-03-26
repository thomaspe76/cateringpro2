import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  VStack,
  HStack,
  Text,
  useToast,
  Box
} from '@chakra-ui/react';
import { ProposalItem, ItemCategory } from '../../../types/proposal';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ProposalItem) => void;
  item?: ProposalItem;
  initialCategory?: ItemCategory;
  guests: number;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
  initialCategory,
  guests
}) => {
  const [formData, setFormData] = useState<Partial<ProposalItem>>({
    name: '',
    description: '',
    quantity: 1,
    unit: 'Stück',
    unitPrice: 0,
    category: initialCategory || 'food',
    taxRate: 19
  });

  const toast = useToast();

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        description: '',
        quantity: 1,
        unit: 'Stück',
        unitPrice: 0,
        category: initialCategory || 'food',
        taxRate: 19
      });
    }
  }, [item, initialCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalPrice = () => {
    return (formData.quantity || 0) * (formData.unitPrice || 0);
  };

  const calculatePricePerPerson = () => {
    if (guests === 0) return 0;
    return calculateTotalPrice() / guests;
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.quantity || !formData.unitPrice) {
      toast({
        title: 'Fehler',
        description: 'Bitte füllen Sie alle erforderlichen Felder aus',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newItem: ProposalItem = {
      id: item?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description || '',
      quantity: formData.quantity || 1,
      unit: formData.unit || 'Stück',
      unitPrice: formData.unitPrice || 0,
      category: formData.category as ItemCategory,
      taxRate: formData.taxRate || 19
    };

    onSave(newItem);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {item ? 'Position bearbeiten' : 'Neue Position'}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Bezeichnung</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Bezeichnung der Position"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Beschreibung</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optionale Beschreibung"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Kategorie</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="food">Speisen</option>
                <option value="drinks">Getränke</option>
                <option value="staff">Personal</option>
                <option value="delivery">Lieferung</option>
                <option value="other">Sonstiges</option>
              </Select>
            </FormControl>

            <HStack spacing={4} width="100%">
              <FormControl isRequired>
                <FormLabel>Menge</FormLabel>
                <NumberInput
                  min={1}
                  value={formData.quantity}
                  onChange={(_, value) => handleNumberChange('quantity', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Einheit</FormLabel>
                <Input
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="z.B. Stück"
                />
              </FormControl>
            </HStack>

            <FormControl isRequired>
              <FormLabel>Einzelpreis</FormLabel>
              <NumberInput
                min={0}
                value={formData.unitPrice}
                onChange={(_, value) => handleNumberChange('unitPrice', value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>MwSt.-Satz</FormLabel>
              <NumberInput
                min={0}
                max={100}
                value={formData.taxRate}
                onChange={(_, value) => handleNumberChange('taxRate', value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Box width="100%" p={4} bg="gray.50" borderRadius="md">
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="medium">Gesamtpreis:</Text>
                  <Text>{calculateTotalPrice().toFixed(2)} €</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="medium">Preis pro Person:</Text>
                  <Text>{calculatePricePerPerson().toFixed(2)} €</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Abbrechen
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {item ? 'Speichern' : 'Hinzufügen'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemFormModal; 