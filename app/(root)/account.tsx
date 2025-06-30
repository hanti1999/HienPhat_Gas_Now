import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { logoutAndClearAuth } from '@/redux/slices/authSlice';
import ScreenHeader from '@/components/ScreenHeader';
import ConfirmModal from '@/components/ConfirmModal';
import { AntDesign } from '@expo/vector-icons';
import { AppDispatch } from '@/redux/store';

const Account = () => {
  const { token, account_phonenumber, user_fullname, account_email } =
    useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/account/delete-account`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.delete(url, config);
      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Xóa tài khoản thành công',
        });
        dispatch(logoutAndClearAuth());
        router.replace('/(root)/(tabs)/home');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Xóa tài khoản không thành công',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <View className='flex-1 bg-gray-100'>
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

          <Pressable
            onPress={() => setModalVisible(true)}
            className='flex-row items-center justify-between py-3'
          >
            <Text className='text-base text-red-500 font-semibold'>
              Xoá tài khoản
            </Text>
          </Pressable>
          <ConfirmModal
            onConfirm={handleDeleteAccount}
            onClose={() => setModalVisible(false)}
            text='Xác nhận xóa tài khoản? Tất cả dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục'
            modalVisible={modalVisible}
            loading={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Account;
