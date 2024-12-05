import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View className='flex-1 items-center justify-center p-5'>
      <Text className='text-xl font-semibold'>Trang này không tồn tại.</Text>
      <Link href='/(root)/(tabs)/home' className='mt-2 py-4'>
        <Text className='text-blue-500 underline text-lg'>
          Quan về màn hình chính!
        </Text>
      </Link>
    </View>
  );
}
