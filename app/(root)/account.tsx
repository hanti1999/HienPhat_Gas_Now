import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import { ScrollView, Pressable } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';

const Account = () => {
  const { token, account_phonenumber, user_fullname, address_detail } =
    useLocalSearchParams();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]} className='bg-gray-100 flex-1'>
        <ScreenHeader text={'Tài khoản'} />
        <View className='py-2 px-3 mt-2 bg-white'>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/user-info',
                params: {
                  token,
                  account_phonenumber,
                  user_fullname,
                  address_detail,
                },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <AntDesign name='user' size={24} color='black' />
              </View>
              <Text className='text-base'>Thông tin người dùng</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/password',
                params: { token },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <AntDesign name='lock' size={24} color='black' />
              </View>
              <Text className='text-base'>Thay đổi mật khẩu của bạn</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;
