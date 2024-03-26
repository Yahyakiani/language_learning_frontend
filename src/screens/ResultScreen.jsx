import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Title } from 'react-native-paper';

const ResultsScreen = ({ route }) => {
  const { responseData } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Transcription</Title>
          <Text>{responseData?.transcription}</Text>
        </Card.Content>
      </Card>

      {/* Render Readability Metrics */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Readability Metrics</Title>
          {Object.entries(responseData?.readability_metrics).map(([sentence, metrics]) => (
            <>
              <Text style={styles.sentence}>{sentence}</Text>
              {Object.entries(metrics).map(([metric, value]) => (
                <Text key={metric}>{`${metric}: ${value}`}</Text>
              ))}
            </>
          ))}
        </Card.Content>
      </Card>

      {/* Render Word Complexities */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Word Complexities</Title>
          {Object.entries(responseData?.word_complexities).map(([word, complexity]) => (
            <Text key={word}>{`${word}: ${complexity}`}</Text>
          ))}
        </Card.Content>
      </Card>

      {/* Additional Information: Levenshtein Distance, Missed and New Keywords */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Additional Information</Title>
          <Text>Levenshtein Distance: {responseData?.levenshtein_distance}</Text>
          <Text>Missed Keywords: {responseData?.missed_keywords.join(", ")}</Text>
          <Text>New Keywords: {responseData?.new_keywords.join(", ")}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5', // Light background color
    color: '#333', // Darker text for readability
  },
  card: {
    backgroundColor: '#ffffff', // Cards with white background
    borderRadius: 20, // Rounded corners for the cards
    padding: 15,
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: '#3143e8', // Fun and engaging color for the titles
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#333', // Darker text for readability
    lineHeight: 24, // Line height for better readability
  },
  sentence: {
    fontWeight: 'bold',
    color: '#e91e63', // A playful color for sentences
    marginBottom: 5,
  },
  title: {
    color: 'black',
  },
});


export default ResultsScreen;
