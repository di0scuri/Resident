import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function EventOverview({ route }) {
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <View style={styles.imagePlaceholder}>
        <Image source={{ uri: 'https://via.placeholder.com/300x150' }} style={styles.image} />
      </View>
      <Text style={styles.description}>
        Join us for {event.title.toLowerCase()} to build a better community and connect with others.
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.bold}>WHEN:</Text> {event.date}, {event.time}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.bold}>WHERE:</Text> {event.location}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.bold}>WHO’S ELIGIBLE:</Text> {event.participant}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#7B0A0A', marginBottom: 10 },
  imagePlaceholder: { width: '100%', height: 150, marginVertical: 10, backgroundColor: '#DDD', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  description: { fontSize: 16, color: '#333', marginBottom: 10 },
  detail: { fontSize: 14, color: '#555', marginBottom: 5 },
  bold: { fontWeight: 'bold', color: '#7B0A0A' },
});
