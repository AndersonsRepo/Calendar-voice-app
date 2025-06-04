import React from 'react';
import styles from '@/styles/CalendarEvents.module.css';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

interface CalendarEventsProps {
  events: CalendarEvent[];
}

const CalendarEvents: React.FC<CalendarEventsProps> = ({ events }) => {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Group events by day
  const groupEventsByDay = (events: CalendarEvent[]) => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    
    events.forEach(event => {
      const date = new Date(event.start);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      
      grouped[dayKey].push(event);
    });
    
    return grouped;
  };

  const groupedEvents = groupEventsByDay(events);
  const days = Object.keys(groupedEvents);

  if (events.length === 0) {
    return (
      <div className={styles.noEvents}>
        <p>No events scheduled for this week.</p>
      </div>
    );
  }

  return (
    <div className={styles.calendarEvents}>
      <h2 className={styles.weekTitle}>Your Schedule This Week</h2>
      
      {days.map(day => (
        <div key={day} className={styles.dayGroup}>
          <h3 className={styles.dayTitle}>{day}</h3>
          
          <div className={styles.eventsList}>
            {groupedEvents[day].map(event => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventTime}>
                  {formatDate(event.start)} - {formatDate(event.end)}
                </div>
                <h4 className={styles.eventTitle}>{event.title}</h4>
                
                {event.location && (
                  <div className={styles.eventLocation}>
                    <span className={styles.locationIcon}>📍</span> {event.location}
                  </div>
                )}
                
                {event.description && (
                  <p className={styles.eventDescription}>{event.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarEvents;
