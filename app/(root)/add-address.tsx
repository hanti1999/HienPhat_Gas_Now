import { View, Text, SafeAreaView } from 'react-native';
import { ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';

const AddAddress = () => {
  const [isDefault, setDefault] = useState<boolean>(false);

  const toggleSwitch = () => {
    setDefault(!isDefault);
  };

  const handleAddAddress = async () => {};

  return (
    <SafeAreaView className='bg-white flex-1'>
      <ScrollView stickyHeaderIndices={[0]}>
        <ScreenHeader text='Thêm địa chỉ' />
        <View className='p-3'>
          <RectangleInput label='Tên người nhận' />
          <RectangleInput label='Số điện thoại' keyboardType='numeric' />
          <RectangleInput label='Địa chỉ' />
          <RectangleInput label='Số nhà' placeholder='Không bắt buộc...' />
          <RectangleInput label='Ghi chú' placeholder='Không bắt buộc...' />
        </View>
        <View className='p-3 flex-row items-center justify-between border-y border-gray-200'>
          <Text>Đặt làm địa chỉ mặc định</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#fb77c5' }}
            onValueChange={toggleSwitch}
            value={isDefault}
          />
        </View>
        <View className='p-3 mt-5'>
          <CustomButton onPress={handleAddAddress} title='Thêm' />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddress;
