// SentenceDisplayComponent.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon component

const sentences = [
  "An apple a day keeps the doctor away.",
  "Better late than never.",
    "Actions speak louder than words.",
    "The early bird catches the worm.",
    "The pen is mightier than the sword.",
    "When in Rome, do as the Romans do.",
    "When the going gets tough, the tough get going.",
    "A picture is worth a thousand words.",
    "Don't put all your eggs in one basket.",
    "Don't count your chickens before they hatch.",
    "Don't cry over spilled milk.",
    "Don't bite the hand that feeds you.",
    "Don't judge a book by its cover.",
];

const SentenceDisplayComponent = ({ currentSentence, setCurrentSentence }) => {

    useEffect(() => {
        randomizeSentence();
        }, []);
        
    const randomizeSentence = () => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * sentences.length);
        } while (sentences[randomIndex] === currentSentence); // Ensure a new sentence is selected
        setCurrentSentence(sentences[randomIndex]);
      };

  return (
    <View style={styles.container}>
      <Text style={styles.sentenceText}>{currentSentence}</Text>
      <TouchableOpacity onPress={randomizeSentence} style={styles.iconButton}>
        <Icon name="shuffle" size={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sentenceText: {
    fontSize: 16,
    color: '#6210EE',
    marginRight: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 50,
  },
});

export default SentenceDisplayComponent;
