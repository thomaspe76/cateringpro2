import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Card,
  CardBody,
  Heading,
  Text,
  Divider,
  Badge,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { format, isAfter, isBefore, parse } from 'date-fns';
import clientService from '../../services/clientService';
import { Client } from '../../types';
import ClientQuickForm from '../../components/clients/ClientQuickForm';
import { EventFormData, EventStatus } from '../../types/event';
import { eventService } from '../../services/eventService';

const steps = [
  { title: 'Basisinformationen', description: 'Grundlegende Event-Details' },
  { title: 'Menüplanung', description: 'Menü und Getränke' },
  { title: 'Ressourcenplanung', description: 'Personal und Equipment' },
  { title: 'Zusammenfassung', description: 'Überprüfung und Bestätigung' },
];

const EventFormPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draft, setDraft] = useState<EventFormData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [showClientQuickForm, setShowClientQuickForm] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors }, setValue } = useForm<EventFormData>({
    defaultValues: {
      status: 'angefragt',
      guests: 1,
    },
  });

  // Lade Entwurf aus localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('eventDraft');
    if (savedDraft) {
      setDraft(JSON.parse(savedDraft));
      onOpen();
    }
  }, []);

  // Lade Kunden beim Start
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kunden konnten nicht geladen werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleClientSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('clientId', event.target.value);
  };

  const handleClientCreated = (clientId: string) => {
    setValue('clientId', clientId);
    setShowClientQuickForm(false);
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const result = await eventService.createEvent(data);
      if (result.success && result.data) {
        toast({
          title: 'Event gespeichert',
          description: 'Das Event wurde erfolgreich erstellt.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate(`/events/${result.data.id}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Das Event konnte nicht gespeichert werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = (data: EventFormData) => {
    localStorage.setItem('eventDraft', JSON.stringify(data));
    toast({
      title: 'Entwurf gespeichert',
      description: 'Der Entwurf wurde lokal gespeichert.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const loadDraft = () => {
    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        setValue(key as keyof EventFormData, value);
      });
      toast({
        title: 'Entwurf geladen',
        description: 'Der gespeicherte Entwurf wurde geladen.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const validateDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isAfter(selectedDate, today) || 'Das Datum muss in der Zukunft liegen';
  };

  const validateTime = (startTime: string, endTime: string) => {
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    return isAfter(end, start) || 'Die Endzeit muss nach der Startzeit liegen';
  };

  const renderClientSelect = () => (
    <FormControl isInvalid={!!errors.clientId}>
      <FormLabel>Kunde</FormLabel>
      <InputGroup>
        <Input
          list="clients"
          value={watch('clientId')}
          onChange={handleClientSelect}
          placeholder="Kunde auswählen oder suchen..."
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => setShowClientQuickForm(true)}
          >
            Neu
          </Button>
        </InputRightElement>
      </InputGroup>
      <datalist id="clients">
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.type === 'private' 
              ? `${client.firstName || ''} ${client.lastName || ''}`
              : client.companyName || ''}
          </option>
        ))}
      </datalist>
      <FormErrorMessage>{errors.clientId?.message}</FormErrorMessage>
      <ClientQuickForm
        isOpen={showClientQuickForm}
        onClose={() => setShowClientQuickForm(false)}
        onClientCreated={handleClientCreated}
      />
    </FormControl>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Event-Name</FormLabel>
              <Input {...register('name', { required: 'Name ist erforderlich' })} />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            {renderClientSelect()}

            <HStack spacing={4}>
              <FormControl isInvalid={!!errors.date}>
                <FormLabel>Datum</FormLabel>
                <Input
                  type="date"
                  {...register('date', {
                    required: 'Datum ist erforderlich',
                    validate: validateDate,
                  })}
                />
                <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.startTime}>
                <FormLabel>Beginn</FormLabel>
                <Input
                  type="time"
                  {...register('startTime', {
                    required: 'Beginn ist erforderlich',
                    validate: (value) => validateTime(value, watch('endTime')),
                  })}
                />
                <FormErrorMessage>{errors.startTime?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.endTime}>
                <FormLabel>Ende</FormLabel>
                <Input
                  type="time"
                  {...register('endTime', {
                    required: 'Ende ist erforderlich',
                    validate: (value) => validateTime(watch('startTime'), value),
                  })}
                />
                <FormErrorMessage>{errors.endTime?.message}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.location}>
              <FormLabel>Veranstaltungsort</FormLabel>
              <Input {...register('location', { required: 'Ort ist erforderlich' })} />
              <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.address}>
              <FormLabel>Adresse</FormLabel>
              <Textarea {...register('address')} />
              <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.guests}>
              <FormLabel>Anzahl der Gäste</FormLabel>
              <Controller
                name="guests"
                control={control}
                rules={{ required: 'Gästeanzahl ist erforderlich', min: { value: 1, message: 'Mindestens 1 Gast' } }}
                render={({ field }) => (
                  <NumberInput
                    min={1}
                    value={field.value}
                    onChange={(valueAsString, valueAsNumber) => field.onChange(valueAsNumber)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
              <FormErrorMessage>{errors.guests?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.type}>
              <FormLabel>Veranstaltungstyp</FormLabel>
              <Select {...register('type', { required: 'Typ ist erforderlich' })}>
                <option value="">Typ auswählen</option>
                <option value="hochzeit">Hochzeit</option>
                <option value="firma">Firmenevent</option>
                <option value="privat">Private Veranstaltung</option>
                <option value="andere">Andere</option>
              </Select>
              <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Beschreibung</FormLabel>
              <Textarea {...register('description')} />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>
          </VStack>
        );

      case 1:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Menüplanung</Heading>
            {/* TODO: Implementiere Menüplanung */}
          </VStack>
        );

      case 2:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Ressourcenplanung</Heading>
            {/* TODO: Implementiere Ressourcenplanung */}
          </VStack>
        );

      case 3:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Zusammenfassung</Heading>
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontWeight="bold">Event-Details</Text>
                    <Text>Name: {watch('name')}</Text>
                    <Text>Datum: {format(new Date(watch('date')), 'dd.MM.yyyy')}</Text>
                    <Text>Zeit: {watch('startTime')} - {watch('endTime')}</Text>
                    <Text>Ort: {watch('location')}</Text>
                    <Text>Gäste: {watch('guests')}</Text>
                    <Badge colorScheme="yellow" mt={2}>
                      Status: {watch('status')}
                    </Badge>
                  </Box>
                  <Divider />
                  <Box>
                    <Text fontWeight="bold">Kostenübersicht</Text>
                    {/* TODO: Implementiere Kostenübersicht */}
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box p={6}>
      <Stepper index={activeStep} mb={8}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStepContent()}

        <HStack spacing={4} mt={8} justify="flex-end">
          <Button
            onClick={() => saveDraft(watch())}
            variant="ghost"
            colorScheme="gray"
          >
            Als Entwurf speichern
          </Button>
          {activeStep > 0 && (
            <Button onClick={prevStep} variant="ghost">
              Zurück
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button onClick={nextStep} colorScheme="brand">
              Weiter
            </Button>
          ) : (
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={isSubmitting}
              loadingText="Speichern..."
            >
              Speichern
            </Button>
          )}
        </HStack>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Entwurf gefunden</ModalHeader>
          <ModalBody>
            Es wurde ein gespeicherter Entwurf gefunden. Möchten Sie diesen laden?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Verwerfen
            </Button>
            <Button colorScheme="brand" onClick={loadDraft}>
              Laden
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventFormPage; 