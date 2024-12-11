import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const ProductByBrand = () => {
  const { brandId, token } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>ProductByBrand</Text>
    </SafeAreaView>
  );
};

export default ProductByBrand;
