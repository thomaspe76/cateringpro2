import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  VStack,
  HStack,
  useToast,
  Heading,
  Divider,
  Switch,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientFormData, ClientType, Salutation, CompanySize, PreferredContactMethod, PaymentMethod, Client } from '../types';
import clientService from '../services/clientService';

const ClientFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientType, setClientType] = useState<ClientType>('private');
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ClientFormData>({
    defaultValues: {
      billingAddressSameAsMain: true
    }
  });

  // Watch billingAddressSameAsMain für die bedingte Anzeige der Rechnungsadressfelder
  const billingAddressSameAsMain = watch('billingAddressSameAsMain');

  useEffect(() => {
    if (isEditMode && id) {
      loadClient(id);
    }
  }, [id, isEditMode]);

  const loadClient = async (clientId: string) => {
    try {
      const client = await clientService.getClient(clientId);
      if (client) {
        setClientType(client.type);
        // Teile den primaryContact in Vor- und Nachname auf
        let primaryContactFirstName = '';
        let primaryContactLastName = '';
        if (client.primaryContact) {
          const [firstName = '', lastName = ''] = client.primaryContact.split(' ');
          primaryContactFirstName = firstName;
          primaryContactLastName = lastName;
        }
        reset({
          ...client,
          primaryContactFirstName,
          primaryContactLastName,
          // Konvertiere Arrays zurück zu Strings für die Formulareingabe
          dietaryPreferences: client.dietaryPreferences?.join(', '),
          allergies: client.allergies?.join(', '),
        });
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kunde konnte nicht geladen werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/clients');
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);
      const result = isEditMode
        ? await clientService.updateClient(id!, data)
        : await clientService.createClient(data);

      if (result.success) {
        toast({
          title: isEditMode ? 'Kunde aktualisiert' : 'Kunde erstellt',
          description: isEditMode
            ? 'Der Kunde wurde erfolgreich aktualisiert.'
            : 'Der Kunde wurde erfolgreich erstellt.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/clients');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: isEditMode
          ? 'Der Kunde konnte nicht aktualisiert werden.'
          : 'Der Kunde konnte nicht erstellt werden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPrivateFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>Anrede</FormLabel>
        <Select {...register('salutation', { required: 'Anrede ist erforderlich' })}>
          <option value="Herr">Herr</option>
          <option value="Frau">Frau</option>
          <option value="Divers">Divers</option>
        </Select>
        <FormErrorMessage>
          {errors.salutation && errors.salutation.message}
        </FormErrorMessage>
      </FormControl>

      <HStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Vorname</FormLabel>
          <Input {...register('firstName', { required: 'Vorname ist erforderlich' })} />
          <FormErrorMessage>
            {errors.firstName && errors.firstName.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Nachname</FormLabel>
          <Input {...register('lastName', { required: 'Nachname ist erforderlich' })} />
          <FormErrorMessage>
            {errors.lastName && errors.lastName.message}
          </FormErrorMessage>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>Geburtsdatum</FormLabel>
        <Input type="date" {...register('birthDate')} />
      </FormControl>
    </VStack>
  );

  const renderBusinessFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>Firmenname</FormLabel>
        <Input {...register('companyName', { required: 'Firmenname ist erforderlich' })} />
        <FormErrorMessage>
          {errors.companyName && errors.companyName.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Branche</FormLabel>
        <Input {...register('industry', { required: 'Branche ist erforderlich' })} />
        <FormErrorMessage>
          {errors.industry && errors.industry.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>USt-IdNr.</FormLabel>
        <Input {...register('vatId')} />
      </FormControl>

      <FormControl>
        <FormLabel>Unternehmensgröße</FormLabel>
        <Select {...register('companySize')}>
          <option value="small">Klein (1-49 Mitarbeiter)</option>
          <option value="medium">Mittel (50-249 Mitarbeiter)</option>
          <option value="large">Groß (250+ Mitarbeiter)</option>
        </Select>
      </FormControl>

      <HStack spacing={4} align="start">
        <FormControl isRequired>
          <FormLabel>Vorname Ansprechpartner</FormLabel>
          <Input {...register('primaryContactFirstName', { required: 'Vorname des Ansprechpartners ist erforderlich' })} />
          <FormErrorMessage>
            {errors.primaryContactFirstName && errors.primaryContactFirstName.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Nachname Ansprechpartner</FormLabel>
          <Input {...register('primaryContactLastName', { required: 'Nachname des Ansprechpartners ist erforderlich' })} />
          <FormErrorMessage>
            {errors.primaryContactLastName && errors.primaryContactLastName.message}
          </FormErrorMessage>
        </FormControl>
      </HStack>
    </VStack>
  );

  const renderContactFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>E-Mail</FormLabel>
        <Input type="email" {...register('email', { required: 'E-Mail ist erforderlich' })} />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Telefon</FormLabel>
        <Input {...register('phone', { required: 'Telefon ist erforderlich' })} />
        <FormErrorMessage>
          {errors.phone && errors.phone.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Mobiltelefon</FormLabel>
        <Input {...register('mobilePhone')} />
      </FormControl>

      <FormControl>
        <FormLabel>Bevorzugte Kontaktmethode</FormLabel>
        <Select {...register('preferredContactMethod')}>
          <option value="email">E-Mail</option>
          <option value="phone">Telefon</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="signal">Signal</option>
        </Select>
      </FormControl>

      <HStack spacing={4}>
        <FormControl>
          <FormLabel>WhatsApp verfügbar</FormLabel>
          <Switch {...register('whatsappAvailable')} />
        </FormControl>

        <FormControl>
          <FormLabel>Signal verfügbar</FormLabel>
          <Switch {...register('signalAvailable')} />
        </FormControl>
      </HStack>
    </VStack>
  );

  const renderAddressFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>Straße</FormLabel>
        <Input {...register('street', { required: 'Straße ist erforderlich' })} />
        <FormErrorMessage>
          {errors.street && errors.street.message}
        </FormErrorMessage>
      </FormControl>

      <HStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>PLZ</FormLabel>
          <Input {...register('postalCode', { required: 'PLZ ist erforderlich' })} />
          <FormErrorMessage>
            {errors.postalCode && errors.postalCode.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Stadt</FormLabel>
          <Input {...register('city', { required: 'Stadt ist erforderlich' })} />
          <FormErrorMessage>
            {errors.city && errors.city.message}
          </FormErrorMessage>
        </FormControl>
      </HStack>

      <FormControl isRequired>
        <FormLabel>Land</FormLabel>
        <Input {...register('country', { required: 'Land ist erforderlich' })} defaultValue="Deutschland" />
        <FormErrorMessage>
          {errors.country && errors.country.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">Rechnungsadresse identisch</FormLabel>
        <Switch {...register('billingAddressSameAsMain')} defaultChecked />
      </FormControl>

      {!billingAddressSameAsMain && (
        <VStack spacing={4} align="stretch">
          <Heading size="sm">Rechnungsadresse</Heading>
          <FormControl isRequired>
            <FormLabel>Straße</FormLabel>
            <Input {...register('billingAddress.street', { required: !billingAddressSameAsMain && 'Straße ist erforderlich' })} />
            <FormErrorMessage>
              {errors.billingAddress?.street && errors.billingAddress.street.message}
            </FormErrorMessage>
          </FormControl>

          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>PLZ</FormLabel>
              <Input {...register('billingAddress.postalCode', { required: !billingAddressSameAsMain && 'PLZ ist erforderlich' })} />
              <FormErrorMessage>
                {errors.billingAddress?.postalCode && errors.billingAddress.postalCode.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Stadt</FormLabel>
              <Input {...register('billingAddress.city', { required: !billingAddressSameAsMain && 'Stadt ist erforderlich' })} />
              <FormErrorMessage>
                {errors.billingAddress?.city && errors.billingAddress.city.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>

          <FormControl isRequired>
            <FormLabel>Land</FormLabel>
            <Input {...register('billingAddress.country', { required: !billingAddressSameAsMain && 'Land ist erforderlich' })} defaultValue="Deutschland" />
            <FormErrorMessage>
              {errors.billingAddress?.country && errors.billingAddress.country.message}
            </FormErrorMessage>
          </FormControl>
        </VStack>
      )}
    </VStack>
  );

  const renderCateringFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Ernährungsvorlieben</FormLabel>
        <Textarea {...register('dietaryPreferences')} placeholder="z.B. vegetarisch, vegan, halal" />
      </FormControl>

      <FormControl>
        <FormLabel>Allergien</FormLabel>
        <Textarea {...register('allergies')} placeholder="z.B. Nüsse, Laktose, Gluten" />
      </FormControl>
    </VStack>
  );

  const renderContractFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Zahlungsmethode</FormLabel>
        <Select {...register('paymentMethod')}>
          <option value="invoice">Rechnung</option>
          <option value="sepa">SEPA-Lastschrift</option>
          <option value="credit_card">Kreditkarte</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Account Manager</FormLabel>
        <Input {...register('accountManager')} />
      </FormControl>
    </VStack>
  );

  const renderMarketingFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Newsletter</FormLabel>
        <Switch {...register('newsletter')} />
      </FormControl>

      <FormControl>
        <FormLabel>Marketing-Einwilligung</FormLabel>
        <Switch {...register('marketingConsent')} />
      </FormControl>
    </VStack>
  );

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={6}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">{isEditMode ? 'Kunde bearbeiten' : 'Neuer Kunde'}</Heading>

        <FormControl isRequired>
          <FormLabel>Kundentyp</FormLabel>
          <Select
            {...register('type', { required: 'Kundentyp ist erforderlich' })}
            onChange={(e) => setClientType(e.target.value as ClientType)}
            value={clientType}
          >
            <option value="private">Privatkunde</option>
            <option value="business">Geschäftskunde</option>
          </Select>
          <FormErrorMessage>
            {errors.type && errors.type.message}
          </FormErrorMessage>
        </FormControl>

        {clientType === 'private' ? renderPrivateFields() : renderBusinessFields()}

        <Divider />
        <Heading size="md">Kontaktdaten</Heading>
        {renderContactFields()}

        <Divider />
        <Heading size="md">Adresse</Heading>
        {renderAddressFields()}

        <Divider />
        <Heading size="md">Catering-Informationen</Heading>
        {renderCateringFields()}

        <Divider />
        <Heading size="md">Vertragsdaten</Heading>
        {renderContractFields()}

        <Divider />
        <Heading size="md">Marketing</Heading>
        {renderMarketingFields()}

        <HStack spacing={4} justify="flex-end">
          <Button onClick={() => navigate('/clients')}>Abbrechen</Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Speichern' : 'Erstellen'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ClientFormPage; 