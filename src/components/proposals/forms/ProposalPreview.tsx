import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useToast
} from '@chakra-ui/react';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ProposalFormData } from '../../../types';

interface ProposalPreviewProps {
  formData: ProposalFormData;
}

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ formData }) => {
  const toast = useToast();

  // Formatierung des Datums
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd. MMMM yyyy', { locale: de });
    } catch (error) {
      return dateString;
    }
  };

  // Formatierung der Uhrzeit
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5) + ' Uhr';
  };

  // PDF herunterladen
  const handleDownload = () => {
    // TODO: PDF-Export implementieren
    toast({
      title: 'PDF-Export',
      description: 'Diese Funktion wird in Kürze verfügbar sein.',
      status: 'info',
      duration: 3000,
    });
  };

  // Drucken
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box>
      {/* Aktionsleiste */}
      <HStack spacing={4} mb={8} className="no-print">
        <Button
          leftIcon={<FiDownload />}
          onClick={handleDownload}
          colorScheme="blue"
        >
          Als PDF herunterladen
        </Button>
        <Button
          leftIcon={<FiPrinter />}
          onClick={handlePrint}
        >
          Drucken
        </Button>
      </HStack>

      {/* Angebots-Vorschau */}
      <Box
        p={8}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
        className="proposal-preview"
      >
        {/* Kopfzeile */}
        <VStack align="stretch" spacing={8}>
          <HStack justify="space-between">
            <Box>
              <Text color="gray.500">ANGEBOT</Text>
              <Heading size="lg" mt={2}>{formData.title}</Heading>
            </Box>
            <Box textAlign="right">
              <Text color="gray.500">STATUS</Text>
              <Badge
                colorScheme={
                  formData.status === 'entwurf' ? 'gray' :
                  formData.status === 'gesendet' ? 'blue' :
                  formData.status === 'akzeptiert' ? 'green' :
                  'red'
                }
                fontSize="sm"
                mt={2}
              >
                {formData.status === 'entwurf' ? 'Entwurf' :
                 formData.status === 'gesendet' ? 'Gesendet' :
                 formData.status === 'akzeptiert' ? 'Akzeptiert' :
                 'Abgelehnt'}
              </Badge>
            </Box>
          </HStack>

          {/* Kundeninformationen */}
          <Box>
            <Text color="gray.500" mb={2}>KUNDE</Text>
            <Text fontWeight="bold">{formData.client?.name}</Text>
            {formData.client?.contactName && (
              <Text>{formData.client.contactName}</Text>
            )}
            {formData.client?.address && (
              <Text>{formData.client.address}</Text>
            )}
          </Box>

          {/* Veranstaltungsdetails */}
          <Box>
            <Text color="gray.500" mb={2}>VERANSTALTUNG</Text>
            <Text fontWeight="bold">{formData.eventName}</Text>
            <Text>Datum: {formatDate(formData.eventDate)}</Text>
            <Text>
              Zeit: {formatTime(formData.eventStartTime)} - {formatTime(formData.eventEndTime)}
            </Text>
            <Text>Ort: {formData.eventLocation}</Text>
            {formData.eventAddress && (
              <Text>Adresse: {formData.eventAddress}</Text>
            )}
            <Text>Anzahl Gäste: {formData.guests}</Text>
          </Box>

          {/* Einleitungstext */}
          {formData.introText && (
            <Box>
              <Text whiteSpace="pre-wrap">{formData.introText}</Text>
            </Box>
          )}

          {/* Positionen */}
          <Box>
            <Text color="gray.500" mb={4}>POSITIONEN</Text>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Position</Th>
                  <Th>Menge</Th>
                  <Th isNumeric>Einzelpreis</Th>
                  <Th isNumeric>Gesamtpreis</Th>
                </Tr>
              </Thead>
              <Tbody>
                {formData.items.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <Text fontWeight="medium">{item.name}</Text>
                      {item.description && (
                        <Text fontSize="sm" color="gray.600">
                          {item.description}
                        </Text>
                      )}
                    </Td>
                    <Td>{item.quantity} {item.unit}</Td>
                    <Td isNumeric>{item.unitPrice.toFixed(2)} €</Td>
                    <Td isNumeric>{item.totalPrice.toFixed(2)} €</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Zusammenfassung */}
          <Box>
            <Divider mb={4} />
            <HStack justify="flex-end" spacing={8}>
              <VStack align="flex-start" spacing={2}>
                <Text color="gray.600">Nettobetrag:</Text>
                <Text color="gray.600">Mehrwertsteuer ({formData.taxRate}%):</Text>
                <Text fontWeight="bold">Gesamtbetrag:</Text>
                {formData.depositAmount > 0 && (
                  <Text color="gray.600">Anzahlung:</Text>
                )}
              </VStack>
              <VStack align="flex-end" spacing={2}>
                <Text>{formData.subtotal.toFixed(2)} €</Text>
                <Text>{formData.taxAmount.toFixed(2)} €</Text>
                <Text fontWeight="bold">{formData.total.toFixed(2)} €</Text>
                {formData.depositAmount > 0 && (
                  <Text>{formData.depositAmount.toFixed(2)} €</Text>
                )}
              </VStack>
            </HStack>
          </Box>

          {/* Zahlungsbedingungen */}
          <Box>
            <Text color="gray.500" mb={2}>ZAHLUNGSBEDINGUNGEN</Text>
            <Text>{formData.paymentTerms}</Text>
            {formData.depositAmount > 0 && (
              <Text mt={2}>
                Anzahlung in Höhe von {formData.depositAmount.toFixed(2)} € 
                bis zum {formatDate(formData.depositDueDate)}
              </Text>
            )}
          </Box>

          {/* Gültigkeit */}
          <Box>
            <Text color="gray.500" mb={2}>GÜLTIGKEIT</Text>
            <Text>
              Dieses Angebot ist gültig bis zum {formatDate(formData.validUntil)}
            </Text>
          </Box>

          {/* AGB */}
          <Box>
            <Text color="gray.500" mb={2}>ALLGEMEINE GESCHÄFTSBEDINGUNGEN</Text>
            <Text whiteSpace="pre-wrap" fontSize="sm">
              {formData.termsAndConditions}
            </Text>
          </Box>
        </VStack>
      </Box>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .proposal-preview {
            border: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default ProposalPreview; 