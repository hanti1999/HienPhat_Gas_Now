import { RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Pressable } from 'react-native';
import { ScrollView, Image } from 'react-native';
import { router, Link } from 'expo-router';
import React, { useState } from 'react';
import { logoutAndClearAuth } from '@/redux/slices/authSlice';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import RectangleButton from '@/components/RectangleButton';
import { Ionicons, Foundation } from '@expo/vector-icons';
import loadingIcon from '@/assets/icons/Loading_icon.gif';
import { AppDispatch, RootState } from '@/redux/store';
import ConfirmModal from '@/components/ConfirmModal';
import useGetData from '@/customHooks/useGetData';
import logo from '@/assets/images/logoHp.png';
import { ProfileType } from '@/types/type';
import LoadingScreen from '../loading-screen';

const url = `${process.env.EXPO_PUBLIC_API}/user`;
const version: string = '25.06.10';

const Profile = () => {
  const token = useSelector((state: RootState) => state?.auth.accessToken);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {
    data: user,
    loading,
    refetch,
    clearData,
  } = useGetData<ProfileType>(url, config);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <View className='p-3 flex-row items-center bg-primary-pink'>
        {user ? (
          <>
            <FontAwesome name='user-circle' size={60} color='white' />
            <View className='ml-2 flex-1'>
              <Text className='text-xl font-semibold text-white'>
                {user?.user?.user_fullname}
              </Text>
              <View className='flex-row flex justify-between items-center'>
                <Text className='text-white'>
                  {user?.account?.account_phonenumber}
                </Text>
                <Text className='font-semibold text-white'>
                  {user?.points?.total_points.toLocaleString()} điểm
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View className='flex-1'>
            <Text className='text-lg text-center text-white'>
              Đăng nhập ngay nhận nghìn ưu đãi!
            </Text>
            <View
              className='flex-row items-center py-2 px-3 h-[60px]'
              style={{ gap: 12 }}
            >
              <View className='flex-1'>
                <RectangleButton
                  title='Đăng nhập'
                  bgVariant='danger'
                  onPress={() => router.push('/(auth)/sign-in')}
                />
              </View>
              <View className='flex-1'>
                <RectangleButton
                  onPress={() => router.push('/(auth)/sign-up')}
                  title='Đăng ký'
                  bgVariant='secondary'
                />
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        className='bg-gray-100 flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className={`${user ? 'p-3 mt-2 bg-white' : 'hidden'} `}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/qr-code',
                params: {
                  phonenumber: user?.account?.account_phonenumber,
                  name: user?.user?.user_fullname,
                },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <AntDesign name='qrcode' size={24} color='black' />
              </View>
              <Text className='text-base'>Mã QR của bạn</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/account',
                params: {
                  token: token,
                  account_phonenumber: user?.account?.account_phonenumber,
                  user_fullname: user?.user?.user_fullname,
                  account_email: user?.account?.account_email,
                },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <FontAwesome name='user-o' size={24} color='black' />
              </View>
              <Text className='text-base'>Tài khoản</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/orders',
                params: { token: token },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <FontAwesome name='list-alt' size={24} color='black' />
              </View>
              <Text className='text-base'>Đơn hàng của bạn</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/wishlist',
                params: { token: token },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <FontAwesome name='heart-o' size={24} color='black' />
              </View>
              <Text className='text-base'>Sản phẩm đã lưu</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>
        </View>

        <View className='p-3 mt-2 bg-white'>
          <Pressable
            onPress={() => router.push('/(root)/about')}
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <FontAwesome name='building-o' size={24} color='black' />
              </View>
              <Text className='text-base'>Thông tin công ty</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(root)/about-app',
                params: { version: version },
              })
            }
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <AntDesign name='mobile1' size={24} color='black' />
              </View>
              <Text className='text-base'>Thông tin ứng dụng</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Link href={'https://maps.app.goo.gl/vuDnSzWLxUj12afd7'}>
            <View className='flex-row w-full items-center justify-between py-3'>
              <View style={{ gap: 8 }} className='flex-row items-center'>
                <View className='w-6'>
                  <Foundation name='map' size={24} color='black' />
                </View>
                <Text className='text-base'>Tìm cửa hàng</Text>
              </View>
              <AntDesign name='right' size={16} color='black' />
            </View>
          </Link>

          <Link href={'https://zalo.me/0986359498'}>
            <View className='flex-row w-full items-center justify-between py-3'>
              <View style={{ gap: 8 }} className='flex-row items-center'>
                <View className='w-6'>
                  <FontAwesome name='bug' size={24} color='black' />
                </View>
                <Text className='text-base'>Báo lỗi ứng dụng/Hỗ trợ</Text>
              </View>
              <AntDesign name='right' size={16} color='black' />
            </View>
          </Link>

          <Pressable
            onPress={() => router.push('/(root)/privacy-policy')}
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <Ionicons
                  name='shield-checkmark-outline'
                  size={24}
                  color='black'
                />
              </View>
              <Text className='text-base'>Chính sách bảo mật</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>
        </View>

        <View className={`${user ? 'mt-2 bg-white' : 'hidden'} `}>
          <LogoutButton clearData={clearData} />
        </View>

        <View className='mt-5 pb-5'>
          <View className='flex items-center'>
            <View
              className='flex-row items-center justify-center'
              style={{ gap: 8 }}
            >
              <Image
                source={logo}
                className='w-10 h-10'
                loadingIndicatorSource={loadingIcon}
              />
              <View>
                <Text className='text-gray-500'>CÔNG TY TNHH</Text>
                <Text className='text-gray-500'>HIỀN PHÁT VI NA</Text>
              </View>
            </View>
            <Text className='text-gray-500'>Phiên bản: {version}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const LogoutButton = React.memo(({ clearData }: { clearData: () => void }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAndClearAuth());
    setModalVisible(false);
    clearData();
  };

  return (
    <>
      <ConfirmModal
        onClose={() => setModalVisible(false)}
        onConfirm={handleLogout}
        text='Bạn muốn đăng xuất?'
        modalVisible={modalVisible}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View
          className='flex-row items-center justify-center py-3'
          style={{ gap: 10 }}
        >
          <Ionicons name='log-out-outline' size={26} color='red' />
          <Text className='text-red-500 font-semibold text-lg'>Đăng xuất</Text>
        </View>
      </TouchableOpacity>
    </>
  );
});

export default Profile;
