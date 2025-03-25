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
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { CustomerForm } from './CustomerForm';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/clients', {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie diesen Kunden wirklich löschen?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3005/api/clients/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setCustomers(customers.filter(customer => customer.id !== id));
          toast({
            title: 'Erfolg',
            description: 'Kunde wurde gelöscht',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error('Fehler beim Löschen des Kunden');
        }
      } catch (error) {
        toast({
          title: 'Fehler',
          description: 'Kunde konnte nicht gelöscht werden',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSave = async (customer: Omit<Customer, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        const newCustomer = await response.json();
        setCustomers([...customers, newCustomer]);
      } else {
        throw new Error('Fehler beim Erstellen des Kunden');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (id: string, customer: Omit<Customer, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomers(customers.map(c => c.id === id ? updatedCustomer : c));
      } else {
        throw new Error('Fehler beim Aktualisieren des Kunden');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(undefined);
    setIsFormOpen(true);
  };

  return (
    <Card w="100%" borderRadius="0">
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="lg">Kundenverwaltung</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleAdd}
          >
            Neuer Kunde
          </Button>
        </HStack>
      </CardHeader>
      <CardBody p={0}>
        <Box overflowX="auto" w="100%">
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>E-Mail</Th>
                <Th>Telefon</Th>
                <Th>Adresse</Th>
                <Th>Aktionen</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.id}>
                  <Td>{`${customer.firstName} ${customer.lastName}`}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.phone}</Td>
                  <Td>{customer.address}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Bearbeiten"
                        icon={<FiEdit2 />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEdit(customer)}
                      />
                      <IconButton
                        aria-label="Löschen"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(customer.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>

      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={selectedCustomer ? 
          (customer) => handleUpdate(selectedCustomer.id, customer) : 
          handleSave}
        customer={selectedCustomer}
      />
    </Card>
  );
}; 