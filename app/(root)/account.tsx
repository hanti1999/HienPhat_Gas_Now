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
            <Text className='text-base'>Thông tin người dùng</Text>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/password',
                params: { token, account_phonenumber },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <Text className='text-base'>Thay đổi mật khẩu của bạn</Text>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;
