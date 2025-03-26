import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Divider,
  Grid,
  GridItem,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService } from '../services/proposalService';
import { Proposal } from '../types';
import ProposalStatusBadge from '../components/proposals/ProposalStatusBadge';
import OrderTypeIcon from '../components/proposals/OrderTypeIcon';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const ProposalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (id) {
      loadProposal();
    }
  }, [id]);

  const loadProposal = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await proposalService.getProposal(id);
      setProposal(data);
    } catch (err) {
      setError('Fehler beim Laden des Angebots');
      console.error('Error loading proposal:', err);
      toast({
        title: 'Fehler',
        description: 'Das Angebot konnte nicht geladen werden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await proposalService.deleteProposal(id);
      toast({
        title: 'Erfolg',
        description: 'Das Angebot wurde erfolgreich gelöscht.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/proposals');
    } catch (err) {
      setError('Fehler beim Löschen des Angebots');
      console.error('Error deleting proposal:', err);
      toast({
        title: 'Fehler',
        description: 'Das Angebot konnte nicht gelöscht werden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleStatusChange = async (newStatus: Proposal['status']) => {
    if (!id) return;

    try {
      await proposalService.updateProposalStatus(id, newStatus);
      setProposal(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: 'Erfolg',
        description: 'Der Status wurde erfolgreich aktualisiert.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError('Fehler beim Aktualisieren des Status');
      console.error('Error updating proposal status:', err);
      toast({
        title: 'Fehler',
        description: 'Der Status konnte nicht aktualisiert werden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error || !proposal) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
          <AlertIcon boxSize="40px" mr={0} />
          <Text mt={4}>{error || 'Angebot nicht gefunden'}</Text>
        </Alert>
      </Box>
    );
  }

  const calculateTotalAmount = (items: Proposal['items']) => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Angebot #{proposal.number}</Heading>
          <HStack>
            <IconButton
              aria-label="Bearbeiten"
              icon={<EditIcon />}
              colorScheme="blue"
              variant="ghost"
              onClick={() => navigate(`/proposals/${id}/edit`)}
            />
            <IconButton
              aria-label="Löschen"
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              onClick={onOpen}
            />
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="green"
              onClick={() => id && proposalService.generatePdf(id)}
            >
              PDF herunterladen
            </Button>
          </HStack>
        </HStack>

        <Divider />

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" color="gray.600">Status</Text>
                <HStack mt={2}>
                  <ProposalStatusBadge status={proposal.status} />
                  <Select
                    size="sm"
                    value={proposal.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(e.target.value as Proposal['status'])}
                  >
                    <option value="draft">Entwurf</option>
                    <option value="sent">Gesendet</option>
                    <option value="accepted">Akzeptiert</option>
                    <option value="rejected">Abgelehnt</option>
                    <option value="expired">Abgelaufen</option>
                  </Select>
                </HStack>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.600">Kunde</Text>
                <Text mt={2}>{proposal.client.name}</Text>
                <Text color="gray.600">{proposal.client.email}</Text>
                <Text color="gray.600">{proposal.client.phone}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.600">Veranstaltung</Text>
                <Text mt={2}>{proposal.eventName}</Text>
                <Text color="gray.600">
                  {format(new Date(proposal.eventDate), 'dd.MM.yyyy', { locale: de })}
                </Text>
                <HStack mt={2}>
                  <OrderTypeIcon orderType={proposal.orderType} withLabel />
                </HStack>
              </Box>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" color="gray.600">Angebotspositionen</Text>
                <VStack align="start" mt={2} spacing={2}>
                  {proposal.items.map((item, index) => (
                    <Box key={index} w="100%" p={2} bg="gray.50" rounded="md">
                      <Text fontWeight="medium">{item.name}</Text>
                      <Text color="gray.600">{item.description}</Text>
                      <Text color="blue.500" fontWeight="bold">
                        {item.quantity} x {item.unitPrice.toFixed(2)} €
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Box w="100%">
                <HStack justify="space-between" mt={4}>
                  <Text fontWeight="bold">Gesamtbetrag:</Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.500">
                    {calculateTotalAmount(proposal.items).toFixed(2)} €
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Angebot löschen</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Möchten Sie dieses Angebot wirklich löschen?</Text>
            <HStack justify="flex-end" mt={4}>
              <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
              <Button colorScheme="red" onClick={handleDelete}>Löschen</Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProposalDetail; 