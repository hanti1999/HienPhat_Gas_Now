import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='flex-1 items-center justify-center p-5'>
        <Text>Trang này không tồn tại.</Text>
        <Link href='/(root)/(tabs)/home' className='mt-4 py-4'>
          <Text>Quan về màn hình chính!</Text>
        </Link>
      </View>
    </>
  );
}
