import React from 'react';
import { HStack, Icon, Text } from '@chakra-ui/react';
import { FaTruck, FaStore, FaUserFriends, FaUtensils } from 'react-icons/fa';
import { Proposal } from '../../types';

interface OrderTypeIconProps {
  orderType: Proposal['orderType'];
  withLabel?: boolean;
}

const OrderTypeIcon: React.FC<OrderTypeIconProps> = ({ orderType, withLabel = false }) => {
  const getIcon = (type: Proposal['orderType']) => {
    switch (type) {
      case 'self_pickup':
        return FaStore;
      case 'delivery':
        return FaTruck;
      case 'delivery_with_staff':
        return FaUserFriends;
      case 'with_staff':
        return FaUtensils;
      default:
        return FaUtensils;
    }
  };

  const getLabel = (type: Proposal['orderType']) => {
    switch (type) {
      case 'self_pickup':
        return 'Selbstabholung';
      case 'delivery':
        return 'Lieferung';
      case 'delivery_with_staff':
        return 'Lieferung mit Service';
      case 'with_staff':
        return 'Mit Service';
      default:
        return type;
    }
  };

  const IconComponent = getIcon(orderType);

  if (withLabel) {
    return (
      <HStack spacing={2}>
        <Icon as={IconComponent} />
        <Text>{getLabel(orderType)}</Text>
      </HStack>
    );
  }

  return <Icon as={IconComponent} />;
};

export default OrderTypeIcon; 