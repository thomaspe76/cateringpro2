import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Select,
  Checkbox,
  useToast,
  Box,
  Divider,
  Text
} from '@chakra-ui/react';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  clientEmail: string;
  clientName: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  proposalId,
  clientEmail,
  clientName,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailData, setEmailData] = useState({
    to: clientEmail,
    subject: '',
    body: '',
    attachPDF: true,
    cc: '',
    bcc: '',
  });

  useEffect(() => {
    // Mock-Templates - später durch API-Aufruf ersetzen
    const templates: EmailTemplate[] = [
      {
        id: 'template-1',
        name: 'Standard-Vorlage',
        subject: 'Ihr Angebot',
        body: `Sehr geehrte/r ${clientName},\n\nvielen Dank für Ihr Interesse. Anbei finden Sie unser Angebot.\n\nMit freundlichen Grüßen\nIhr CateringPro Team`,
      },
      {
        id: 'template-2',
        name: 'Erinnerung',
        subject: 'Erinnerung: Ihr Angebot',
        body: `Sehr geehrte/r ${clientName},\n\nwir möchten Sie freundlich an unser Angebot erinnern.\n\nMit freundlichen Grüßen\nIhr CateringPro Team`,
      },
    ];
    setEmailTemplates(templates);
  }, [clientName]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      setEmailData((prev) => ({
        ...prev,
        subject: template.subject,
        body: template.body,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      // TODO: Implementiere E-Mail-Versand
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simuliere API-Aufruf
      toast({
        title: 'E-Mail gesendet',
        description: 'Das Angebot wurde erfolgreich per E-Mail versendet.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'E-Mail konnte nicht gesendet werden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Angebot per E-Mail senden</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Vorlage</FormLabel>
              <Select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="">Keine Vorlage</option>
                {emailTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>An</FormLabel>
              <Input
                name="to"
                value={emailData.to}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>CC</FormLabel>
              <Input
                name="cc"
                value={emailData.cc}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>BCC</FormLabel>
              <Input
                name="bcc"
                value={emailData.bcc}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Betreff</FormLabel>
              <Input
                name="subject"
                value={emailData.subject}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Nachricht</FormLabel>
              <Textarea
                name="body"
                value={emailData.body}
                onChange={handleInputChange}
                rows={6}
              />
            </FormControl>

            <FormControl>
              <Checkbox
                name="attachPDF"
                isChecked={emailData.attachPDF}
                onChange={handleCheckboxChange}
              >
                PDF-Angebot anhängen
              </Checkbox>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSendEmail}
            isLoading={isLoading}
          >
            Senden
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendEmailModal; 