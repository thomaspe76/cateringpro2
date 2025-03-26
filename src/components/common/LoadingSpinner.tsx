import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

const LoadingSpinner: React.FC = () => {
  return (
    <Flex justify="center" align="center" h="200px">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
      />
    </Flex>
  );
};

export default LoadingSpinner; 