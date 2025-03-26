import React from 'react';
import {
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Checkbox,
  Text,
  Box
} from '@chakra-ui/react';
import { ProposalFormData } from '../../../types';

interface PaymentTermsProps {
  formData: ProposalFormData;
  onChange: (field: string, value: any) => void;
}

const PaymentTerms: React.FC<PaymentTermsProps> = ({ formData, onChange }) => {
  // Mindestdatum für Gültigkeitsdauer (heute)
  const minDate = new Date().toISOString().split('T')[0];

  // Anzahlung aktivieren/deaktivieren
  const handleDepositToggle = (isChecked: boolean) => {
    if (!isChecked) {
      onChange('depositAmount', 0);
      onChange('depositDueDate', '');
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Gültigkeitsdauer und Mehrwertsteuer */}
      <SimpleGrid columns={2} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Gültig bis</FormLabel>
          <Input
            type="date"
            value={formData.validUntil}
            onChange={(e) => onChange('validUntil', e.target.value)}
            min={minDate}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mehrwertsteuer (%)</FormLabel>
          <NumberInput
            value={formData.taxRate}
            onChange={(value) => onChange('taxRate', parseFloat(value))}
            min={0}
            max={100}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </SimpleGrid>

      {/* Anzahlung */}
      <Box>
        <Checkbox
          isChecked={formData.depositAmount > 0}
          onChange={(e) => handleDepositToggle(e.target.checked)}
          mb={2}
        >
          Anzahlung erforderlich
        </Checkbox>

        {formData.depositAmount > 0 && (
          <SimpleGrid columns={2} spacing={4} mt={4}>
            <FormControl isRequired>
              <FormLabel>Anzahlungsbetrag (€)</FormLabel>
              <NumberInput
                value={formData.depositAmount}
                onChange={(value) => onChange('depositAmount', parseFloat(value))}
                min={0}
                max={formData.total}
                precision={2}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Fällig bis</FormLabel>
              <Input
                type="date"
                value={formData.depositDueDate}
                onChange={(e) => onChange('depositDueDate', e.target.value)}
                min={minDate}
              />
            </FormControl>
          </SimpleGrid>
        )}
      </Box>

      {/* Zahlungsbedingungen */}
      <FormControl isRequired>
        <FormLabel>Zahlungsbedingungen</FormLabel>
        <Textarea
          value={formData.paymentTerms}
          onChange={(e) => onChange('paymentTerms', e.target.value)}
          placeholder="z.B. Zahlbar innerhalb von 14 Tagen nach Rechnungserhalt"
          rows={3}
        />
      </FormControl>

      {/* AGB */}
      <FormControl isRequired>
        <FormLabel>Allgemeine Geschäftsbedingungen</FormLabel>
        <Textarea
          value={formData.termsAndConditions}
          onChange={(e) => onChange('termsAndConditions', e.target.value)}
          placeholder="Ihre allgemeinen Geschäftsbedingungen..."
          rows={6}
        />
      </FormControl>

      {/* Zusammenfassung */}
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text fontWeight="bold" mb={2}>Zusammenfassung</Text>
        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text color="gray.600">Nettobetrag:</Text>
            <Text fontWeight="medium">{formData.subtotal.toFixed(2)} €</Text>
          </Box>
          <Box>
            <Text color="gray.600">Mehrwertsteuer ({formData.taxRate}%):</Text>
            <Text fontWeight="medium">{formData.taxAmount.toFixed(2)} €</Text>
          </Box>
          <Box>
            <Text color="gray.600">Gesamtbetrag:</Text>
            <Text fontWeight="bold">{formData.total.toFixed(2)} €</Text>
          </Box>
          {formData.depositAmount > 0 && (
            <Box>
              <Text color="gray.600">Anzahlung:</Text>
              <Text fontWeight="medium">{formData.depositAmount.toFixed(2)} €</Text>
            </Box>
          )}
        </SimpleGrid>
      </Box>
    </VStack>
  );
};

export default PaymentTerms; 