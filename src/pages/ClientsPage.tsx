import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  HStack,
  VStack,
  Text,
  Badge,
  IconButton,
  useToast,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ChevronDownIcon, DownloadIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Client, ClientType } from '../types';
import clientService from '../services/clientService';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ClientFilters {
  type?: ClientType;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'lastEventDate';
  sortOrder?: 'asc' | 'desc';
  tags?: string[];
  newsletter?: boolean;
  eventHistory?: boolean;
}

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ClientFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, [filters]);

  const loadClients = async () => {
    try {
      const data = await clientService.getClients({
        ...filters,
        search: searchQuery,
      });
      setClients(data);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kunden konnten nicht geladen werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters((prev: ClientFilters) => ({ ...prev, search: value }));
  };

  const handleTypeFilter = (type: ClientType | '') => {
    setFilters((prev: ClientFilters) => ({ ...prev, type: type as ClientType }));
  };

  const handleSort = (sortBy: 'name' | 'createdAt' | 'lastEventDate') => {
    setFilters((prev: ClientFilters) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie diesen Kunden wirklich löschen?')) {
      try {
        const result = await clientService.deleteClient(id);
        if (result.success) {
          toast({
            title: 'Erfolg',
            description: 'Kunde wurde erfolgreich gelöscht.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          loadClients();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: 'Fehler',
          description: 'Kunde konnte nicht gelöscht werden.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Typ', 'Name', 'E-Mail', 'Telefon', 'Adresse', 'Events', 'Umsatz', 'Kunde seit'],
      ...clients.map((client: Client) => [
        client.id,
        client.type === 'private' ? 'Privat' : 'Geschäftlich',
        client.type === 'private' 
          ? `${client.firstName} ${client.lastName}`
          : client.companyName,
        client.email,
        client.phone,
        `${client.street}, ${client.postalCode} ${client.city}`,
        client.previousOrders.toString(),
        client.totalRevenue.toString(),
        format(new Date(client.customerSince), 'dd.MM.yyyy', { locale: de }),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kunden_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getClientName = (client: Client): string => {
    return client.type === 'private'
      ? `${client.firstName} ${client.lastName}`
      : client.companyName || '';
  };

  const getStatusColor = (client: Client): string => {
    if (client.previousOrders > 5) return 'green';
    if (client.previousOrders > 0) return 'blue';
    return 'gray';
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Kunden</Heading>
        <HStack spacing={4}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            onClick={() => navigate('/clients/new')}
          >
            Neuer Kunde
          </Button>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="blue"
            onClick={handleExport}
          >
            Exportieren
          </Button>
        </HStack>
      </Flex>

      <VStack spacing={4} align="stretch" mb={6}>
        <HStack>
          <Input
            placeholder="Kunde suchen..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            maxW="300px"
          />
          <Select
            placeholder="Kundentyp"
            value={filters.type || ''}
            onChange={(e) => handleTypeFilter(e.target.value as ClientType)}
            maxW="200px"
          >
            <option value="private">Privat</option>
            <option value="business">Geschäftlich</option>
          </Select>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Sortieren nach
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleSort('name')}>Name</MenuItem>
              <MenuItem onClick={() => handleSort('createdAt')}>Erstellt am</MenuItem>
              <MenuItem onClick={() => handleSort('lastEventDate')}>Letztes Event</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </VStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Typ</Th>
              <Th>Kontakt</Th>
              <Th>Adresse</Th>
              <Th>Events</Th>
              <Th>Umsatz</Th>
              <Th>Aktionen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client: Client) => (
              <Tr key={client.id}>
                <Td>
                  {client.type === 'private'
                    ? `${client.firstName} ${client.lastName}`
                    : client.companyName}
                </Td>
                <Td>
                  <Badge colorScheme={client.type === 'private' ? 'green' : 'blue'}>
                    {client.type === 'private' ? 'Privat' : 'Geschäftlich'}
                  </Badge>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text>{client.email}</Text>
                    <Text>{client.phone}</Text>
                  </VStack>
                </Td>
                <Td>
                  <Text>
                    {client.street}, {client.postalCode} {client.city}
                  </Text>
                </Td>
                <Td>{client.previousOrders}</Td>
                <Td>{client.totalRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Bearbeiten"
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    />
                    <IconButton
                      aria-label="Löschen"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(client.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default ClientsPage; 