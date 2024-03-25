/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, MD2DarkTheme, Provider as PaperProvider } from 'react-native-paper';
// import AudioRecorderComponent from './components/AudioRecorder';
// import PlaybackComponent from './components/PlaybackComponent';
// import ApiResponseDisplay from './components/ApiResponseDisplay';
import theme from './styles/globalStyles'; // Assume this contains the theme as described previously
import { sendRecordingToApi } from './api/ApiClient';
import AudioRecorderComponent from './components/AudioRecorder';
import PlaybackComponent from './components/PlaybackComponent';
1
const App = () => {
  const [audioPath, setAudioPath] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const handleRecordingComplete = (path) => {
    setAudioPath(path);
  };

  const handleSendRecording = async () => {
    // This function would send the recording to an API and update the state with the response
    // Placeholder for API client usage
    const response = await sendRecordingToApi(audioPath);
    setApiResponse(response);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to Our Voice App!</Text>
        <AudioRecorderComponent onRecordingComplete={handleRecordingComplete} />
        {audioPath ? <PlaybackComponent audioPath={audioPath} /> : null}
        <Button mode="contained" onPress={handleSendRecording} disabled={!audioPath} style={styles.button}>
          Send Recording
        </Button>
        {/* {apiResponse && <ApiResponseDisplay response={apiResponse} />} */}
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
