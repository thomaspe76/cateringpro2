import React from 'react';
import { 
  Box,
  SimpleGrid,
  Heading,
  Text,
  Card,
  CardBody,
  Stack
} from '@chakra-ui/react';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <Card>
          <CardBody>
            <Stack>
              <Heading size="md">Willkommen bei CateringPro</Heading>
              <Text>
                Ihr Dashboard wird hier in Kürze mit Daten gefüllt.
              </Text>
            </Stack>
          </CardBody>
        </Card>
        {/* Weitere Cards hier */}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard; 