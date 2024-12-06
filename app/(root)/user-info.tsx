import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const UserInfo = () => {
  const { token } = useLocalSearchParams();
  return (
    <View>
      <Text>UserInfo</Text>
    </View>
  );
};

export default UserInfo;
