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
  Badge,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { OfferForm } from './OfferForm';

interface Offer {
  id: string;
  offerNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  totalAmount: number;
  items: OfferItem[];
}

interface OfferItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export const OfferList: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>();
  const toast = useToast();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/offers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      } else {
        throw new Error('Fehler beim Laden der Angebote');
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Angebote konnten nicht geladen werden',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie dieses Angebot wirklich löschen?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3005/api/offers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setOffers(offers.filter(offer => offer.id !== id));
          toast({
            title: 'Erfolg',
            description: 'Angebot wurde gelöscht',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error('Fehler beim Löschen des Angebots');
        }
      } catch (error) {
        toast({
          title: 'Fehler',
          description: 'Angebot konnte nicht gelöscht werden',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSave = async (offer: Omit<Offer, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(offer),
      });

      if (response.ok) {
        const newOffer = await response.json();
        setOffers([...offers, newOffer]);
      } else {
        throw new Error('Fehler beim Erstellen des Angebots');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (id: string, offer: Omit<Offer, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(offer),
      });

      if (response.ok) {
        const updatedOffer = await response.json();
        setOffers(offers.map(o => o.id === id ? updatedOffer : o));
      } else {
        throw new Error('Fehler beim Aktualisieren des Angebots');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedOffer(undefined);
    setIsFormOpen(true);
  };

  const getStatusColor = (status: Offer['status']) => {
    switch (status) {
      case 'draft':
        return 'gray';
      case 'sent':
        return 'blue';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      case 'expired':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: Offer['status']) => {
    switch (status) {
      case 'draft':
        return 'Entwurf';
      case 'sent':
        return 'Gesendet';
      case 'accepted':
        return 'Akzeptiert';
      case 'rejected':
        return 'Abgelehnt';
      case 'expired':
        return 'Abgelaufen';
      default:
        return status;
    }
  };

  return (
    <Card w="100%" borderRadius="0">
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="lg">Angebotsverwaltung</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleAdd}
          >
            Neues Angebot
          </Button>
        </HStack>
      </CardHeader>
      <CardBody p={0}>
        <Box overflowX="auto" w="100%">
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>Angebotsnummer</Th>
                <Th>Kunde</Th>
                <Th>Datum</Th>
                <Th>Status</Th>
                <Th>Gesamtbetrag</Th>
                <Th>Aktionen</Th>
              </Tr>
            </Thead>
            <Tbody>
              {offers.map((offer) => (
                <Tr key={offer.id}>
                  <Td>{offer.offerNumber}</Td>
                  <Td>{offer.customerName}</Td>
                  <Td>{new Date(offer.date).toLocaleDateString()}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(offer.status)}>
                      {getStatusText(offer.status)}
                    </Badge>
                  </Td>
                  <Td>{offer.totalAmount.toFixed(2)} €</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Bearbeiten"
                        icon={<FiEdit2 />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEdit(offer)}
                      />
                      <IconButton
                        aria-label="Löschen"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(offer.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>

      <OfferForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={selectedOffer ? 
          (offer) => handleUpdate(selectedOffer.id, offer) : 
          handleSave}
        offer={selectedOffer}
      />
    </Card>
  );
}; 