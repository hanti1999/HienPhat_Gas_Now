import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';

const Account = () => {
  const { token, account_phonenumber, user_fullname, account_email } =
    useLocalSearchParams();

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <View className='flex-1 bg-gray-100'>
        <StatusBar backgroundColor='#fb77c5' style='light' />
        <ScreenHeader text={'Tài khoản'} />
        <View className='p-3 bg-white'>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/user-info',
                params: {
                  token,
                  account_phonenumber,
                  user_fullname,
                  account_email,
                },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <Text className='text-base'>Thông tin người dùng</Text>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/update-password',
                params: { token, account_phonenumber },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <Text className='text-base'>Thay đổi mật khẩu</Text>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Account;
