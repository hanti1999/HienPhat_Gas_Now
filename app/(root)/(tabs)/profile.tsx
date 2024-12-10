import { ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, View, SafeAreaView, Pressable, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import axios from 'axios';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Ionicons, Foundation } from '@expo/vector-icons';
import ScreenHeader from '@/components/ScreenHeader';
import { logout } from '@/redux/slices/authSlice';
import { ProfileType } from '@/types/type';
import { RootState } from '@/redux/store';
import openLink from '@/utils/openLink';
import LoadingScreen from '../loading-screen';

const Profile = () => {
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
          Authorization: ` Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      console.log(res.status); // test
      if (res.status === 200) {
        setUser(res.data);
      } else {
        Toast.show({ type: 'error', text1: res.data?.message });
      }
    } catch (error) {
      console.error('Lỗi (catch ProfileScreen): ', error);
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
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar />
      <ScrollView
        stickyHeaderIndices={[0]}
        className='bg-gray-100 flex-1'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ScreenHeader text={'Tài khoản'} />
        <View
          style={{ gap: 12 }}
          className='p-3 flex-row items-center bg-white'
        >
          {user?.user?.user_img_url != null ? (
            <Image
              className='w-20 h-20 rounded-full border border-primary-pink'
              source={{ uri: user?.user?.user_img_url }}
            />
          ) : (
            <View className='bg-primary-pink flex justify-center items-center w-20 h-20 rounded-full'>
              <FontAwesome name='user-o' size={40} color='white' />
            </View>
          )}
          <View>
            <Text className='text-xl font-semibold'>
              {user?.user?.user_fullname}
            </Text>
            {/* <Text className='font-semibold'>
              {user?.points?.toLocaleString()} điểm
            </Text> */}
            <Text className='text-gray-500'>
              {user?.account?.account_phonenumber}
            </Text>
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
                  address_full: user?.address?.address_full,
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

        <View className='mt-10'>
          <View className='flex items-center'>
            <Text className='text-gray-500'>Gas Hiền Phát - v{'0.12.24'}</Text>
            <Text className='mt-2 text-gray-500'>
              Thiết kế và phát triển bởi:
            </Text>
            <Text className='text-gray-500'>Tú Nhi (Manager | Tester)</Text>
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
          <View className='p-2 rounded-xl bg-white shadow-lg'>
            <Text className='text-center my-4 text-[16px]'>
              Bạn muốn đăng xuất?
            </Text>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <TouchableOpacity
                className='rounded-full w-32 h-10 justify-center border-primary-pink border'
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className='text-center text-[16px]'>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='rounded-full w-32 h-10 justify-center bg-primary-pink border-primary-pink border'
                onPress={handleLogout}
              >
                <Text className='text-center text-[16px] text-white'>
                  Đồng ý
                </Text>
              </TouchableOpacity>
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
