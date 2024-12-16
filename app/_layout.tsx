import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import openLink from '@/utils/openLink';
import { store } from '@/redux/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoItalic: require('../assets/fonts/Roboto-Italic.ttf'),
    RobotoThin: require('../assets/fonts/Roboto-Thin.ttf'),
    RobotoThinItalic: require('../assets/fonts/Roboto-ThinItalic.ttf'),
    RobotoBlack: require('../assets/fonts/Roboto-Black.ttf'),
    RobotoBlackItalic: require('../assets/fonts/Roboto-BlackItalic.ttf'),
    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
    RobotoBoldItalic: require('../assets/fonts/Roboto-BoldItalic.ttf'),
    RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
    RobotoLightItalic: require('../assets/fonts/Roboto-LightItalic.ttf'),
    RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf'),
    RobotoMediumItalic: require('../assets/fonts/Roboto-MediumItalic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Provider store={store}>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          <Stack.Screen name='(root)' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' options={{ headerShown: false }} />
        </Stack>
      </Provider>
      <FloatButton />
      <Toast visibilityTime={2000} topOffset={60} />
    </>
  );
}

const FloatButton = () => {
  return (
    <View style={styles.floatButtonContainer}>
      <TouchableOpacity
        onPress={() => openLink(`https://zalo.me/1224689593861452828`)}
        className='w-full h-full rounded-full flex items-center justify-center'
      >
        <AntDesign name='message1' size={20} color='white' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS == 'android' ? 82 : 135,
    right: 8,
    width: 45,
    height: 45,
    borderRadius: 9999,
    backgroundColor: 'rgba( 255, 0, 0, 0.6)',
  },
});
