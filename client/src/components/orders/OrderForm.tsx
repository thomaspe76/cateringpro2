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
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<Order, 'id'>) => Promise<void>;
  order?: Order;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  onSave,
  order,
}) => {
  const [customers, setCustomers] = useState<Array<{ id: string; name: string }>>([]);
  const [products, setProducts] = useState<Array<{ id: string; name: string; price: number }>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([]);
  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    if (order) {
      setSelectedCustomer(order.customerId);
      setItems(order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })));
    }
  }, [order]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/customers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        throw new Error('Fehler beim Laden der Kunden');
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kunden konnten nicht geladen werden',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error('Fehler beim Laden der Produkte');
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Produkte konnten nicht geladen werden',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      toast({
        title: 'Fehler',
        description: 'Bitte wählen Sie einen Kunden aus',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Fehler',
        description: 'Bitte fügen Sie mindestens ein Produkt hinzu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;

    const newOrder: Omit<Order, 'id'> = {
      orderNumber: order?.orderNumber || `ORD-${Date.now()}`,
      customerId: selectedCustomer,
      customerName: customer.name,
      date: new Date().toISOString(),
      status: 'pending',
      totalAmount: calculateTotal(),
      items: items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          id: `item-${Date.now()}-${Math.random()}`,
          productId: item.productId,
          productName: product?.name || '',
          quantity: item.quantity,
          price: product?.price || 0,
        };
      }),
    };

    try {
      await onSave(newOrder);
      onClose();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Auftrag konnte nicht gespeichert werden',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {order ? 'Auftrag bearbeiten' : 'Neuer Auftrag'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Kunde</FormLabel>
              <Select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Kunde auswählen</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Produkte</FormLabel>
              <VStack spacing={4} align="stretch">
                {items.map((item, index) => (
                  <HStack key={index}>
                    <Select
                      flex={2}
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    >
                      <option value="">Produkt auswählen</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.price.toFixed(2)} €
                        </option>
                      ))}
                    </Select>
                    <NumberInput
                      flex={1}
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleItemChange(index, 'quantity', parseInt(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <IconButton
                      aria-label="Produkt entfernen"
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveItem(index)}
                    />
                  </HStack>
                ))}
                <Button
                  leftIcon={<FiPlus />}
                  onClick={handleAddItem}
                  colorScheme="blue"
                  variant="outline"
                >
                  Produkt hinzufügen
                </Button>
              </VStack>
            </FormControl>

            <FormControl>
              <FormLabel>Gesamtbetrag</FormLabel>
              <Text fontSize="xl" fontWeight="bold">
                {calculateTotal().toFixed(2)} €
              </Text>
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