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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Switch,
  useToast,
} from '@chakra-ui/react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  unit: string;
  isActive: boolean;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => Promise<void>;
  product?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    unit: '',
    isActive: true,
  });
  const toast = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        unit: product.unit,
        isActive: product.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        unit: '',
        isActive: true,
      });
    }
  }, [product]);

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

    if (!formData.category) {
      toast({
        title: 'Fehler',
        description: 'Bitte wählen Sie eine Kategorie',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.unit) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie eine Einheit ein',
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
        description: 'Produkt konnte nicht gespeichert werden',
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
          {product ? 'Produkt bearbeiten' : 'Neues Produkt'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Produktname eingeben"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Beschreibung</FormLabel>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Produktbeschreibung eingeben"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Preis</FormLabel>
              <NumberInput
                value={formData.price}
                min={0}
                step={0.01}
                onChange={(value) => setFormData({ ...formData, price: parseFloat(value) })}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Kategorie</FormLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Kategorie auswählen</option>
                <option value="vorspeisen">Vorspeisen</option>
                <option value="hauptgerichte">Hauptgerichte</option>
                <option value="desserts">Desserts</option>
                <option value="getraenke">Getränke</option>
                <option value="service">Service</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Einheit</FormLabel>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="z.B. Stück, kg, l"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Aktiv</FormLabel>
              <Switch
                isChecked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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