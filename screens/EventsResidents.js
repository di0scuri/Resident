import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const EVENTS_DATA = [
  { id: '1', date: '2024-12-12', title: 'Community Cleanup Drive', time: '5:00 AM - 7:00 AM', location: 'Barangay Hall', participant: 'Open to all residents' },
  { id: '2', date: '2024-12-21', title: 'Basic Computer Skills Workshop', time: '9:00 AM - 12:00 PM', location: 'Barangay Hall', participant: 'Residents aged 15 and above' },
  { id: '3', date: '2024-12-23', title: 'Free Medical Check-Up', time: '9:00 AM - 4:00 PM', location: 'Barangay Covered Court', participant: 'Open to all residents' },
  { id: '4', date: '2024-12-24', title: 'Christmas Party', time: '9:00 AM - 3:00 PM', location: 'Barangay Covered Court', participant: 'Residents aged 18 and above' },
  { id: '5', date: '2024-12-31', title: "New Year's Party", time: '10:00 AM - 5:00 PM', location: 'Barangay Sports Complex', participant: 'Open to all residents' },
];

export default function EventsResidents({ navigation }) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const upcomingEvents = EVENTS_DATA.filter((event) => new Date(event.date) >= new Date());
    setEvents(upcomingEvents);
  }, []);

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    const filteredEvents = EVENTS_DATA.filter((event) => event.date === day.dateString);
    setEvents(filteredEvents);
  };

  const handleBackToDefault = () => {
    setSelectedDate('');
    const upcomingEvents = EVENTS_DATA.filter((event) => new Date(event.date) >= new Date());
    setEvents(upcomingEvents);
  };

  const markedDates = EVENTS_DATA.reduce((acc, event) => {
    acc[event.date] = { marked: true, dotColor: '#7B0A0A' };
    return acc;
  }, { [selectedDate || today]: { selected: true, selectedColor: '#7B0A0A' } });

  return (
    <ScrollView style={styles.container}>
      {/* Calendar Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calendar</Text>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#7B0A0A',
            todayTextColor: '#7B0A0A',
            arrowColor: '#7B0A0A',
            textSectionTitleColor: '#3B3B3B',
            dayTextColor: '#3B3B3B',
            selectedDayTextColor: '#FFFFFF',
            textDisabledColor: '#D9D9D9',
          }}
        />
      </View>

      {/* Events List Section */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>{selectedDate ? `Events on ${selectedDate}` : 'Upcoming Events'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('JoinEvents')}>
            <Ionicons name="notifications-outline" size={28} color="#7B0A0A" />
          </TouchableOpacity>
        </View>

        {selectedDate && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackToDefault}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={() => navigation.navigate('EventOverview', { event: item })}
            >
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventText}>🕒 {item.time}</Text>
              <Text style={styles.eventText}>📍 {item.location}</Text>
              <Text style={styles.eventText}>👥 {item.participant}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noEventText}>No events scheduled for this date.</Text>
          }
          scrollEnabled={false} // Allow ScrollView to handle scrolling
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 15, marginVertical: 10, elevation: 3 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#7B0A0A' },
  backButton: { alignSelf: 'flex-start', marginBottom: 10, backgroundColor: '#7B0A0A', borderRadius: 5, padding: 5 },
  backButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  eventCard: { backgroundColor: '#F3F1FF', padding: 15, marginVertical: 5, borderRadius: 8 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
  eventText: { fontSize: 14, color: '#555555' },
  noEventText: { textAlign: 'center', color: '#888888', fontSize: 16, marginTop: 10 },
});
