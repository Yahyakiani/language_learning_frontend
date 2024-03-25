// PlaybackComponent.js
import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import Sound from 'react-native-sound';

const PlaybackComponent = ({ audioPath }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    // Load the sound file from the given audioPath
    const loadedSound = new Sound(audioPath, '', (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // loaded successfully
      setSound(loadedSound);
    });

    return () => {
      // Release the audio player resource when the component is unmounted
      if (sound) {
        sound.release();
      }
    };
  }, [audioPath]);

  const playPauseAudio = () => {
    if (isPlaying) {
      // Pause the playback
      sound.pause(() => {
        setIsPlaying(false);
      });
    } else {
      // Play the loaded audio file
      sound.play((success) => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <View>
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={playPauseAudio} />
      {isPlaying && <Text>Playing...</Text>}
    </View>
  );
};

export default PlaybackComponent;
