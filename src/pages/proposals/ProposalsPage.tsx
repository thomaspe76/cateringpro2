import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  useToast,
  Text,
  Stack,
  useColorModeValue,
  TableContainer,
  useBreakpointValue,
  Checkbox,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Input as ChakraInput,
} from '@chakra-ui/react';
import { 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiDownload, 
  FiSearch, 
  FiPlus,
  FiFilter,
  FiCalendar,
  FiUser,
  FiTag,
  FiCheckSquare,
  FiXSquare,
  FiClock,
  FiTruck,
  FiUsers,
  FiBox,
  FiShoppingCart,
} from 'react-icons/fi';
import { Proposal, ProposalStatus, OrderType } from '../../types/proposal';
import { format, isAfter, isBefore, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { mockProposals } from '../../mock/proposals';

const ProposalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>(mockProposals);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<OrderType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Proposal; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const bgColor = useColorModeValue('white', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Filter und Sortierung
  useEffect(() => {
    let filtered = [...proposals];

    // Status-Filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter);
    }

    // Bestelltyp-Filter
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.orderType === orderTypeFilter);
    }

    // Datumsbereich-Filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(proposal => {
        const proposalDate = new Date(proposal.createdAt);
        return isAfter(proposalDate, parse(dateRange.start, 'yyyy-MM-dd', new Date())) &&
               isBefore(proposalDate, parse(dateRange.end, 'yyyy-MM-dd', new Date()));
      });
    }

    // Suchfilter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(proposal => 
        proposal.number.toLowerCase().includes(query) ||
        proposal.clientId.toLowerCase().includes(query) ||
        proposal.eventName.toLowerCase().includes(query)
      );
    }

    // Sortierung
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProposals(filtered);
  }, [proposals, statusFilter, orderTypeFilter, dateRange, searchQuery, sortConfig]);

  // Paginierung
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof Proposal) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    onOpen();
  };

  const confirmDelete = () => {
    if (selectedProposal) {
      setProposals(proposals.filter(p => p.id !== selectedProposal.id));
      toast({
        title: 'Angebot gelöscht',
        description: 'Das Angebot wurde erfolgreich gelöscht.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  const getStatusColor = (status: ProposalStatus) => {
    const colors = {
      draft: 'gray',
      sent: 'blue',
      accepted: 'green',
      rejected: 'red',
      expired: 'orange',
    };
    return colors[status];
  };

  const getOrderTypeIcon = (type: OrderType) => {
    const icons = {
      with_staff: FiUsers,
      with_staff_and_delivery: FiTruck,
      delivery_only: FiBox,
      self_pickup: FiShoppingCart,
    };
    return icons[type];
  };

  const exportToCSV = () => {
    const headers = ['Nummer', 'Datum', 'Kunde', 'Veranstaltung', 'Bestelltyp', 'Betrag', 'Status', 'Ablaufdatum'];
    const csvContent = [
      headers.join(','),
      ...filteredProposals.map(proposal => [
        proposal.number,
        format(new Date(proposal.createdAt), 'dd.MM.yyyy', { locale: de }),
        proposal.clientId,
        proposal.eventName,
        proposal.orderType,
        proposal.totalAmount,
        proposal.status,
        proposal.expiryDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `angebote_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProposals(paginatedProposals.map(p => p.id));
    } else {
      setSelectedProposals([]);
    }
  };

  const handleSelectProposal = (id: string) => {
    setSelectedProposals(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  return (
    <Box p={6}>
      <Flex mb={6} align="center" justify="space-between" flexWrap="wrap" gap={4}>
        <Heading size="lg">Angebote</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={() => navigate('/proposals/new')}
        >
          Neues Angebot
        </Button>
      </Flex>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6}>
        <InputGroup maxW={{ base: 'full', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Angebot suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Select
          maxW={{ base: 'full', md: '200px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | 'all')}
        >
          <option value="all">Alle Status</option>
          <option value="draft">Entwurf</option>
          <option value="sent">Gesendet</option>
          <option value="accepted">Akzeptiert</option>
          <option value="rejected">Abgelehnt</option>
          <option value="expired">Abgelaufen</option>
        </Select>

        <Select
          maxW={{ base: 'full', md: '200px' }}
          value={orderTypeFilter}
          onChange={(e) => setOrderTypeFilter(e.target.value as OrderType | 'all')}
        >
          <option value="all">Alle Bestelltypen</option>
          <option value="with_staff">Mit Personal</option>
          <option value="with_staff_and_delivery">Mit Personal & Lieferung</option>
          <option value="delivery_only">Nur Lieferung</option>
          <option value="self_pickup">Selbstabholung</option>
        </Select>

        <Popover>
          <PopoverTrigger>
            <Button leftIcon={<FiCalendar />} variant="outline">
              Datumsbereich
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>Datumsbereich auswählen</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Von</FormLabel>
                  <ChakraInput
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Bis</FormLabel>
                  <ChakraInput
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </FormControl>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <Button
          leftIcon={<FiDownload />}
          onClick={exportToCSV}
          variant="outline"
        >
          Exportieren
        </Button>
      </Stack>

      <TableContainer bg={bgColor} borderRadius="lg" boxShadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  isChecked={selectedProposals.length === paginatedProposals.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('number')}>
                Nr. {sortConfig?.key === 'number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('createdAt')}>
                Datum {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th>Kunde</Th>
              <Th>Veranstaltung</Th>
              <Th>Bestelltyp</Th>
              <Th cursor="pointer" onClick={() => handleSort('totalAmount')}>
                Betrag {sortConfig?.key === 'totalAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th>Status</Th>
              <Th>Ablaufdatum</Th>
              <Th>Aktionen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProposals.map((proposal) => {
              const OrderTypeIcon = getOrderTypeIcon(proposal.orderType);
              const isExpiringSoon = isAfter(new Date(proposal.expiryDate), new Date()) &&
                                   isBefore(new Date(proposal.expiryDate), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

              return (
                <Tr key={proposal.id}>
                  <Td>
                    <Checkbox
                      isChecked={selectedProposals.includes(proposal.id)}
                      onChange={() => handleSelectProposal(proposal.id)}
                    />
                  </Td>
                  <Td>{proposal.number}</Td>
                  <Td>{format(new Date(proposal.createdAt), 'dd.MM.yyyy', { locale: de })}</Td>
                  <Td>{proposal.clientId}</Td>
                  <Td>{proposal.eventName}</Td>
                  <Td>
                    <Tooltip label={proposal.orderType}>
                      <Box>
                        <OrderTypeIcon />
                      </Box>
                    </Tooltip>
                  </Td>
                  <Td>{proposal.totalAmount.toFixed(2)} €</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(proposal.status)}>
                      {proposal.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Tooltip label={isExpiringSoon ? 'Ablaufdatum nahe' : ''}>
                      <Text color={isExpiringSoon ? 'orange.500' : 'inherit'}>
                        {format(new Date(proposal.expiryDate), 'dd.MM.yyyy', { locale: de })}
                      </Text>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Weitere Optionen"
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
                        <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleDelete(proposal)}>
                          Löschen
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justify="center" mt={6} gap={2}>
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
        >
          Zurück
        </Button>
        <Text alignSelf="center">
          Seite {currentPage} von {totalPages}
        </Text>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          isDisabled={currentPage === totalPages}
        >
          Weiter
        </Button>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Angebot löschen</AlertDialogHeader>
            <AlertDialogBody>
              Sind Sie sicher, dass Sie das Angebot "{selectedProposal?.number}" löschen möchten?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Abbrechen
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Löschen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProposalsPage; 