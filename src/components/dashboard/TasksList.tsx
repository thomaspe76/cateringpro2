import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Checkbox,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { FiMoreVertical, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
}

const TasksList: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.700', 'white');

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: 'green',
      medium: 'yellow',
      high: 'red',
    };
    return colors[priority];
  };

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      pending: 'gray',
      in_progress: 'blue',
      completed: 'green',
    };
    return colors[status];
  };

  // Beispieldaten
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Menü für Firmenjubiläum planen',
      description: '3-Gang-Menü für 150 Personen erstellen',
      dueDate: '2025-03-30',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Anna Schmidt'
    },
    {
      id: '2',
      title: 'Getränkeliste für Produktlaunch',
      description: 'Getränkeauswahl und Mengenberechnung',
      dueDate: '2025-03-25',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'Thomas Weber'
    },
    {
      id: '3',
      title: 'Personal für Hochzeit einteilen',
      description: 'Servicepersonal für 85 Gäste planen',
      dueDate: '2025-03-28',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Maria Schmidt'
    }
  ];

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg={bgColor} borderColor={borderColor}>
      <Heading size="md" mb={4} color={headingColor}>Aufgaben</Heading>
      <VStack spacing={4} align="stretch">
        {tasks.map((task) => (
          <Box
            key={task.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg={bgColor}
            borderColor={borderColor}
          >
            <HStack justify="space-between" mb={2}>
              <HStack>
                <Checkbox
                  isChecked={task.status === 'completed'}
                  colorScheme="green"
                  size="lg"
                />
                <Text fontWeight="medium" color={headingColor}>{task.title}</Text>
              </HStack>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Weitere Optionen"
                  icon={<FiMoreVertical />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItem>Bearbeiten</MenuItem>
                  <MenuItem>Als erledigt markieren</MenuItem>
                  <MenuItem>Löschen</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
            <Text color={textColor} mb={2}>{task.description}</Text>
            <HStack spacing={4} color={textColor}>
              <HStack>
                <Icon as={FiClock} />
                <Text>Fällig: {new Date(task.dueDate).toLocaleDateString('de-DE')}</Text>
              </HStack>
              <Badge colorScheme={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge colorScheme={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              <HStack>
                <Icon as={FiCheck} />
                <Text>{task.assignedTo}</Text>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
      <Button mt={4} colorScheme="blue" width="100%">
        Neue Aufgabe hinzufügen
      </Button>
    </Box>
  );
};

export default TasksList; 