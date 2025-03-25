import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiGrid } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { Event, EventStatus } from '../../types/event';

type ViewMode = 'month' | 'week' | 'day';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const toast = useToast();

  const getStatusColor = (status: EventStatus) => {
    const colors = {
      angefragt: 'yellow',
      geplant: 'blue',
      bestätigt: 'green',
      abgeschlossen: 'purple',
      storniert: 'red',
    };
    return colors[status];
  };

  const getDaysInView = () => {
    switch (viewMode) {
      case 'month':
        return eachDayOfInterval({
          start: startOfWeek(startOfMonth(currentDate)),
          end: endOfWeek(endOfMonth(currentDate)),
        });
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate),
        });
      case 'day':
        return [currentDate];
      default:
        return [];
    }
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const renderCalendarHeader = () => (
    <Flex justify="space-between" align="center" mb={6}>
      <HStack spacing={4}>
        <Heading size="lg">
          {format(currentDate, 'MMMM yyyy', { locale: de })}
        </Heading>
        <HStack>
          <IconButton
            aria-label="Vorheriger Monat"
            icon={<FiChevronLeft />}
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            variant="ghost"
          />
          <IconButton
            aria-label="Nächster Monat"
            icon={<FiChevronRight />}
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            variant="ghost"
          />
        </HStack>
      </HStack>
      <Select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value as ViewMode)}
        maxW="200px"
      >
        <option value="month">Monatsansicht</option>
        <option value="week">Wochenansicht</option>
        <option value="day">Tagesansicht</option>
      </Select>
    </Flex>
  );

  const renderDayCell = (date: Date) => {
    const dayEvents = getEventsForDay(date);
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isCurrentDay = isToday(date);

    return (
      <Box
        p={2}
        h="100px"
        border="1px"
        borderColor="gray.200"
        bg={isCurrentMonth ? 'white' : 'gray.50'}
        position="relative"
      >
        <Text
          fontSize="sm"
          fontWeight={isCurrentDay ? 'bold' : 'normal'}
          color={isCurrentMonth ? 'gray.800' : 'gray.400'}
        >
          {format(date, 'd')}
        </Text>
        <VStack align="stretch" spacing={1} mt={1}>
          {dayEvents.map((event) => (
            <Popover key={event.id} trigger="hover">
              <PopoverTrigger>
                <Box
                  p={1}
                  bg={`${getStatusColor(event.status)}.100`}
                  borderRadius="sm"
                  cursor="pointer"
                >
                  <Text fontSize="xs" noOfLines={1}>
                    {event.name}
                  </Text>
                </Box>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader fontWeight="semibold">{event.name}</PopoverHeader>
                <PopoverBody>
                  <VStack align="stretch" spacing={1}>
                    <Text fontSize="sm">
                      {format(new Date(event.date), 'dd.MM.yyyy', { locale: de })}
                    </Text>
                    <Text fontSize="sm">{event.startTime} - {event.endTime}</Text>
                    <Text fontSize="sm">{event.location}</Text>
                    <Badge colorScheme={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </VStack>
                </PopoverBody>
                <PopoverFooter>
                  <Button size="sm" colorScheme="brand" variant="ghost">
                    Details anzeigen
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          ))}
        </VStack>
      </Box>
    );
  };

  const renderWeekDays = () => (
    <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2}>
      {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
        <GridItem key={day}>
          <Text textAlign="center" fontWeight="bold">
            {day}
          </Text>
        </GridItem>
      ))}
    </Grid>
  );

  return (
    <Box p={6}>
      {renderCalendarHeader()}
      {renderWeekDays()}
      <Grid
        templateColumns={`repeat(${viewMode === 'day' ? 1 : 7}, 1fr)`}
        gap={1}
      >
        {getDaysInView().map((date) => (
          <GridItem key={date.toISOString()}>
            {renderDayCell(date)}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default CalendarPage; 