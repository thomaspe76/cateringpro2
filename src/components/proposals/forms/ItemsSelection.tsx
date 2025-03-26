import React from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Text,
  IconButton,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { ProposalItem } from '../../../types';

interface ItemsSelectionProps {
  items: ProposalItem[];
  onChange: (items: ProposalItem[]) => void;
  guests: number;
}

const ItemsSelection: React.FC<ItemsSelectionProps> = ({ items, onChange, guests }) => {
  const handleAddItem = () => {
    const newItem: ProposalItem = {
      id: Date.now().toString(),
      category: 'food',
      name: '',
      description: '',
      quantity: 1,
      unit: 'Stück',
      unitPrice: 0,
      totalPrice: 0,
    };
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ProposalItem, value: any) => {
    onChange(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontWeight="bold">Angebotspositionen</Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          onClick={handleAddItem}
        >
          Position hinzufügen
        </Button>
      </HStack>

      {items.map((item) => (
        <Box key={item.id} p={4} borderWidth={1} borderRadius="md">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium">Position {items.indexOf(item) + 1}</Text>
              <IconButton
                aria-label="Position löschen"
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(item.id)}
              />
            </HStack>

            <FormControl>
              <FormLabel>Kategorie</FormLabel>
              <Select
                value={item.category}
                onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
              >
                <option value="food">Speisen</option>
                <option value="beverage">Getränke</option>
                <option value="staff">Personal</option>
                <option value="equipment">Equipment</option>
                <option value="other">Sonstiges</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Bezeichnung</FormLabel>
              <Input
                value={item.name}
                onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                placeholder="z.B. 3-Gänge-Menü"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Beschreibung</FormLabel>
              <Textarea
                value={item.description}
                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                placeholder="Detaillierte Beschreibung der Position"
                rows={2}
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Menge</FormLabel>
                <NumberInput
                  min={1}
                  value={item.quantity}
                  onChange={(value) => handleItemChange(item.id, 'quantity', parseInt(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Einheit</FormLabel>
                <Input
                  value={item.unit}
                  onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                  placeholder="z.B. Stück, kg, l"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Einzelpreis (€)</FormLabel>
                <NumberInput
                  min={0}
                  value={item.unitPrice}
                  onChange={(value) => handleItemChange(item.id, 'unitPrice', parseFloat(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </HStack>

            <HStack justify="flex-end">
              <Text fontWeight="bold">
                Gesamtpreis: {item.totalPrice.toFixed(2)} €
              </Text>
            </HStack>
          </VStack>
        </Box>
      ))}

      <Box pt={4}>
        <HStack justify="space-between">
          <Text fontWeight="bold">Gesamtbetrag:</Text>
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            {calculateTotal().toFixed(2)} €
          </Text>
        </HStack>
      </Box>
    </VStack>
  );
};

export default ItemsSelection; 