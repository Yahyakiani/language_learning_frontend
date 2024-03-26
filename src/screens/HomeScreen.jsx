import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Reading Learning App!</Text>
      <Image
        style={styles.image}
        source={{ uri: 'https://play-lh.googleusercontent.com/51WYc0ZPB34cGDB8MCkDc0ymv6iBf0r-kSZV_H5pXVDHvdVCA12TWUWQtS54zg-RodI' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // Makes it circular
  },
});

export default HomeScreen;
