import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';

const UserInfo = () => {
  const { token, account_phonenumber, user_fullname } = useLocalSearchParams();

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <View className='flex-1 bg-gray-100'>
        <StatusBar backgroundColor='#fb77c5' style='light' />
        <ScreenHeader text={'Thông tin người dùng'} />
        <View className='p-3 bg-white'>
          <View className='flex-row items-center justify-between py-3'>
            <Text className='text-base'>Số điện thoại</Text>
            <Text className='text-[#999]'>{account_phonenumber}</Text>
          </View>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/update-name',
                params: { token, user_fullname },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <Text className='text-base'>Tên</Text>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <Text className='text-[#999]'>{user_fullname}</Text>
              <AntDesign name='right' size={16} color='black' />
            </View>
          </Pressable>

          {/* <Pressable className='flex-row items-center justify-between py-3'>
            <Text className='text-base'>Email</Text>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <Text className='text-[#999]'>{account_email}</Text>
              <AntDesign name='right' size={16} color='black' />
            </View>
          </Pressable> */}

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/address',
                params: { token },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <Text className='text-base'>Địa chỉ giao hàng</Text>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserInfo;
