import { Pressable, View, Text, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { RootState } from '@/redux/store';
import openLink from '@/utils/openLink';

interface ITabIcon {
  icon1: any;
  icon2: any;
  focused: boolean;
}

const TabIcon = ({ icon1, icon2, focused }: ITabIcon) => (
  <Ionicons
    name={focused ? icon1 : icon2}
    size={26}
    color={focused ? '#fb77c5' : '#333'}
  />
);

const Layout = () => {
  const quantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const primaryPink = '#fb77c5';
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: primaryPink,
          tabBarInactiveTintColor: '#333',
          headerShown: false,
          tabBarStyle: {
            shadowColor: '#333',
            shadowOpacity: 0.1,
            shadowRadius: 5,
          },
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ focused }) => (
              <TabIcon icon1='home' icon2='home-outline' focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name='notification'
          options={{
            title: 'Thông báo',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon1='notifications'
                icon2='notifications-outline'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='call'
          options={{
            title: '',
            tabBarButton: () => (
              <View className='flex items-center justify-center  -top-4'>
                <Pressable
                  onPress={() => setModalVisible(true)}
                  className='items-center justify-center h-[50px] w-[50px] rounded-full bg-primary-pink'
                >
                  <Animatable.View
                    animation='pulse'
                    iterationCount='infinite'
                    duration={1000}
                    delay={2500}
                  >
                    <AntDesign name='customerservice' size={30} color='white' />
                  </Animatable.View>
                </Pressable>
                <Text className='text-[13px]'>Gọi gas</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name='cart'
          options={{
            title: 'Giỏ hàng',
            tabBarBadge: quantity,
            tabBarBadgeStyle: {
              color: 'white',
              backgroundColor: '#fb77c5',
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon icon1='cart' icon2='cart-outline' focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Tài khoản',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon1='person'
                icon2='person-outline'
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <Modal
        visible={modalVisible}
        animationType='fade'
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
          className='flex-1 items-center justify-end'
        >
          <View className='bg-white rounded-lg w-full p-2 pb-3.5'>
            <View className='flex-row justify-between items-center mb-2'>
              <Text className='text-left font-bold text-[18px]'>
                Chọn hình thức tư vấn
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name='close' size={26} color='black' />
              </TouchableOpacity>
            </View>
            <View className='flex' style={{ gap: 8 }}>
              <CustomButton
                IconLeft={
                  <AntDesign name='message1' size={20} color={primaryPink} />
                }
                title=' Nhắn Zalo (0975841582)'
                bgVariant='outline'
                textVariant='secondary'
                onPress={() => openLink(`https://zalo.me/0975841582`)}
              />
              <CustomButton
                IconLeft={
                  <AntDesign name='phone' size={20} color={primaryPink} />
                }
                bgVariant='outline'
                textVariant='secondary'
                title=' Gọi di động (0986573072)'
                onPress={() => openLink(`tel:0986573072`)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Layout;
