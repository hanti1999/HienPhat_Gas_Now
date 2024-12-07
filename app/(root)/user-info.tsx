import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native';
import React from 'react';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';

const UserInfo = () => {
  const { token, phonenumber, user_fullname, address_detail } =
    useLocalSearchParams();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]} className='bg-gray-100 flex-1'>
        <ScreenHeader text={'Thông tin người dùng'} />
        <View className='py-2 px-3 mt-2 bg-white'>
          <Pressable className='flex-row items-center justify-between py-3'>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <AntDesign name='phone' size={24} color='black' />
              </View>
              <Text className='text-base'>Số điện thoại</Text>
            </View>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <Text className='text-[#999]'>{phonenumber}</Text>
              <AntDesign name='right' size={16} color='black' />
            </View>
          </Pressable>

          <Pressable className='flex-row items-center justify-between py-3'>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <AntDesign name='user' size={24} color='black' />
              </View>
              <Text className='text-base'>Tên</Text>
            </View>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <Text className='text-[#999]'>{user_fullname}</Text>
              <AntDesign name='right' size={16} color='black' />
            </View>
          </Pressable>

          <Pressable className='flex-row items-center justify-between py-3'>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <AntDesign name='home' size={24} color='black' />
              </View>
              <Text className='text-base'>Địa chỉ giao hàng</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInfo;
