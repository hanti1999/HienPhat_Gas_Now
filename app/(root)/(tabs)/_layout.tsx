import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ITabIcon } from '@/types/type';

const TabIcon = ({ icon1, icon2, focused }: ITabIcon) => (
  <Ionicons
    name={focused ? icon1 : icon2}
    size={26}
    color={focused ? '#fb77c5' : '#333'}
  />
);

const Layout = () => {
  const primaryPink = '#fb77c5';
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryPink,
        tabBarInactiveTintColor: '#333',
        tabBarStyle: {
          shadowColor: '#333',
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Trang chủ',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon1='home' icon2='home-outline' focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='notification'
        options={{
          title: 'Thông báo',
          headerShown: false,
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
        name='cart'
        options={{
          title: 'Giỏ hàng',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon1='cart' icon2='cart-outline' focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Hồ sơ',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon1='person' icon2='person-outline' focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
