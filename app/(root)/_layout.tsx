import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='loading-screen' options={{ headerShown: false }} />
      <Stack.Screen name='product-info' options={{ headerShown: false }} />
      <Stack.Screen name='about' options={{ headerShown: false }} />
      <Stack.Screen name='edit-profile' options={{ headerShown: false }} />
      <Stack.Screen name='orders' options={{ headerShown: false }} />
      <Stack.Screen name='review' options={{ headerShown: false }} />
      <Stack.Screen name='wishlist' options={{ headerShown: false }} />
      <Stack.Screen name='no-product' options={{ headerShown: false }} />
      <Stack.Screen name='search-result' options={{ headerShown: false }} />
      <Stack.Screen name='product-by-brand' options={{ headerShown: false }} />
      <Stack.Screen
        name='product-by-category'
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default Layout;
