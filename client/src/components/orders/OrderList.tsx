import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  HStack,
  useToast,
  IconButton,
  Badge,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { OrderForm } from './OrderForm';

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

export const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        throw new Error('Fehler beim Laden der Aufträge');
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Aufträge konnten nicht geladen werden',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie diesen Auftrag wirklich löschen?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3005/api/orders/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setOrders(orders.filter(order => order.id !== id));
          toast({
            title: 'Erfolg',
            description: 'Auftrag wurde gelöscht',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error('Fehler beim Löschen des Auftrags');
        }
      } catch (error) {
        toast({
          title: 'Fehler',
          description: 'Auftrag konnte nicht gelöscht werden',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSave = async (order: Omit<Order, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const newOrder = await response.json();
        setOrders([...orders, newOrder]);
      } else {
        throw new Error('Fehler beim Erstellen des Auftrags');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (id: string, order: Omit<Order, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(o => o.id === id ? updatedOrder : o));
      } else {
        throw new Error('Fehler beim Aktualisieren des Auftrags');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedOrder(undefined);
    setIsFormOpen(true);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'blue';
      case 'in_progress':
        return 'purple';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend';
      case 'confirmed':
        return 'Bestätigt';
      case 'in_progress':
        return 'In Bearbeitung';
      case 'completed':
        return 'Abgeschlossen';
      case 'cancelled':
        return 'Storniert';
      default:
        return status;
    }
  };

  return (
    <Card w="100%" borderRadius="0">
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="lg">Auftragsverwaltung</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleAdd}
          >
            Neuer Auftrag
          </Button>
        </HStack>
      </CardHeader>
      <CardBody p={0}>
        <Box overflowX="auto" w="100%">
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>Auftragsnummer</Th>
                <Th>Kunde</Th>
                <Th>Datum</Th>
                <Th>Status</Th>
                <Th>Gesamtbetrag</Th>
                <Th>Aktionen</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.orderNumber}</Td>
                  <Td>{order.customerName}</Td>
                  <Td>{new Date(order.date).toLocaleDateString()}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </Td>
                  <Td>{order.totalAmount.toFixed(2)} €</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Bearbeiten"
                        icon={<FiEdit2 />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEdit(order)}
                      />
                      <IconButton
                        aria-label="Löschen"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(order.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>

      <OrderForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={selectedOrder ? 
          (order) => handleUpdate(selectedOrder.id, order) : 
          handleSave}
        order={selectedOrder}
      />
    </Card>
  );
}; 