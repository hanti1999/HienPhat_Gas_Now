import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import { ScrollView, Pressable } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';

const Account = () => {
  const {
    token,
    account_phonenumber,
    user_fullname,
    address_full,
    account_email,
  } = useLocalSearchParams();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]} className='bg-gray-100 flex-1'>
        <ScreenHeader text={'Tài khoản'} showCart={false} />
        <View className='p-3 bg-white'>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/user-info',
                params: {
                  token,
                  account_phonenumber,
                  user_fullname,
                  address_full,
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;
