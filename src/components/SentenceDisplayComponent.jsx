import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Button, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

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
const audioRecorderPlayer = new AudioRecorderPlayer();

const SentenceDisplayComponent = ({ currentSentence, setCurrentSentence }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [wordDetails, setWordDetails] = useState({ definition: "", partOfSpeech: "", synonyms: [], pronunciation: "" });

  useEffect(() => {
    randomizeSentence();
  }, []);

  const randomizeSentence = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * sentences.length);
    } while (sentences[randomIndex] === currentSentence);
    setCurrentSentence(sentences[randomIndex]);
  };

  const fetchWordDetails = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const jsonData = await response.json();
      const wordData = jsonData[0];
  
      // Limiting phonetics and definitions to the first two entries
      const limitedPhonetics = wordData?.phonetics?.slice(0, 2);
      const limitedMeanings = wordData?.meanings?.map(meaning => ({
        partOfSpeech: meaning?.partOfSpeech,
        definitions: meaning?.definitions?.slice(0, 2) // Assuming each meaning has multiple definitions
      }));
  
      setWordDetails({
        phonetics: limitedPhonetics,
        meanings: limitedMeanings
      });
    } catch (error) {
      console.error("Failed to fetch word details:", error);
    }
  };
  const onPlayPronunciation = async (audioUrl) => {
    const msg = await audioRecorderPlayer.startPlayer(audioUrl);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished playing');
        audioRecorderPlayer.stopPlayer();
      }
    });
    console.log(msg);
  };

  const handleWordPress = (word) => {
    setSelectedWord(word);
    fetchWordDetails(word);
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
        <Icon name="shuffle" size={30} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.modalTextTitle}>{selectedWord.toUpperCase()}</Text>
            {wordDetails.meanings?.map((meaning, index) => (
              <View key={index}>
                <Text style={styles.modalText}>Part of Speech: {meaning.partOfSpeech}</Text>
                {meaning.definitions?.map((def, idx) => (
                  <Text key={idx} style={styles.modalText}>
                    Definition: {def.definition}
                    {def.example ? ` Example: ${def.example}` : ''}
                  </Text>
                ))}
              </View>
            ))}
            {wordDetails.phonetics?.length > 0 && (
              <TouchableOpacity
                style={styles.buttonPlay}
                onPress={() => onPlayPronunciation(wordDetails.phonetics[0].audio)}>
                <Text style={styles.modalText}>Play Pronunciation: {wordDetails.phonetics[0].text}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    flexWrap: 'wrap',
    marginRight: 10,
  },
  word: {
    fontSize: 16,
    color: '#6210EE',
    marginRight: 4,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  scrollView: {
    marginBottom: 10,
  },
  modalTextTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonPlay: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50', // Green background for emphasis
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
});

export default SentenceDisplayComponent;
