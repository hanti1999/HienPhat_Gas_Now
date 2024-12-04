import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StatusBar } from 'react-native';
import React from 'react';

const Home = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default Home;
