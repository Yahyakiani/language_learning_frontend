import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

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
  const [wordDetails, setWordDetails] = useState({ 
    phonetics: [], 
    meanings: [], 
    examples: [], 
    antonyms: [] 
  });

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
      const dictionaryApiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const linguaRobotApiUrl = `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${word}`;
  
      let dictionaryData = [];
      let linguaRobotData = {};
  
      // Fetch from Dictionary API
      try {
        const response = await fetch(dictionaryApiUrl);
        dictionaryData = await response.json();
        console.log("Dictionary API response:", dictionaryData);
      } catch (error) {
        console.error("Failed to fetch from Dictionary API:", error);
      }
  
      // Fetch from Lingua Robot API
      try {
        const response = await fetch(linguaRobotApiUrl, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'lingua-robot.p.rapidapi.com',
            'x-rapidapi-key': '511f7ad74dmsh92959ab2bd582fdp105cc0jsne53a5d087da5',
          },
        });
        linguaRobotData = await response.json();
        console.log("Lingua Robot API response:", linguaRobotData);
      } catch (error) {
        console.error("Failed to fetch from Lingua Robot API:", error);
      }
  
      const combinedData = combineApiResponse([dictionaryData, linguaRobotData]);
  
      console.log("Combined API data:", combinedData);
  
      setWordDetails(combinedData);
    } catch (error) {
      console.error("Failed to fetch word details:", error);
    }
  };
  const combineApiResponse = (data) => {
    let phonetics = [];
    let meanings = [];
    let examples = [];
    let antonyms = [];
  
    data.forEach(apiData => {
      if (Array.isArray(apiData) && apiData[0]) {
        // Handling data from Dictionary API
        const dictionaryData = apiData[0];
        console.log("Processing Dictionary API data:", dictionaryData);
  
        if (dictionaryData.phonetics) {
          phonetics = phonetics.concat(dictionaryData.phonetics).slice(0, 2);
        }
  
        if (dictionaryData.meanings) {
          meanings = meanings.concat(dictionaryData.meanings.map(meaning => ({
            partOfSpeech: meaning.partOfSpeech,
            definitions: meaning.definitions ? meaning.definitions.slice(0, 2).map(def => ({
              definition: def.definition,
              example: def.example,
            })) : [],
            antonyms: meaning.antonyms ? meaning.antonyms.slice(0, 2) : [],
          }))).slice(0, 2);
  
          examples = examples.concat(dictionaryData.meanings.flatMap(meaning => meaning.definitions ? meaning.definitions.map(def => def.example).filter(ex => ex) : [])).slice(0, 2);
  
          antonyms = antonyms.concat(dictionaryData.meanings.flatMap(meaning => meaning.antonyms ? meaning.antonyms : [])).slice(0, 2);
        }
      } else if (apiData.entries) {
        // Handling data from Lingua Robot API
        console.log("Processing Lingua Robot API data:", apiData);
        apiData.entries.forEach(entry => {
          if (entry.lexemes) {
            phonetics = phonetics.concat(entry.lexemes.flatMap(lexeme => lexeme.phoneticTranscriptions ? lexeme.phoneticTranscriptions.map(pt => ({ text: pt.transcription, audio: pt.audio.url })) : [])).slice(0, 2);
  
            meanings = meanings.concat(entry.lexemes.map(lexeme => ({
              partOfSpeech: lexeme.partOfSpeech,
              definitions: lexeme.senses ? lexeme.senses.slice(0, 2).map(sense => ({
                definition: sense.definition,
                example: sense.usageExamples ? sense.usageExamples[0] : null,
              })) : [],
              antonyms: lexeme.senses ? lexeme.senses.flatMap(sense => sense.antonyms ? sense.antonyms.slice(0, 2) : []) : [],
            }))).slice(0, 2);
  
            examples = examples.concat(entry.lexemes.flatMap(lexeme => lexeme.senses ? lexeme.senses.flatMap(sense => sense.usageExamples ? sense.usageExamples.slice(0, 2) : []) : [])).slice(0, 2);
  
            antonyms = antonyms.concat(entry.lexemes.flatMap(lexeme => lexeme.senses ? lexeme.senses.flatMap(sense => sense.antonyms ? sense.antonyms.slice(0, 2) : []) : [])).slice(0, 2);
          }
        });
      }
    });
  
    return {
      phonetics: phonetics.slice(0, 2),
      meanings: meanings.slice(0, 2),
      examples: examples.slice(0, 2),
      antonyms: antonyms.slice(0, 2),
    };
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
                {wordDetails.antonyms?.length > 0 && (
                  <View style={styles.antonymsContainer}>
                    <Text style={styles.modalText}>Antonyms:</Text>
                    <ScrollView horizontal={true}>
                      {wordDetails.antonyms.map((antonym, idx) => (
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
