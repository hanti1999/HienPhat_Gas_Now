import { View, Text } from 'react-native';
import React from 'react';
import { Product } from '@/types/type';

const QuickSearchResultCard = ({ item }: { item: Product }) => {
  return (
    <View>
      <Text>{item?.product_name}</Text>
    </View>
  );
};

export default QuickSearchResultCard;
