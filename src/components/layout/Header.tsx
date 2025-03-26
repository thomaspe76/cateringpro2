import React from 'react';
import { Box, Flex, Input, InputGroup, InputLeftElement, IconButton, Avatar, Menu, MenuButton, MenuList, MenuItem, useColorModeValue } from '@chakra-ui/react';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';

const Header: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={3}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center" justify="space-between">
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Suchen..." />
        </InputGroup>

        <Flex align="center" gap={4}>
          <IconButton
            aria-label="Benachrichtigungen"
            icon={<FiBell />}
            variant="ghost"
            size="md"
          />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Benutzermenü"
              icon={<Avatar size="sm" name="Benutzer" />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<FiSettings />}>Einstellungen</MenuItem>
              <MenuItem>Abmelden</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header; 