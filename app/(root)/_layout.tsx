import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name='update-password' options={{ headerShown: false }} />
      <Stack.Screen name='loading-screen' options={{ headerShown: false }} />
      <Stack.Screen name='update-address' options={{ headerShown: false }} />
      <Stack.Screen name='product-filter' options={{ headerShown: false }} />
      <Stack.Screen name='privacy-policy' options={{ headerShown: false }} />
      <Stack.Screen name='search-result' options={{ headerShown: false }} />
      <Stack.Screen name='product-info' options={{ headerShown: false }} />
      <Stack.Screen name='update-name' options={{ headerShown: false }} />
      <Stack.Screen name='add-address' options={{ headerShown: false }} />
      <Stack.Screen name='no-product' options={{ headerShown: false }} />
      <Stack.Screen name='user-info' options={{ headerShown: false }} />
      <Stack.Screen name='about-app' options={{ headerShown: false }} />
      <Stack.Screen name='wishlist' options={{ headerShown: false }} />
      <Stack.Screen name='checkout' options={{ headerShown: false }} />
      <Stack.Screen name='address' options={{ headerShown: false }} />
      <Stack.Screen name='account' options={{ headerShown: false }} />
      <Stack.Screen name='qr-code' options={{ headerShown: false }} />
      <Stack.Screen name='review' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='orders' options={{ headerShown: false }} />
      <Stack.Screen name='about' options={{ headerShown: false }} />
      <Stack.Screen name='sale' options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
