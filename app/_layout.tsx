import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
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
      <Toast visibilityTime={2000} topOffset={60} />
    </>
  );
}
