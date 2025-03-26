import React from 'react';
import { Badge } from '@chakra-ui/react';
import { Proposal } from '../../types';

interface ProposalStatusBadgeProps {
  status: Proposal['status'];
}

const ProposalStatusBadge: React.FC<ProposalStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'draft':
        return 'gray';
      case 'sent':
        return 'blue';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: Proposal['status']) => {
    switch (status) {
      case 'draft':
        return 'Entwurf';
      case 'sent':
        return 'Gesendet';
      case 'accepted':
        return 'Akzeptiert';
      case 'rejected':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  return (
    <Badge colorScheme={getStatusColor(status)} variant="subtle">
      {getStatusText(status)}
    </Badge>
  );
};

export default ProposalStatusBadge; 