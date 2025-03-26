import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useToast,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
  SelectField,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiFilter, FiMoreVertical, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Proposal, ProposalStatus } from '../types/proposal';

const ProposalPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Beispiel-Daten (später durch echte Daten ersetzen)
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      number: 'ANB-2024-001',
      clientId: '1',
      eventName: 'Weihnachtsfeier',
      eventDate: '2024-12-20',
      eventStartTime: '18:00',
      eventEndTime: '23:00',
      guests: 50,
      eventLocation: 'Hauptsitz',
      items: [],
      taxRate: 19,
      notes: '',
      status: 'draft',
      totalAmount: 0,
      taxAmount: 0,
      finalAmount: 0,
      orderType: 'with_staff',
      subtotal: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Weitere Beispiel-Angebote hier...
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case 'draft':
        return 'gray';
      case 'sent':
        return 'blue';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: ProposalStatus) => {
    switch (status) {
      case 'draft':
        return 'Entwurf';
      case 'sent':
        return 'Gesendet';
      case 'accepted':
        return 'Akzeptiert';
      case 'rejected':
        return 'Abgelehnt';
      default:
        return 'Unbekannt';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Hier API-Aufruf zum Löschen implementieren
      setProposals(proposals.filter(p => p.id !== id));
      toast({
        title: 'Angebot gelöscht',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Fehler beim Löschen',
        description: 'Das Angebot konnte nicht gelöscht werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Angebote</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={() => navigate('/proposals/new')}
        >
          Neues Angebot
        </Button>
      </Flex>

      <VStack spacing={4} align="stretch" mb={6}>
        <HStack spacing={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch />
            </InputLeftElement>
            <Input
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | 'all')}
          >
            <option value="all">Alle Status</option>
            <option value="draft">Entwurf</option>
            <option value="sent">Gesendet</option>
            <option value="accepted">Akzeptiert</option>
            <option value="rejected">Abgelehnt</option>
          </Select>
        </HStack>
      </VStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Veranstaltung</Th>
              <Th>Datum</Th>
              <Th>Gäste</Th>
              <Th>Status</Th>
              <Th>Gesamtbetrag</Th>
              <Th>Aktionen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProposals.map((proposal) => (
              <Tr key={proposal.id}>
                <Td>{proposal.eventName}</Td>
                <Td>{new Date(proposal.eventDate).toLocaleDateString()}</Td>
                <Td>{proposal.guests}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(proposal.status)}>
                    {getStatusText(proposal.status)}
                  </Badge>
                </Td>
                <Td>{proposal.finalAmount.toFixed(2)} €</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEye />} onClick={() => navigate(`/proposals/${proposal.id}`)}>
                        Ansehen
                      </MenuItem>
                      <MenuItem icon={<FiEdit2 />} onClick={() => navigate(`/proposals/${proposal.id}/edit`)}>
                        Bearbeiten
                      </MenuItem>
                      <MenuItem icon={<FiTrash2 />} onClick={() => handleDelete(proposal.id)} color="red.500">
                        Löschen
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default ProposalPage; 