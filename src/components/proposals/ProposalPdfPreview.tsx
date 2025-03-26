import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Spinner,
  Center,
  Text
} from '@chakra-ui/react';
import { FaDownload, FaEye } from 'react-icons/fa';
import { generateProposalPdf } from '../../utils/pdfGenerator';
import { Proposal } from '../../types';

interface ProposalPdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
}

export const ProposalPdfPreview: React.FC<ProposalPdfPreviewProps> = ({
  isOpen,
  onClose,
  proposal
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      generatePdf();
    } else {
      // Aufräumen beim Schließen
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      setError(null);
      setIsLoading(true);
    }
  }, [isOpen, proposal]);

  const generatePdf = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const pdfBlob = await generateProposalPdf(proposal);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Fehler beim Generieren des PDFs:', err);
      setError('Das PDF konnte nicht generiert werden. Bitte versuchen Sie es später erneut.');
      toast({
        title: 'Fehler',
        description: 'Das PDF konnte nicht generiert werden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Angebot_${proposal.number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'PDF heruntergeladen',
      description: 'Das PDF wurde erfolgreich heruntergeladen.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          PDF Vorschau - Angebot {proposal.number}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          {isLoading ? (
            <Center py={10}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
            </Center>
          ) : error ? (
            <Center py={10}>
              <Text color="red.500">{error}</Text>
            </Center>
          ) : (
            <Box
              as="iframe"
              src={pdfUrl || ''}
              width="100%"
              height="70vh"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            leftIcon={<FaDownload />}
            colorScheme="brand"
            mr={3}
            onClick={handleDownload}
            isDisabled={!pdfUrl || isLoading}
          >
            Herunterladen
          </Button>
          <Button
            leftIcon={<FaEye />}
            variant="ghost"
            onClick={onClose}
          >
            Schließen
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 