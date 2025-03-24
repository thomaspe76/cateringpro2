import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { ClientFormData, ClientType } from '../../types';
import clientService from '../../services/clientService';

interface ClientQuickFormProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (clientId: string) => void;
}

const ClientQuickForm: React.FC<ClientQuickFormProps> = ({
  isOpen,
  onClose,
  onClientCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<ClientFormData>({
    defaultValues: {
      type: 'private',
      country: 'Deutschland',
      billingAddressSameAsMain: true,
      whatsappAvailable: false,
      signalAvailable: false,
      newsletter: false,
      marketingConsent: false,
    },
  });

  const clientType = watch('type');

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      const result = await clientService.createClient(data);
      if (result.success && result.data) {
        toast({
          title: 'Kunde erstellt',
          description: 'Der Kunde wurde erfolgreich angelegt.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClientCreated(result.data.id);
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Der Kunde konnte nicht erstellt werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPrivateFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isInvalid={!!errors.salutation}>
        <FormLabel>Anrede</FormLabel>
        <Controller
          name="salutation"
          control={control}
          rules={{ required: 'Anrede ist erforderlich' }}
          render={({ field }) => (
            <RadioGroup {...field}>
              <Stack direction="row">
                <Radio value="Herr">Herr</Radio>
                <Radio value="Frau">Frau</Radio>
                <Radio value="Divers">Divers</Radio>
              </Stack>
            </RadioGroup>
          )}
        />
        <FormErrorMessage>{errors.salutation?.message}</FormErrorMessage>
      </FormControl>

      <HStack spacing={4}>
        <FormControl isInvalid={!!errors.firstName}>
          <FormLabel>Vorname</FormLabel>
          <Input {...register('firstName', { required: 'Vorname ist erforderlich' })} />
          <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.lastName}>
          <FormLabel>Nachname</FormLabel>
          <Input {...register('lastName', { required: 'Nachname ist erforderlich' })} />
          <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
        </FormControl>
      </HStack>
    </VStack>
  );

  const renderBusinessFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isInvalid={!!errors.companyName}>
        <FormLabel>Firmenname</FormLabel>
        <Input {...register('companyName', { required: 'Firmenname ist erforderlich' })} />
        <FormErrorMessage>{errors.companyName?.message}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Branche</FormLabel>
        <Input {...register('industry')} />
      </FormControl>

      <HStack spacing={4}>
        <FormControl isInvalid={!!errors.primaryContactFirstName}>
          <FormLabel>Vorname Ansprechpartner</FormLabel>
          <Input {...register('primaryContactFirstName', { required: 'Vorname des Ansprechpartners ist erforderlich' })} />
          <FormErrorMessage>{errors.primaryContactFirstName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.primaryContactLastName}>
          <FormLabel>Nachname Ansprechpartner</FormLabel>
          <Input {...register('primaryContactLastName', { required: 'Nachname des Ansprechpartners ist erforderlich' })} />
          <FormErrorMessage>{errors.primaryContactLastName?.message}</FormErrorMessage>
        </FormControl>
      </HStack>
    </VStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Neuen Kunden anlegen</ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.type}>
                <FormLabel>Kundentyp</FormLabel>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Kundentyp ist erforderlich' }}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction="row">
                        <Radio value="private">Privatkunde</Radio>
                        <Radio value="business">Firmenkunde</Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
                <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
              </FormControl>

              {clientType === 'private' ? renderPrivateFields() : renderBusinessFields()}

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>E-Mail</FormLabel>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'E-Mail ist erforderlich',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Ungültige E-Mail-Adresse',
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Telefon</FormLabel>
                <Input {...register('phone', { required: 'Telefon ist erforderlich' })} />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.street}>
                <FormLabel>Straße und Hausnummer</FormLabel>
                <Input {...register('street', { required: 'Straße ist erforderlich' })} />
                <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4}>
                <FormControl isInvalid={!!errors.postalCode}>
                  <FormLabel>PLZ</FormLabel>
                  <Input {...register('postalCode', { required: 'PLZ ist erforderlich' })} />
                  <FormErrorMessage>{errors.postalCode?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.city}>
                  <FormLabel>Stadt</FormLabel>
                  <Input {...register('city', { required: 'Stadt ist erforderlich' })} />
                  <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.preferredContactMethod}>
                <FormLabel>Bevorzugte Kontaktmethode</FormLabel>
                <Select {...register('preferredContactMethod', { required: 'Kontaktmethode ist erforderlich' })}>
                  <option value="email">E-Mail</option>
                  <option value="phone">Telefon</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="signal">Signal</option>
                </Select>
                <FormErrorMessage>{errors.preferredContactMethod?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Abbrechen
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={isSubmitting}
              loadingText="Speichern..."
            >
              Speichern
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ClientQuickForm; 