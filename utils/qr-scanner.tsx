import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';

const QrScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [codeContent, setCodeContent] = useState<string | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className='flex-1 justify-center'>
        <Text className='text-center pt-2.5'>
          Bạn cần cấp quyền truy cập camera
        </Text>
        <Button onPress={requestPermission} title='Cấp quyền' />
      </View>
    );
  }

  return (
    <View className='flex-1 justify-center'>
      <CameraView
        active={!codeContent}
        mute={true}
        className='flex-1'
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={(scanningResult) => {
          console.log(scanningResult.data);
          setCodeContent(scanningResult.data);
        }}
        children={
          <View className='flex-1 relative'>
            <Pressable
              onPress={() => router.back()}
              className='w-[40px] h-[40px] flex items-center justify-center rounded-full absolute'
              style={{
                backgroundColor: 'rgba( 0, 0, 0, 0.3)',
                top: 40,
                left: 40,
              }}
            >
              <FontAwesome6 name='xmark' size={24} color='white' />
            </Pressable>
          </View>
        }
      />
    </View>
  );
};

export default QrScanner;
