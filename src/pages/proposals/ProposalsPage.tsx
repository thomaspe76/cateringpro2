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
  Icon,
  Tabs,
  TabList,
  Tab,
  Spinner,
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
  FiAlertCircle,
  FiPackage,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import { Proposal, ProposalStatus, OrderType } from '../../types';
import { format, isAfter, isBefore, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import OrderTypeIcon from '../../components/proposals/OrderTypeIcon';
import ProposalStatusBadge from '../../components/proposals/ProposalStatusBadge';
import { ProposalPdfPreview } from '../../components/proposals/ProposalPdfPreview';
import { proposalService } from '../../services/proposalService';

const ProposalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<OrderType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Proposal | ''; direction: 'asc' | 'desc' }>({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPdfPreviewOpen, onOpen: onPdfPreviewOpen, onClose: onPdfPreviewClose } = useDisclosure();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const bgColor = useColorModeValue('white', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Lade Angebote beim Start
  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setIsLoading(true);
    try {
      const response = await proposalService.getProposals();
      setProposals(response);
      setFilteredProposals(response);
    } catch (error) {
      console.error('Fehler beim Laden der Angebote:', error);
      toast({
        title: 'Fehler',
        description: 'Die Angebote konnten nicht geladen werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProposals = () => {
    let filtered = [...proposals];

    // Statusfilter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter);
    }

    // Auftragstyp-Filter
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.orderType === orderTypeFilter);
    }

    // Suchfilter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(proposal =>
        proposal.number.toLowerCase().includes(query) ||
        proposal.eventName.toLowerCase().includes(query) ||
        proposal.totalAmount.toString().includes(query)
      );
    }

    // Datumsfilter
    if (dateRange.start) {
      filtered = filtered.filter(proposal => {
        return isAfter(new Date(proposal.eventDate), new Date(dateRange.start));
      });
    }
    if (dateRange.end) {
      filtered = filtered.filter(proposal => {
        return isBefore(new Date(proposal.eventDate), new Date(dateRange.end));
      });
    }

    return filtered;
  };

  const handleSort = (key: keyof Proposal) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const sortProposals = (proposals: Proposal[]) => {
    if (!sortConfig.key) return proposals;

    return [...proposals].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Proposal];
      const bValue = b[sortConfig.key as keyof Proposal];

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });
  };

  const paginatedProposals = sortProposals(filterProposals()).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const getStatusColor = (status: ProposalStatus): string => {
    const colors: Record<ProposalStatus, string> = {
      draft: 'gray',
      sent: 'blue',
      accepted: 'green',
      rejected: 'red',
    };
    return colors[status];
  };

  const exportToCSV = () => {
    const headers = ['Nummer', 'Datum', 'Kunde', 'Veranstaltung', 'Bestelltyp', 'Betrag', 'Status', 'Veranstaltungsdatum'];
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
        proposal.eventDate
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
      setSelectedProposals(filteredProposals.map(p => p.id));
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

  const handleDownloadPDF = async (proposal: Proposal) => {
    setSelectedProposal(proposal);
    onPdfPreviewOpen();
  };

  const handleViewProposal = (id: string) => {
    navigate(`/proposals/${id}`);
  };

  const handleEditProposal = (id: string) => {
    navigate(`/proposals/${id}/edit`);
  };

  const handleCreateProposal = () => {
    navigate('/proposals/new');
  };

  const getFilteredProposalsByTab = () => {
    switch (activeTab) {
      case 0: // Alle
        return filterProposals();
      case 1: // Offen
        return filterProposals().filter(p => p.status === 'sent');
      case 2: // Akzeptiert
        return filterProposals().filter(p => p.status === 'accepted');
      case 3: // Abgelehnt
        return filterProposals().filter(p => p.status === 'rejected');
      default:
        return filterProposals();
    }
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Angebote</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={handleCreateProposal}
        >
          Neues Angebot
        </Button>
      </Flex>

      {/* Filter und Suche */}
      <Box mb={6}>
        <Tabs onChange={(index) => setActiveTab(index)} mb={4}>
          <TabList>
            <Tab>Alle</Tab>
            <Tab>Offen</Tab>
            <Tab>Akzeptiert</Tab>
            <Tab>Abgelehnt</Tab>
          </TabList>
        </Tabs>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <InputGroup maxW={{ base: 'full', md: '300px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Suchen..."
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
          </Select>

          <Select
            maxW={{ base: 'full', md: '200px' }}
            value={orderTypeFilter}
            onChange={(e) => setOrderTypeFilter(e.target.value as OrderType | 'all')}
          >
            <option value="all">Alle Bestelltypen</option>
            <option value="self_pickup">Selbstabholung</option>
            <option value="delivery">Lieferung</option>
            <option value="delivery_with_staff">Lieferung mit Personal</option>
            <option value="with_staff">Mit Personal vor Ort</option>
          </Select>

          <Popover>
            <PopoverTrigger>
              <Button leftIcon={<FiFilter />}>
                Datum
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>Datumsfilter</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Von</FormLabel>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Bis</FormLabel>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </FormControl>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Stack>
      </Box>

      {/* Angebotsliste */}
      <TableContainer bg={bgColor} borderRadius="md" boxShadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  isChecked={selectedProposals.length === filteredProposals.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('number')}>
                <HStack>
                  <Text>Nummer</Text>
                  {sortConfig.key === 'number' && (
                    <Icon as={sortConfig.direction === 'asc' ? FiArrowUp : FiArrowDown} />
                  )}
                </HStack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('eventDate')}>
                <HStack>
                  <Text>Datum</Text>
                  {sortConfig.key === 'eventDate' && (
                    <Icon as={sortConfig.direction === 'asc' ? FiArrowUp : FiArrowDown} />
                  )}
                </HStack>
              </Th>
              <Th>Kunde</Th>
              <Th>Veranstaltung</Th>
              <Th>Bestelltyp</Th>
              <Th cursor="pointer" onClick={() => handleSort('totalAmount')}>
                <HStack>
                  <Text>Betrag</Text>
                  {sortConfig.key === 'totalAmount' && (
                    <Icon as={sortConfig.direction === 'asc' ? FiArrowUp : FiArrowDown} />
                  )}
                </HStack>
              </Th>
              <Th>Status</Th>
              <Th>Aktionen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={9} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            ) : paginatedProposals.length === 0 ? (
              <Tr>
                <Td colSpan={9} textAlign="center">
                  <Text>Keine Angebote gefunden</Text>
                </Td>
              </Tr>
            ) : (
              paginatedProposals.map((proposal) => (
                <Tr key={proposal.id}>
                  <Td>
                    <Checkbox
                      isChecked={selectedProposals.includes(proposal.id)}
                      onChange={() => handleSelectProposal(proposal.id)}
                    />
                  </Td>
                  <Td>{proposal.number}</Td>
                  <Td>{format(new Date(proposal.eventDate), 'dd.MM.yyyy', { locale: de })}</Td>
                  <Td>{proposal.client.name}</Td>
                  <Td>{proposal.eventName}</Td>
                  <Td>
                    <OrderTypeIcon orderType={proposal.orderType} />
                  </Td>
                  <Td>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(proposal.totalAmount)}</Td>
                  <Td>
                    <ProposalStatusBadge status={proposal.status} />
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem icon={<FiEye />} onClick={() => handleViewProposal(proposal.id)}>
                          Anzeigen
                        </MenuItem>
                        <MenuItem icon={<FiEdit2 />} onClick={() => handleEditProposal(proposal.id)}>
                          Bearbeiten
                        </MenuItem>
                        <MenuItem icon={<FiDownload />} onClick={() => handleDownloadPDF(proposal)}>
                          PDF herunterladen
                        </MenuItem>
                        <MenuItem icon={<FiTrash2 />} onClick={() => handleDelete(proposal)}>
                          Löschen
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Löschbestätigung */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Angebot löschen</AlertDialogHeader>
            <AlertDialogBody>
              Sind Sie sicher, dass Sie dieses Angebot löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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

      {/* PDF-Vorschau */}
      {selectedProposal && (
        <ProposalPdfPreview
          isOpen={isPdfPreviewOpen}
          onClose={onPdfPreviewClose}
          proposal={selectedProposal}
        />
      )}
    </Box>
  );
};

export default ProposalsPage; 