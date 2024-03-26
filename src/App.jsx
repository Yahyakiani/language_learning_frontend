/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {  MD2DarkTheme, Provider as PaperProvider } from 'react-native-paper';
// import AudioRecorderComponent from './components/AudioRecorder';
// import PlaybackComponent from './components/PlaybackComponent';
// import ApiResponseDisplay from './components/ApiResponseDisplay';
import theme from './styles/globalStyles'; // Assume this contains the theme as described previously
import AudioRecorderComponent from './components/AudioRecorder';
import PlaybackComponent from './components/PlaybackComponent';
import SentenceDisplayComponent from './components/SentenceDisplayComponent';
1
const App = () => {
  const [audioPath, setAudioPath] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');

  const handleRecordingComplete = (path) => {
    setAudioPath(path);
  };

  

  return (
    <PaperProvider theme={MD2DarkTheme}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to Our Reading Learning App!</Text>
        <SentenceDisplayComponent
        currentSentence={currentSentence}
        setCurrentSentence={setCurrentSentence}
         />
        <AudioRecorderComponent onRecordingComplete={handleRecordingComplete} currentSentence={currentSentence} />
        {audioPath ? <PlaybackComponent audioPath={audioPath} /> : null}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  welcomeText: {
    fontSize: 24,
    color: theme.colors.accent,
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
});

export default App;
