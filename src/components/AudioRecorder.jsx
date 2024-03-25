// AudioRecorderComponent.js
import React, { useState } from 'react';
import { Button, View, Text, Platform, PermissionsAndroid } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorderComponent = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4', // should be changed as per your app requirement
    });

    const result = await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log('recording', e);
      return;
    });
    console.log(result);
    setIsRecording(true);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    onRecordingComplete(result); // Pass the path to the recorded file
  };

  return (
    <View>
      <Button title={isRecording ? 'Stop Recording' : 'Start Recording'} onPress={isRecording ? onStopRecord : onStartRecord} />
      {isRecording && <Text>Recording...</Text>}
    </View>
  );
};

export default AudioRecorderComponent;
