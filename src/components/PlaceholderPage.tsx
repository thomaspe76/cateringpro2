import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Box p={4}>
      <Heading size="lg">{title}</Heading>
      <Text mt={4}>Diese Seite ist noch in Entwicklung.</Text>
    </Box>
  );
};

export default PlaceholderPage; 