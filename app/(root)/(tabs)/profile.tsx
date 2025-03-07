import { ScrollView, Modal, Dimensions, Image } from 'react-native';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import axios from 'axios';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import RectangleButton from '@/components/RectangleButton';
import { Ionicons, Foundation } from '@expo/vector-icons';
import { logout } from '@/redux/slices/authSlice';
import getNewToken from '@/utils/getNewToken';
import { ProfileType } from '@/types/type';
import { RootState } from '@/redux/store';
import openLink from '@/utils/openLink';
import LoadingScreen from '../loading-screen';

const Profile = () => {
  const version: string = 'v25.03.07';
  const token = useSelector((state: RootState) => state?.auth.accessToken);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<ProfileType>();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  const fetchUserProfile = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/user`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.error('Lỗi (catch ProfileScreen): ', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <StatusBar backgroundColor='#fb77c5' style='light' />
      <ScrollView
        stickyHeaderIndices={[0]}
        className='bg-gray-100 flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='p-3 flex-row items-center bg-primary-pink'>
          {user?.user?.user_img_url != null ? (
            <Image
              className='w-20 h-20 rounded-full border border-white'
              source={{ uri: user?.user?.user_img_url }}
            />
          ) : (
            <FontAwesome name='user-circle' size={60} color='white' />
          )}
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
        </View>

        <View className='p-3 mt-2 bg-white'>
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
                <AntDesign name='user' size={24} color='black' />
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
              openLink('https://maps.app.goo.gl/vuDnSzWLxUj12afd7')
            }
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <Foundation name='map' size={24} color='black' />
              </View>
              <Text className='text-base'>Tìm cửa hàng</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>

          <Pressable
            onPress={() => openLink('https://zalo.me/0986359498')}
            className='flex-row items-center justify-between py-3'
          >
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <View className='w-6'>
                <FontAwesome name='bug' size={24} color='black' />
              </View>
              <Text className='text-base'>Báo lỗi ứng dụng/Hỗ trợ</Text>
            </View>
            <AntDesign name='right' size={16} color='black' />
          </Pressable>
        </View>

        <View className='p-3 bg-white mt-2'>
          <LogoutButton />
        </View>

        <View className='mt-5'>
          <View className='flex items-center'>
            <Text className='text-gray-500'>Gas Hiền Phát - {version}</Text>
            <Text className='mt-2 text-gray-500'>
              Thiết kế và phát triển bởi:
            </Text>
            <Text className='text-primary-pink'>Tú Nhi (Manager | Tester)</Text>
            <Link href={'https://github.com/hanti1999'}>
              <Text className=' text-blue-400 underline'>
                Hoàng Anh (Front-end | Media)
              </Text>
            </Link>

            <Link href={'https://github.com/vtit6109'}>
              <Text className=' text-blue-400 underline'>
                Vũ Thắng (Back-end)
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const LogoutButton = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const width = Dimensions.get('window').width;

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/sign-in');
  };

  return (
    <>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
          className='flex-1 items-center justify-center'
        >
          <View
            className='p-3 rounded-xl bg-white shadow-lg'
            style={{ width: width * 0.8 - 8 }}
          >
            <Text className='text-center my-4 text-lg'>
              Bạn muốn đăng xuất?
            </Text>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <RectangleButton
                title='Hủy'
                bgVariant='outline'
                textVariant='primary'
                onPress={() => setModalVisible(!modalVisible)}
              />
              <RectangleButton title='Đồng ý' onPress={handleLogout} />
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
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
};

export default Profile;
