import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';

const Sale = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]}>
        <Text>Sale</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sale;
