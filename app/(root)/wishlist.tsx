import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';

const Wishlist = () => {
  const { token } = useLocalSearchParams();
  return (
    <View>
      <Text>Wishlist</Text>
    </View>
  );
};

export default Wishlist;
