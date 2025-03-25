import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Fehler',
        description: 'Bitte füllen Sie alle Felder aus.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onLogin(email, password);
  };

  return (
    <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Login</Heading>
        
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ihre@email.com"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Passwort</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          mt={4}
        >
          Einloggen
        </Button>
      </VStack>
    </Box>
  );
}; 