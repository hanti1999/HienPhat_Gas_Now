import { useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';

const ProductByCategory = () => {
  const { categoryId, token } = useLocalSearchParams();
  console.log(token);
  return (
    <SafeAreaView>
      <Text>ProductByCategory</Text>
    </SafeAreaView>
  );
};

export default ProductByCategory;
