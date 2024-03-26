import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SentenceDisplayComponent from '../components/SentenceDisplayComponent'; // Adjust the path as necessary
import AudioRecorderComponent from '../components/AudioRecorder';
import { NavigationContainer } from '@react-navigation/native';

const RecordScreen = ({ navigation }) => {
  const [audioPath, setAudioPath] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');

  const handleRecordingComplete = (path) => {
    setAudioPath(path);
  };

  return (
    <View style={styles.container}>
      <SentenceDisplayComponent
        currentSentence={currentSentence}
        setCurrentSentence={setCurrentSentence}
      />
      <AudioRecorderComponent
        onRecordingComplete={handleRecordingComplete}
        currentSentence={currentSentence}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default RecordScreen;
