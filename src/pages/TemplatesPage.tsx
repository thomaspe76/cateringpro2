import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { templateService } from '../services/templateService';
import { Template } from '../types';

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadTemplates();
  }, [searchQuery]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates(searchQuery);
      setTemplates(data);
    } catch (err) {
      setError('Fehler beim Laden der Vorlagen');
      console.error('Error loading templates:', err);
      toast({
        title: 'Fehler',
        description: 'Die Vorlagen konnten nicht geladen werden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Möchten Sie diese Vorlage wirklich löschen?')) {
      return;
    }

    try {
      await templateService.deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
      toast({
        title: 'Erfolg',
        description: 'Die Vorlage wurde erfolgreich gelöscht.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError('Fehler beim Löschen der Vorlage');
      console.error('Error deleting template:', err);
      toast({
        title: 'Fehler',
        description: 'Die Vorlage konnte nicht gelöscht werden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
          <AlertIcon boxSize="40px" mr={0} />
          <Text mt={4}>{error}</Text>
        </Alert>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Vorlagen</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => window.location.href = '/templates/new'}
        >
          Neue Vorlage
        </Button>
      </Flex>

      {/* Suche */}
      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Vorlagen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      {/* Templates Table */}
      <Box bg="white" shadow="sm" rounded="md" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Beschreibung</Th>
              <Th>Kategorie</Th>
              <Th>Erstellt am</Th>
              <Th>Aktionen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {templates.map((template) => (
              <Tr key={template.id} _hover={{ bg: 'gray.50' }}>
                <Td>{template.name}</Td>
                <Td>{template.description}</Td>
                <Td>{template.category}</Td>
                <Td>{new Date(template.createdAt).toLocaleDateString('de-DE')}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => window.location.href = `/templates/${template.id}`}
                    >
                      Anzeigen
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => window.location.href = `/templates/${template.id}/edit`}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(template.id)}
                    >
                      Löschen
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {templates.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500">Keine Vorlagen gefunden</Text>
        </Box>
      )}
    </Container>
  );
};

export default TemplatesPage; 