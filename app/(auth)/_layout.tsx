import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name='set-new-password' options={{ headerShown: false }} />
      <Stack.Screen name='reset-password' options={{ headerShown: false }} />
      <Stack.Screen name='welcome' options={{ headerShown: false }} />
      <Stack.Screen name='sign-up' options={{ headerShown: false }} />
      <Stack.Screen name='sign-in' options={{ headerShown: false }} />
      <Stack.Screen name='verify' options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
