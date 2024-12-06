import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const Password = () => {
  const { token } = useLocalSearchParams();
  return (
    <View>
      <Text>Password</Text>
    </View>
  );
};

export default Password;
