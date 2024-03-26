import React, { useState, useEffect } from 'react';
import { View, PermissionsAndroid, Platform } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs'; // Add this for file system access

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorderComponent = ({ currentSentence }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordPath, setRecordPath] = useState('');
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    // Define the path for a temporary recording file
    const tempPath = Platform.select({
      ios: `${RNFS.TemporaryDirectoryPath}hello.m4a`,
      android: `${RNFS.TemporaryDirectoryPath}/hello.mp4`,
    });
    setRecordPath(tempPath);
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        return grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
               grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
               grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const onStartRecord = async () => {
    const permissionsGranted = await requestPermissions();
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
    const msg = await audioRecorderPlayer.startPlayer(recordPath);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished playing');
        audioRecorderPlayer.stopPlayer();
      }
    });
    console.log(msg);
  };

  const onSendRecording = async () => {
    console.log('Sending the recording');
    
    // Read the audio file as a base64-encoded string
    const audioBase64 = await RNFS.readFile(recordPath, 'base64');
    
    // Prepare the data to be sent
    let dataToSend = {
      audio: audioBase64,
      original_text: currentSentence
    };
  
    fetch('http://192.168.4.29:5000/process-audio-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('Response:', responseData);
      // Handle the response data as needed
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
    // Optionally, reset states or perform clean-up tasks
    setIsReviewMode(false);
  };
  
  const onDiscardRecording = async () => {
    // Optionally delete the temporary file
    const exists = await RNFS.exists(recordPath);
    if (exists) {
      await RNFS.unlink(recordPath);
      console.log('Temporary recording deleted');
    }
    setIsReviewMode(false);
  };

  return (
    <View >
      
      {!isRecording && !isReviewMode && (
        <Button
          icon="record-circle"
          buttonColor="red"
          textColor='white'
          size={60}
          onPress={onStartRecord}
          style={{ margin: 10 }}
        >  Start  Recording
        </Button>
      )}
      {isRecording && (
        <Button
          icon="stop-circle-outline"
          buttonColor="black"
          size={60}
          onPress={onStopRecord}
          style={{ margin: 10 }}
        >  Stop Recording
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
          >  Replay Recording
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
          >  Discard Recording
          </Button>
        </>
      )}
    </View>
  );
};

export default AudioRecorderComponent;
