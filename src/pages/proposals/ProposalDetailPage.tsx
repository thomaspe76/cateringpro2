import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Divider,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
  useToast,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiEdit,
  FiSend,
  FiDownload,
  FiEye,
  FiLink,
  FiMoreVertical,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiTag,
  FiPaperclip,
  FiTrash2,
  FiCopy
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { Proposal } from '../../types/proposal';
import { mockProposals } from '../../mock/proposals';
import SendEmailModal from '../../components/proposals/SendEmailModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ProposalStatusBadge from '../../components/proposals/ProposalStatusBadge';
import OrderTypeIcon from '../../components/proposals/OrderTypeIcon';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProposalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    isOpen: isEmailModalOpen,
    onOpen: openEmailModal,
    onClose: closeEmailModal
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal
  } = useDisclosure();

  // Daten beim ersten Render laden
  useEffect(() => {
    if (!id) return;

    const fetchProposal = async () => {
      setIsLoading(true);
      try {
        // Temporär: Verwende Mock-Daten
        const foundProposal = mockProposals.find(p => p.id === id);
        if (foundProposal) {
          setProposal(foundProposal);
          setError(null);
        } else {
          setError('Angebot konnte nicht gefunden werden');
        }
      } catch (err) {
        setError('Fehler beim Laden des Angebots');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  // Handler für Aktionen
  const handleEdit = () => {
    navigate(`/proposals/edit/${id}`);
  };

  const handleDuplicate = async () => {
    if (!proposal) return;

    try {
      // Temporär: Einfache Erfolgsmeldung
      toast({
        title: 'Angebot dupliziert',
        description: 'Das Angebot wurde erfolgreich dupliziert.',
        status: 'success',
        duration: 3000,
      });
      navigate(`/proposals/${proposal.id}-copy`);
    } catch (err) {
      toast({
        title: 'Fehler',
        description: 'Das Angebot konnte nicht dupliziert werden.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (!proposal) return;

    try {
      // Temporär: Direkte Navigation zurück
      toast({
        title: 'Angebot gelöscht',
        description: 'Das Angebot wurde erfolgreich gelöscht.',
        status: 'success',
        duration: 3000,
      });
      navigate('/proposals');
    } catch (err) {
      toast({
        title: 'Fehler',
        description: 'Das Angebot konnte nicht gelöscht werden.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      closeDeleteModal();
    }
  };

  const handleDownloadPdf = async () => {
    if (!proposal) return;

    try {
      // Temporär: Erfolgsmeldung
      toast({
        title: 'PDF erstellt',
        description: 'Das PDF wurde erfolgreich erstellt und heruntergeladen.',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Fehler',
        description: 'Das PDF konnte nicht erstellt werden.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleCopyClientLink = () => {
    if (!proposal) return;

    const clientLink = `${window.location.origin}/proposals/client-view/${proposal.id}`;
    navigator.clipboard.writeText(clientLink);

    toast({
      title: 'Link kopiert',
      description: 'Der Link zur Kundenansicht wurde in die Zwischenablage kopiert.',
      status: 'success',
      duration: 3000,
    });
  };

  const handleViewAsClient = () => {
    if (!proposal) return;
    window.open(`/proposals/client-view/${proposal.id}`, '_blank');
  };

  // Render-Funktion für den Inhalt
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !proposal) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="md" mb={4} color="red.500">
          {error || 'Angebot nicht gefunden'}
        </Heading>
        <Button onClick={() => navigate('/proposals')}>
          Zurück zur Übersicht
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6}>
      {/* Header-Bereich */}
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        mb={6}
        gap={4}
      >
        <Box>
          <HStack mb={2}>
            <ProposalStatusBadge status={proposal.status} />
            <OrderTypeIcon orderType={proposal.orderType} withLabel />
          </HStack>
          <Heading size="lg">{proposal.eventName || `Angebot ${proposal.number}`}</Heading>
          <Text color="gray.600" mt={1}>
            Angebots-Nr.: {proposal.number} | Erstellt am: {new Date(proposal.createdAt).toLocaleDateString('de-DE')}
          </Text>
        </Box>

        <HStack spacing={2} wrap="wrap">
          <Button leftIcon={<FiEdit />} onClick={handleEdit}>
            Bearbeiten
          </Button>
          <Button leftIcon={<FiSend />} colorScheme="blue" onClick={openEmailModal}>
            Senden
          </Button>
          <Menu>
            <MenuButton as={Button} rightIcon={<FiMoreVertical />}>
              Aktionen
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiDownload />} onClick={handleDownloadPdf}>
                PDF herunterladen
              </MenuItem>
              <MenuItem icon={<FiEye />} onClick={handleViewAsClient}>
                Kundenansicht öffnen
              </MenuItem>
              <MenuItem icon={<FiLink />} onClick={handleCopyClientLink}>
                Link für Kunden kopieren
              </MenuItem>
              <MenuItem icon={<FiCopy />} onClick={handleDuplicate}>
                Duplizieren
              </MenuItem>
              <MenuItem icon={<FiTrash2 />} onClick={openDeleteModal} color="red.500">
                Löschen
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Hauptinhalt */}
      <Tabs colorScheme="blue" variant="enclosed">
        <TabList>
          <Tab>Übersicht</Tab>
          <Tab>Positionen</Tab>
          <Tab>Dokumente</Tab>
          <Tab>Aktivitäten</Tab>
        </TabList>

        <TabPanels>
          {/* Übersicht-Tab */}
          <TabPanel>
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
              {/* Linke Spalte */}
              <Box>
                {/* Kundeninformationen */}
                <Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={6}>
                  <Heading size="md" mb={4}>Kundeninformationen</Heading>
                  <VStack align="flex-start" spacing={2}>
                    <Text fontWeight="bold">{proposal.clientId}</Text>
                    <Text>{proposal.eventName}</Text>
                  </VStack>
                </Box>

                {/* Veranstaltungsinformationen */}
                <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
                  <Heading size="md" mb={4}>Veranstaltungsinformationen</Heading>
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <VStack align="flex-start" spacing={3}>
                      <HStack>
                        <Icon as={FiCalendar} color="blue.500" />
                        <Text fontWeight="medium">Datum:</Text>
                        <Text>{new Date(proposal.eventDate).toLocaleDateString('de-DE')}</Text>
                      </HStack>

                      <HStack>
                        <Icon as={FiUsers} color="blue.500" />
                        <Text fontWeight="medium">Format:</Text>
                        <Text>{proposal.eventFormat}</Text>
                      </HStack>
                    </VStack>
                  </Grid>

                  {proposal.introText && (
                    <Box mt={4}>
                      <Text fontWeight="medium">Beschreibung:</Text>
                      <Text mt={2}>{proposal.introText}</Text>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Rechte Spalte */}
              <Box>
                {/* Finanzdaten */}
                <Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={6}>
                  <Heading size="md" mb={4}>Finanzdaten</Heading>
                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between">
                      <Text>Zwischensumme:</Text>
                      <Text>{proposal.subtotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>MwSt. ({proposal.taxRate}%):</Text>
                      <Text>{proposal.taxAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between" fontWeight="bold">
                      <Text>Gesamtbetrag:</Text>
                      <Text>{proposal.totalAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Text>
                    </Flex>
                  </VStack>
                </Box>

                {/* Status */}
                <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
                  <Heading size="md" mb={4}>Status</Heading>
                  <VStack align="flex-start" spacing={4}>
                    <HStack>
                      <Text fontWeight="medium">Aktueller Status:</Text>
                      <ProposalStatusBadge status={proposal.status} />
                    </HStack>

                    <HStack>
                      <Text fontWeight="medium">Bestelltyp:</Text>
                      <OrderTypeIcon orderType={proposal.orderType} withLabel />
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            </Grid>
          </TabPanel>

          {/* Positionen-Tab */}
          <TabPanel>
            <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
              <Heading size="md" mb={6}>Angebotspositionen</Heading>
              {proposal.items.length === 0 ? (
                <Text color="gray.500">Keine Positionen gefunden</Text>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Position</Th>
                      <Th isNumeric>Menge</Th>
                      <Th isNumeric>Einzelpreis</Th>
                      <Th isNumeric>Gesamtpreis</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {proposal.items.map(item => (
                      <Tr key={item.id}>
                        <Td>
                          <VStack align="flex-start" spacing={1}>
                            <Text fontWeight="medium">{item.name}</Text>
                            {item.description && (
                              <Text fontSize="sm" color="gray.600">{item.description}</Text>
                            )}
                          </VStack>
                        </Td>
                        <Td isNumeric>{item.quantity} {item.unit}</Td>
                        <Td isNumeric>{item.unitPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Td>
                        <Td isNumeric>{(item.quantity * item.unitPrice).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </TabPanel>

          {/* Dokumente-Tab */}
          <TabPanel>
            <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Dokumente</Heading>
                <Button leftIcon={<FiPaperclip />} size="sm">
                  Dokument hinzufügen
                </Button>
              </Flex>
              <Text color="gray.500">Keine Dokumente angehängt</Text>
            </Box>
          </TabPanel>

          {/* Aktivitäten-Tab */}
          <TabPanel>
            <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
              <Heading size="md" mb={4}>Aktivitäten</Heading>
              {proposal.history && proposal.history.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {proposal.history.map(activity => (
                    <Box
                      key={activity.id}
                      p={3}
                      borderLeftWidth="3px"
                      borderLeftColor="blue.500"
                      bg="gray.50"
                      borderRadius="md"
                    >
                      <Flex justify="space-between" mb={1}>
                        <Text fontWeight="medium">{activity.action}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(activity.date).toLocaleString('de-DE')}
                        </Text>
                      </Flex>
                      <Text>{activity.details}</Text>
                      <Text fontSize="sm" mt={1}>
                        Von: {activity.user}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">Keine Aktivitäten aufgezeichnet</Text>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modals */}
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        proposalId={proposal.id}
        clientEmail={proposal.clientId}
        clientName={proposal.clientId}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Angebot löschen"
        message="Sind Sie sicher, dass Sie dieses Angebot löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmText="Löschen"
        confirmColorScheme="red"
      />
    </Box>
  );
};

export default ProposalDetailPage; 