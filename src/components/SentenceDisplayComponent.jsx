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
  const [wordDetails, setWordDetails] = useState({ definition: "", partOfSpeech: "", synonyms: [], pronunciation: "",examples: [],
  antonyms: [] });

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
      console.log("Word details:", wordData);
  
      // Limiting phonetics and definitions to the first two entries
      const limitedPhonetics = wordData?.phonetics?.slice(0, 1);
      const limitedMeanings = wordData?.meanings?.map(meaning => ({
        partOfSpeech: meaning?.partOfSpeech,
        definitions: meaning?.definitions?.slice(0, 1) // Assuming each meaning has multiple definitions
      }));
  
      // Extracting examples and antonyms
    const examples = wordData?.meanings?.map(meaning => 
      meaning?.definitions?.map(def => def.example).filter(ex => ex)).flat();
    const antonyms = wordData?.meanings?.flatMap(meaning => meaning.antonyms);

    setWordDetails({
      phonetics: limitedPhonetics,
      meanings: limitedMeanings,
      examples: examples,
      antonyms: antonyms
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
        <Icon name="shuffle" size={30} color="white" />
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
              <View key={index} style={styles.meaningContainer}>
                <Text style={styles.modalText}>Part of Speech: {meaning.partOfSpeech}</Text>
                {meaning.definitions?.map((def, idx) => (
                  <View key={idx}>
                    <Text style={styles.definitionText}>Definition: {def.definition}</Text>
                    {def.example && (
                      <Text style={styles.exampleText}>Example: {def.example}</Text>
                    )}
                  </View>
                ))}
                {meaning.antonyms?.length > 0 && (
                  <View style={styles.antonymsContainer}>
                    <Text style={styles.modalText}>Antonyms:</Text>
                    <ScrollView horizontal={true}>
                      {meaning.antonyms.map((antonym, idx) => (
                        <View key={idx} style={styles.antonymBox}>
                          <Text style={styles.antonymText}>{antonym}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            ))}

            {wordDetails.phonetics?.length > 0 && (
              <TouchableOpacity
                style={styles.buttonPlay}
                onPress={() => {
                  onPlayPronunciation(wordDetails.phonetics[0].audio);
                  this.isButtonDisabled = true; // Disable button after playing once
                }}
                disabled={this.isButtonDisabled}
              >
                <Icon name="volume-up" size={24} color="white" />
                <Text style={styles.textStyle}>Play Pronunciation</Text>
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
  meaningContainer: {
    marginTop: 5,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  definitionText: {
    marginBottom: 15,
    textAlign: "center",
    color: '#333',
  },
  buttonPlay: {
    marginTop: 10,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  meaningContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  definitionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  antonymsContainer: {
    marginTop: 5,
  },
  antonymBox: {
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#e0e0e0', // Light gray background
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  antonymText: {
    color: '#333',
    fontSize: 14,
  },
});

export default SentenceDisplayComponent;
