import React, { useState, useEffect } from 'react';
import { View, PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorderComponent = ({ currentSentence, navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordPath, setRecordPath] = useState('');
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    const tempPath = Platform.select({
      ios: `${RNFS.CachesDirectoryPath}/hello.m4a`,
      android: `${RNFS.CachesDirectoryPath}/hello.mp4`,
    });
    setRecordPath(tempPath);
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('Permissions granted:', grants);

        if (
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          Alert.alert(
            'Permissions Denied',
            'Microphone permission is denied. Please enable it in the app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ]
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const onStartRecord = async () => {
    console.log('Starting recording');
    const permissionsGranted = await requestPermissions();
    console.log('Permissions granted:', permissionsGranted);
    if (!permissionsGranted) return;

    const result = await audioRecorderPlayer.startRecorder(recordPath);
    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log('recording', e);
    });
    console.log(result);
    setIsRecording(true);
    setIsReviewMode(false);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    setIsReviewMode(true);
    console.log(result);
  };

  const onPlayRecordedAudio = async () => {
    try {
      console.log(`Playing audio from: ${recordPath}`);
      await audioRecorderPlayer.stopPlayer(); // Ensure the player is stopped before starting it again
      const msg = await audioRecorderPlayer.startPlayer(recordPath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.current_position === e.duration) {
          console.log('finished playing');
          audioRecorderPlayer.stopPlayer();
        }
      });
      console.log('Playback message:', msg);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const onSendRecording = async () => {
    try {
      console.log('Checking if file exists at:', recordPath);
      const exists = await RNFS.exists(recordPath);
      if (!exists) {
        console.error('File does not exist:', recordPath);
        return;
      }
  
      console.log('Reading file from path:', recordPath);
      const audioBase64 = await RNFS.readFile(recordPath, 'base64');
      console.log('File read successfully, size:', audioBase64.length);
  
      let dataToSend = {
        audio: audioBase64,
        original_text: currentSentence,
      };
  
      console.log('Sending data to server:', dataToSend);
  
      fetch('http://192.168.91.206:5000/process-audio-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => {
          console.log('Response status:', response.status);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((responseData) => {
          console.log('Response data:', responseData);
          navigation.navigate('Results', { responseData });
        })
        .catch((error) => {
          console.error('Network request error:', error);
        });
  
      setIsReviewMode(false);
    } catch (error) {
      console.error('Error sending recording:', error);
    }
  };
  

  const onDiscardRecording = async () => {
    try {
      const exists = await RNFS.exists(recordPath);
      if (exists) {
        await RNFS.unlink(recordPath);
        console.log('Temporary recording deleted');
      }
      setIsReviewMode(false);
    } catch (error) {
      console.error('Error discarding recording:', error);
    }
  };

  return (
    <View>
      {!isRecording && !isReviewMode && (
        <Button
          icon="record-circle"
          buttonColor="red"
          textColor="white"
          size={60}
          onPress={onStartRecord}
          style={{ margin: 10 }}
        >
          Start Recording
        </Button>
      )}
      {isRecording && (
        <Button
          icon="stop-circle-outline"
          buttonColor="black"
          size={60}
          onPress={onStopRecord}
          style={{ margin: 10 }}
        >
          Stop Recording
        </Button>
      )}
      {isReviewMode && (
        <>
          <Button
            icon="play-circle-outline"
            buttonColor="green"
            size={60}
            onPress={onPlayRecordedAudio}
            style={{ margin: 10 }}
          >
            Replay Recording
          </Button>
          <Button mode="contained" onPress={onSendRecording} style={{ margin: 10 }}>
            Send
          </Button>
          <Button
            icon="delete-circle-outline"
            buttonColor="grey"
            size={60}
            onPress={onDiscardRecording}
            style={{ margin: 10 }}
          >
            Discard Recording
          </Button>
        </>
      )}
    </View>
  );
};

export default AudioRecorderComponent;
