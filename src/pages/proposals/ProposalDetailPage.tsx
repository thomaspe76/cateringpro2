import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  VStack,
  HStack,
  Grid,
  GridItem,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  CardHeader,
  Image,
  Link,
  Tooltip,
  useClipboard,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  FiEdit2,
  FiMail,
  FiCheckSquare,
  FiDownload,
  FiExternalLink,
  FiCopy,
  FiTrash2,
  FiFileText,
  FiTag,
  FiPaperclip,
  FiDollarSign,
  FiUsers,
  FiTruck,
  FiBox,
  FiShoppingCart,
  FiClock,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiMoreVertical,
} from 'react-icons/fi';
import { Proposal, OrderType, ProposalStatus } from '../../types/proposal';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { mockProposals } from '../../mock/proposals';

const ProposalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const foundProposal = mockProposals.find(p => p.id === id);
    if (foundProposal) {
      setProposal(foundProposal);
    } else {
      toast({
        title: 'Fehler',
        description: 'Angebot nicht gefunden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/proposals');
    }
  }, [id, navigate, toast]);

  if (!proposal) {
    return null;
  }

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

  const OrderTypeIcon = getOrderTypeIcon(proposal.orderType);

  const handleDelete = () => {
    // Hier würde die API-Aufruf erfolgen
    toast({
      title: 'Angebot gelöscht',
      description: 'Das Angebot wurde erfolgreich gelöscht.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/proposals');
  };

  const handleSendEmail = () => {
    // Hier würde die E-Mail-Versand-Logik implementiert
    toast({
      title: 'E-Mail gesendet',
      description: 'Das Angebot wurde per E-Mail versendet.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleMarkAsAccepted = () => {
    // Hier würde die Status-Update-Logik implementiert
    toast({
      title: 'Status aktualisiert',
      description: 'Das Angebot wurde als akzeptiert markiert.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDownloadPDF = () => {
    // Hier würde die PDF-Generierung implementiert
    toast({
      title: 'PDF heruntergeladen',
      description: 'Das Angebot wurde als PDF heruntergeladen.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyLink = () => {
    // Hier würde die Link-Generierung implementiert
    onCopy();
    toast({
      title: 'Link kopiert',
      description: 'Der Link zur Kundenansicht wurde in die Zwischenablage kopiert.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={6}>
      {/* Header */}
      <Flex mb={6} align="center" justify="space-between" flexWrap="wrap" gap={4}>
        <Box>
          <Heading size="lg">{proposal.eventName}</Heading>
          <Text color="gray.500">Angebot {proposal.number}</Text>
        </Box>
        <HStack spacing={2}>
          <Badge colorScheme={getStatusColor(proposal.status)} fontSize="md" px={3} py={1}>
            {proposal.status}
          </Badge>
          <Tooltip label={proposal.orderType}>
            <Box>
              <OrderTypeIcon size={24} />
            </Box>
          </Tooltip>
        </HStack>
      </Flex>

      {/* Aktionsleiste */}
      <Flex mb={6} gap={2} flexWrap="wrap">
        <Button leftIcon={<FiEdit2 />} onClick={() => navigate(`/proposals/${id}/edit`)}>
          Bearbeiten
        </Button>
        <Button leftIcon={<FiMail />} onClick={handleSendEmail}>
          Per E-Mail senden
        </Button>
        <Button leftIcon={<FiCheckSquare />} onClick={handleMarkAsAccepted}>
          Als akzeptiert markieren
        </Button>
        <Button leftIcon={<FiDownload />} onClick={handleDownloadPDF}>
          PDF herunterladen
        </Button>
        <Button leftIcon={<FiExternalLink />} onClick={() => window.open(`/proposals/${id}/client`, '_blank')}>
          Kundenansicht öffnen
        </Button>
        <Button leftIcon={<FiCopy />} onClick={handleCopyLink}>
          Link kopieren
        </Button>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Weitere Optionen"
            icon={<FiMoreVertical />}
            variant="ghost"
          />
          <MenuList>
            <MenuItem icon={<FiDollarSign />}>Anzahlung als erhalten markieren</MenuItem>
            <MenuItem icon={<FiFileText />}>Duplizieren</MenuItem>
            <MenuItem icon={<FiTag />}>Tag hinzufügen</MenuItem>
            <MenuItem icon={<FiPaperclip />}>Dokument anhängen</MenuItem>
            <MenuItem icon={<FiFileText />}>Zur Rechnung konvertieren</MenuItem>
            <MenuItem icon={<FiTrash2 />} color="red.500" onClick={onOpen}>
              Löschen
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Hauptinhalt */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <GridItem>
          <Tabs onChange={(index) => setSelectedTab(index)}>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Positionen</Tab>
              <Tab>Dokumente</Tab>
              <Tab>Aktivität</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Kundendaten */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">Kundendaten</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <FiUser />
                          <Text>{proposal.clientInfo.name}</Text>
                        </HStack>
                        <HStack>
                          <FiMapPin />
                          <Text>{proposal.clientInfo.address}</Text>
                        </HStack>
                        <HStack>
                          <FiPhone />
                          <Text>{proposal.clientInfo.phone}</Text>
                        </HStack>
                        <HStack>
                          <FiGlobe />
                          <Text>{proposal.clientInfo.email}</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Veranstaltungsdetails */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">Veranstaltungsdetails</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <FiCalendar />
                          <Text>Veranstaltung: {proposal.eventName}</Text>
                        </HStack>
                        <HStack>
                          <FiClock />
                          <Text>Bestelltyp: {proposal.orderType}</Text>
                        </HStack>
                        <Text>{proposal.introText}</Text>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Angebotspositionen */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">Angebotspositionen</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        {proposal.items.map((item) => (
                          <Box key={item.id} p={4} borderWidth="1px" borderRadius="md">
                            <Text fontWeight="bold">{item.name}</Text>
                            <Text color="gray.600">{item.description}</Text>
                            <HStack mt={2}>
                              <Text>{item.quantity} {item.unit}</Text>
                              <Text>x</Text>
                              <Text>{item.price.toFixed(2)} €</Text>
                              <Text>=</Text>
                              <Text fontWeight="bold">{item.total.toFixed(2)} €</Text>
                            </HStack>
                            {item.subItems && (
                              <VStack align="stretch" mt={2} pl={4}>
                                {item.subItems.map((subItem) => (
                                  <HStack key={subItem.id} justify="space-between">
                                    <Text>{subItem.name}</Text>
                                    <Text>{subItem.quantity} x {subItem.price.toFixed(2)} €</Text>
                                  </HStack>
                                ))}
                              </VStack>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              <TabPanel>
                {/* Hier würde die detaillierte Positionsansicht implementiert */}
                <Text>Positionsansicht wird implementiert...</Text>
              </TabPanel>

              <TabPanel>
                {/* Hier würde die Dokumentenverwaltung implementiert */}
                <Text>Dokumentenverwaltung wird implementiert...</Text>
              </TabPanel>

              <TabPanel>
                {/* Hier würde das Aktivitätsprotokoll implementiert */}
                <Text>Aktivitätsprotokoll wird implementiert...</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>

        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Wichtige Daten */}
            <Card>
              <CardHeader>
                <Heading size="md">Wichtige Daten</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text>Erstellt am:</Text>
                    <Text>{format(new Date(proposal.createdAt), 'dd.MM.yyyy', { locale: de })}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Gültig bis:</Text>
                    <Text>{format(new Date(proposal.expiryDate), 'dd.MM.yyyy', { locale: de })}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Status:</Text>
                    <Badge colorScheme={getStatusColor(proposal.status)}>
                      {proposal.status}
                    </Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Finanzdaten */}
            <Card>
              <CardHeader>
                <Heading size="md">Finanzdaten</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text>Zwischensumme:</Text>
                    <Text>{proposal.subtotal.toFixed(2)} €</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>MwSt. ({proposal.taxRate}%):</Text>
                    <Text>{proposal.taxAmount.toFixed(2)} €</Text>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between" fontWeight="bold">
                    <Text>Gesamtbetrag:</Text>
                    <Text>{proposal.totalAmount.toFixed(2)} €</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Zahlungsinformationen */}
            <Card>
              <CardHeader>
                <Heading size="md">Zahlungsinformationen</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text>{proposal.paymentTerms}</Text>
                  <Text>{proposal.termsAndConditions}</Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>

      {/* Lösch-Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Angebot löschen</AlertDialogHeader>
            <AlertDialogBody>
              Sind Sie sicher, dass Sie das Angebot "{proposal.number}" löschen möchten?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Abbrechen
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Löschen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProposalDetailPage; 