import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { proposalService } from '../services/proposalService';
import { Proposal } from '../types';
import ProposalList from '../components/proposals/ProposalList';

const ProposalsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const data = await proposalService.getProposals();
      setProposals(data);
    } catch (err) {
      console.error('Error loading proposals:', err);
      toast({
        title: 'Fehler',
        description: 'Angebote konnten nicht geladen werden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/proposals/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/proposals/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setSelectedProposalId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedProposalId) return;

    try {
      await proposalService.deleteProposal(selectedProposalId);
      toast({
        title: 'Erfolg',
        description: 'Das Angebot wurde erfolgreich gelöscht.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      loadProposals();
      onClose();
    } catch (err) {
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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => navigate('/proposals/new')}
          >
            Neues Angebot
          </Button>
        </HStack>

        <ProposalList
          proposals={proposals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Angebot löschen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Möchten Sie dieses Angebot wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Abbrechen
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Löschen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProposalsPage; 