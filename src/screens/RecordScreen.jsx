import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import SentenceDisplayComponent from '../components/SentenceDisplayComponent'; // Adjust the path as necessary
import AudioRecorderComponent from '../components/AudioRecorder';
import LottieView from 'lottie-react-native';

const RecordScreen = ({ navigation }) => {
  const [audioPath, setAudioPath] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');

  const handleRecordingComplete = (path) => {
    setAudioPath(path);
  };

  return (
    <>
      <LottieView
        source={require('../../assets/animations/confetti.json')} // Adjust the path to your confetti animation file
        autoPlay
        loop
        style={styles.lottie}
        />
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
          </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: -3,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    
  },
  lottie: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default RecordScreen;
