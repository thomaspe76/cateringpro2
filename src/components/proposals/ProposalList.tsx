import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  HStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { Proposal } from '../../types';
import ProposalStatusBadge from './ProposalStatusBadge';
import OrderTypeIcon from './OrderTypeIcon';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ProposalListProps {
  proposals: Proposal[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const ProposalList: React.FC<ProposalListProps> = ({
  proposals,
  onEdit,
  onDelete,
  onView,
}) => {
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const calculateTotalAmount = (items: Proposal['items']) => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  if (proposals.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">Keine Angebote gefunden</Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nummer</Th>
            <Th>Kunde</Th>
            <Th>Veranstaltung</Th>
            <Th>Datum</Th>
            <Th>Art</Th>
            <Th>Status</Th>
            <Th>Gesamtbetrag</Th>
            <Th>Aktionen</Th>
          </Tr>
        </Thead>
        <Tbody>
          {proposals.map((proposal) => (
            <Tr
              key={proposal.id}
              _hover={{ bg: hoverBg }}
              cursor="pointer"
              onClick={() => onView(proposal.id)}
            >
              <Td>{proposal.number}</Td>
              <Td>{proposal.client.name}</Td>
              <Td>{proposal.eventName}</Td>
              <Td>
                {format(new Date(proposal.eventDate), 'dd.MM.yyyy', { locale: de })}
              </Td>
              <Td>
                <OrderTypeIcon orderType={proposal.orderType} withLabel />
              </Td>
              <Td>
                <ProposalStatusBadge status={proposal.status} />
              </Td>
              <Td>{calculateTotalAmount(proposal.items).toFixed(2)} €</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Anzeigen"
                    icon={<ViewIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(proposal.id);
                    }}
                  />
                  <IconButton
                    aria-label="Bearbeiten"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="yellow"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(proposal.id);
                    }}
                  />
                  <IconButton
                    aria-label="Löschen"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(proposal.id);
                    }}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProposalList; 