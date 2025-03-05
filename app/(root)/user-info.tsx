import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { ScrollView } from 'react-native';
import React from 'react';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';

const UserInfo = () => {
  const { token, account_phonenumber, user_fullname } = useLocalSearchParams();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]}>
        <ScreenHeader text={'Thông tin người dùng'} />
        <View className='p-3'>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInfo;
