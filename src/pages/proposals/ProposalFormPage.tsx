import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
  useToast,
  useDisclosure,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Card,
  CardBody,
  Spinner
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiSave, FiSend, FiX, FiCheck } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

import { proposalService } from '../../services/proposalService';
import { clientService } from '../../services/clientService';
import { Proposal, Client, ProposalFormData } from '../../types';
import ConfirmationModal from '../../components/common/ConfirmationModal';

// Formular-Steps
import ClientSelection from '../../components/proposals/forms/ClientSelection';
import EventDetails from '../../components/proposals/forms/EventDetails';
import ItemsSelection from '../../components/proposals/forms/ItemsSelection';
import PaymentTerms from '../../components/proposals/forms/PaymentTerms';
import ProposalPreview from '../../components/proposals/forms/ProposalPreview';
import SendProposalModal from '../../components/proposals/SendProposalModal';

const steps = [
  { title: 'Kunde', description: 'Kundenauswahl' },
  { title: 'Veranstaltung', description: 'Event-Details' },
  { title: 'Positionen', description: 'Menü & Services' },
  { title: 'Konditionen', description: 'Zahlungsbedingungen' },
  { title: 'Vorschau', description: 'Angebot prüfen' }
];

const ProposalFormPage: React.FC = () => {
  // URL-Parameter und Navigation
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditMode = !!id;
  
  // Stepper-State
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  
  // Modal-States
  const { 
    isOpen: isDiscardModalOpen, 
    onOpen: openDiscardModal, 
    onClose: closeDiscardModal 
  } = useDisclosure();
  
  const { 
    isOpen: isSendModalOpen, 
    onOpen: openSendModal, 
    onClose: closeSendModal 
  } = useDisclosure();
  
  // Formular-State
  const [formData, setFormData] = useState<ProposalFormData>({
    clientId: '',
    client: null,
    title: '',
    eventName: '',
    eventDate: '',
    eventStartTime: '',
    eventEndTime: '',
    eventLocation: '',
    eventAddress: '',
    eventType: '',
    orderType: 'delivery_with_staff',
    guests: 0,
    introText: '',
    items: [],
    subtotal: 0,
    taxRate: 19,
    taxAmount: 0,
    total: 0,
    depositAmount: 0,
    depositDueDate: '',
    paymentTerms: 'Zahlbar innerhalb von 14 Tagen nach Erhalt der Rechnung.',
    validUntil: '',
    status: 'entwurf',
    termsAndConditions: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Daten laden (bei Bearbeitung)
  useEffect(() => {
    if (isEditMode && id) {
      fetchProposal(id);
    } else {
      // Standardwerte für ein neues Angebot setzen
      const today = new Date();
      const validUntil = new Date();
      validUntil.setDate(today.getDate() + 14); // 14 Tage gültig
      
      setFormData(prev => ({
        ...prev,
        validUntil: validUntil.toISOString().split('T')[0]
      }));
      
      // Lade Standard-AGB
      loadDefaultTerms();
    }
  }, [id, isEditMode]);
  
  // Angebot laden
  const fetchProposal = async (proposalId: string) => {
    setIsLoading(true);
    try {
      const proposal = await proposalService.getProposal(proposalId);
      if (proposal) {
        // Formular mit Angebotsdaten füllen
        setFormData({
          clientId: proposal.client.id,
          client: proposal.client,
          title: proposal.title || '',
          eventName: proposal.eventName,
          eventDate: proposal.eventDate,
          eventStartTime: proposal.eventStartTime,
          eventEndTime: proposal.eventEndTime,
          eventLocation: proposal.eventLocation,
          eventAddress: proposal.eventAddress || '',
          eventType: proposal.eventType,
          orderType: proposal.orderType,
          guests: proposal.guests,
          introText: proposal.introText || '',
          items: proposal.items,
          subtotal: proposal.subtotal,
          taxRate: proposal.taxRate,
          taxAmount: proposal.taxAmount,
          total: proposal.total,
          depositAmount: proposal.depositAmount || 0,
          depositDueDate: proposal.depositDueDate || '',
          paymentTerms: proposal.paymentTerms,
          validUntil: proposal.validUntil,
          status: proposal.status,
          termsAndConditions: proposal.termsAndConditions
        });
      } else {
        toast({
          title: 'Fehler',
          description: 'Angebot konnte nicht gefunden werden.',
          status: 'error',
          duration: 5000,
        });
        navigate('/proposals');
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      toast({
        title: 'Fehler',
        description: 'Angebot konnte nicht geladen werden.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Standard-AGB laden
  const loadDefaultTerms = async () => {
    try {
      const terms = await proposalService.getDefaultTermsAndConditions();
      setFormData(prev => ({
        ...prev,
        termsAndConditions: terms
      }));
    } catch (error) {
      console.error('Error loading default terms:', error);
    }
  };
  
  // Formularfeld aktualisieren
  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };
  
  // Kunde setzen
  const setClient = (client: Client | null) => {
    setFormData(prev => ({
      ...prev,
      clientId: client?.id || '',
      client
    }));
    setHasChanges(true);
  };
  
  // Angebotspositionen aktualisieren
  const updateItems = (items: any[]) => {
    // Summen berechnen
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      items,
      subtotal,
      taxAmount,
      total
    }));
    setHasChanges(true);
  };
  
  // Zu einem Schritt navigieren
  const goToStep = (step: number) => {
    // Prüfe, ob Pflichtfelder im aktuellen Schritt ausgefüllt sind
    if (validateCurrentStep()) {
      setActiveStep(step);
    } else {
      toast({
        title: 'Unvollständige Daten',
        description: 'Bitte füllen Sie alle erforderlichen Felder aus.',
        status: 'warning',
        duration: 3000,
      });
    }
  };
  
  // Validiere den aktuellen Schritt
  const validateCurrentStep = (): boolean => {
    switch (activeStep) {
      case 0: // Kundenauswahl
        return !!formData.clientId;
      case 1: // Veranstaltungsdetails
        return !!formData.eventName && 
               !!formData.eventDate && 
               !!formData.eventLocation && 
               formData.guests > 0;
      case 2: // Positionen
        return formData.items.length > 0;
      case 3: // Zahlungsbedingungen
        return !!formData.validUntil && !!formData.paymentTerms;
      default:
        return true;
    }
  };
  
  // Angebot speichern
  const saveProposal = async (status: 'entwurf' | 'gesendet' = 'entwurf') => {
    if (!validateForm()) {
      toast({
        title: 'Unvollständige Daten',
        description: 'Bitte füllen Sie alle erforderlichen Felder aus.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const proposalData = {
        ...formData,
        status
      };
      
      let result;
      if (isEditMode && id) {
        result = await proposalService.updateProposal(id, proposalData);
      } else {
        result = await proposalService.createProposal(proposalData);
      }
      
      if (result) {
        toast({
          title: isEditMode ? 'Angebot aktualisiert' : 'Angebot erstellt',
          description: `Das Angebot wurde erfolgreich ${isEditMode ? 'aktualisiert' : 'erstellt'}.`,
          status: 'success',
          duration: 3000,
        });
        
        // Öffne Send-Modal oder navigiere zurück
        if (status === 'gesendet') {
          openSendModal();
        } else {
          navigate(`/proposals/${result.id}`);
        }
        
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error saving proposal:', error);
      toast({
        title: 'Fehler',
        description: `Das Angebot konnte nicht ${isEditMode ? 'aktualisiert' : 'erstellt'} werden.`,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Gesamtes Formular validieren
  const validateForm = (): boolean => {
    return (
      !!formData.clientId &&
      !!formData.eventName &&
      !!formData.eventDate &&
      !!formData.eventLocation &&
      formData.guests > 0 &&
      formData.items.length > 0 &&
      !!formData.validUntil &&
      !!formData.paymentTerms
    );
  };
  
  // Änderungen verwerfen
  const handleDiscard = () => {
    if (hasChanges) {
      openDiscardModal();
    } else {
      navigate(isEditMode ? `/proposals/${id}` : '/proposals');
    }
  };
  
  // Verwerfen bestätigen
  const confirmDiscard = () => {
    closeDiscardModal();
    navigate(isEditMode ? `/proposals/${id}` : '/proposals');
  };
  
  // Render-Funktion
  return (
    <Box>
      {/* Header mit Breadcrumbs */}
      <Flex mb={6} direction="column">
        <Breadcrumb mb={2} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/proposals">Angebote</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{isEditMode ? 'Bearbeiten' : 'Neu'}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Flex justify="space-between" align="center">
          <Heading size="lg">{isEditMode ? 'Angebot bearbeiten' : 'Neues Angebot erstellen'}</Heading>
          <HStack>
            <Button 
              leftIcon={<FiX />} 
              variant="outline" 
              onClick={handleDiscard}
            >
              Abbrechen
            </Button>
            <Button 
              leftIcon={<FiSave />} 
              colorScheme="blue" 
              isLoading={isSaving && formData.status === 'entwurf'} 
              onClick={() => saveProposal('entwurf')}
              isDisabled={isSaving && formData.status !== 'entwurf'}
            >
              Speichern
            </Button>
          </HStack>
        </Flex>
      </Flex>
      
      {/* Stepper */}
      <Box mb={8}>
        <Stepper index={activeStep} colorScheme="blue" size="sm">
          {steps.map((step, index) => (
            <Step key={index} onClick={() => goToStep(index)} cursor="pointer">
              <StepIndicator>
                <StepStatus
                  complete={<FiCheck />}
                  incomplete={<>#{index + 1}</>}
                  active={<>#{index + 1}</>}
                />
              </StepIndicator>
              <Box flexShrink={0}>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Box>
      
      {/* Formular-Inhalte nach Schritt */}
      <Card variant="outline">
        <CardBody>
          {isLoading ? (
            <Flex justify="center" align="center" py={10}>
              <Spinner size="xl" />
            </Flex>
          ) : (
            <>
              {activeStep === 0 && (
                <ClientSelection 
                  selectedClient={formData.client}
                  onClientSelect={setClient}
                />
              )}
              
              {activeStep === 1 && (
                <EventDetails 
                  formData={formData}
                  onChange={updateFormField}
                />
              )}
              
              {activeStep === 2 && (
                <ItemsSelection 
                  items={formData.items}
                  onChange={updateItems}
                  guests={formData.guests}
                />
              )}
              
              {activeStep === 3 && (
                <PaymentTerms 
                  formData={formData}
                  onChange={updateFormField}
                />
              )}
              
              {activeStep === 4 && (
                <ProposalPreview 
                  formData={formData}
                />
              )}
              
              {/* Navigation zwischen Schritten */}
              <Flex justify="space-between" mt={8}>
                <Button
                  leftIcon={<FiChevronLeft />}
                  onClick={() => goToStep(activeStep - 1)}
                  isDisabled={activeStep === 0}
                >
                  Zurück
                </Button>
                
                <HStack>
                  {activeStep === steps.length - 1 ? (
                    <>
                      <Button
                        leftIcon={<FiSave />}
                        onClick={() => saveProposal('entwurf')}
                        isLoading={isSaving && formData.status === 'entwurf'}
                        isDisabled={isSaving && formData.status !== 'entwurf'}
                      >
                        Als Entwurf speichern
                      </Button>
                      <Button
                        leftIcon={<FiSend />}
                        colorScheme="blue"
                        onClick={() => saveProposal('gesendet')}
                        isLoading={isSaving && formData.status === 'gesendet'}
                        isDisabled={isSaving && formData.status !== 'gesendet'}
                      >
                        Angebot speichern und senden
                      </Button>
                    </>
                  ) : (
                    <Button
                      rightIcon={<FiChevronRight />}
                      colorScheme="blue"
                      onClick={() => goToStep(activeStep + 1)}
                      isDisabled={!validateCurrentStep()}
                    >
                      Weiter
                    </Button>
                  )}
                </HStack>
              </Flex>
            </>
          )}
        </CardBody>
      </Card>
      
      {/* Modals */}
      <ConfirmationModal 
        isOpen={isDiscardModalOpen}
        onClose={closeDiscardModal}
        onConfirm={confirmDiscard}
        title="Änderungen verwerfen"
        message="Es gibt ungespeicherte Änderungen. Sind Sie sicher, dass Sie diese verwerfen möchten?"
        confirmText="Verwerfen"
        cancelText="Zurück zur Bearbeitung"
      />
      
      {id && (
        <SendProposalModal 
          isOpen={isSendModalOpen}
          onClose={closeSendModal}
          proposalId={id}
          clientEmail={formData.client?.email || ''}
          clientName={formData.client?.name || ''}
          onSent={() => navigate('/proposals')}
        />
      )}
    </Box>
  );
};

export default ProposalFormPage; 