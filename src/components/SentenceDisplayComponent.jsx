import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useWordDetails from '../hooks/useWordDetails';
import WordDetailsModal from './WordDetails';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");

  const { wordDetails, wordImage, playPronunciation } = useWordDetails(selectedWord);

  const randomizeSentence = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * sentences.length);
    } while (sentences[randomIndex] === currentSentence);
    setCurrentSentence(sentences[randomIndex]);
  };

  const handleWordPress = (word) => {
    setSelectedWord(word);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sentenceContainer}>
        {currentSentence.split(" ").map((word, index) => (
          <Text key={index} style={styles.word} onPress={() => handleWordPress(word)}>
            {word + (index < currentSentence.split(" ").length - 1 ? ' ' : '')}
          </Text>
        ))}
      </View>
      <TouchableOpacity onPress={randomizeSentence} style={styles.iconButton}>
        <Icon name="shuffle" size={30} color="white" />
      </TouchableOpacity>

      <WordDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        wordDetails={wordDetails}
        wordImage={wordImage}
        word={selectedWord}
        playPronunciation={playPronunciation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sentenceContainer: {
    flexDirection: 'row',
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 26,
  },
  word: {
    fontSize: 26,
    color: 'black',
    marginRight: 4,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 50,
  },
});

export default SentenceDisplayComponent;
