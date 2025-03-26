import React from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from '@chakra-ui/react';
import { ProposalFormData } from '../../../types';

interface EventDetailsProps {
  formData: ProposalFormData;
  onChange: (field: keyof ProposalFormData, value: any) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ formData, onChange }) => {
  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Titel</FormLabel>
        <Input
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="z.B. Firmenfeier 2024"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Veranstaltungsname</FormLabel>
        <Input
          value={formData.eventName}
          onChange={(e) => onChange('eventName', e.target.value)}
          placeholder="z.B. Sommerfest"
        />
      </FormControl>

      <HStack spacing={4}>
        <FormControl>
          <FormLabel>Datum</FormLabel>
          <Input
            type="date"
            value={formData.eventDate}
            onChange={(e) => onChange('eventDate', e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Uhrzeit von</FormLabel>
          <Input
            type="time"
            value={formData.eventStartTime}
            onChange={(e) => onChange('eventStartTime', e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Uhrzeit bis</FormLabel>
          <Input
            type="time"
            value={formData.eventEndTime}
            onChange={(e) => onChange('eventEndTime', e.target.value)}
          />
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>Veranstaltungsort</FormLabel>
        <Input
          value={formData.eventLocation}
          onChange={(e) => onChange('eventLocation', e.target.value)}
          placeholder="z.B. Firmengelände"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Adresse</FormLabel>
        <Input
          value={formData.eventAddress}
          onChange={(e) => onChange('eventAddress', e.target.value)}
          placeholder="Vollständige Adresse"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Veranstaltungsart</FormLabel>
        <Input
          value={formData.eventType}
          onChange={(e) => onChange('eventType', e.target.value)}
          placeholder="z.B. Firmenfeier, Hochzeit, etc."
        />
      </FormControl>

      <FormControl>
        <FormLabel>Auftragsart</FormLabel>
        <Select
          value={formData.orderType}
          onChange={(e) => onChange('orderType', e.target.value)}
        >
          <option value="self_pickup">Selbstabholung</option>
          <option value="delivery">Lieferung</option>
          <option value="delivery_with_staff">Lieferung mit Service</option>
          <option value="with_staff">Mit Service</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Anzahl Gäste</FormLabel>
        <NumberInput
          min={1}
          value={formData.guests}
          onChange={(value) => onChange('guests', parseInt(value))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Einleitungstext</FormLabel>
        <Textarea
          value={formData.introText}
          onChange={(e) => onChange('introText', e.target.value)}
          placeholder="Einleitungstext für das Angebot"
          rows={4}
        />
      </FormControl>
    </VStack>
  );
};

export default EventDetails; 