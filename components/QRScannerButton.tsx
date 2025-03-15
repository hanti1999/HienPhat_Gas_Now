import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Pressable, Text, View } from 'react-native';
import { Modal, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// Chỉ dành cho nhân viên
const QRScannerButton = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [codeContent, setCodeContent] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)}>
        <MaterialIcons name='qr-code-scanner' size={30} color='black' />
      </Pressable>
      <TextInput
        value={codeContent}
        className='p-2 text-[16px] border rounded-lg mt-2'
        placeholder='giá trị nhận được khi quét mã'
        placeholderTextColor={'#999'}
      />
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(true);
        }}
      >
        <View className='flex-1 justify-center'>
          {!permission?.granted ? (
            <View className='bg-white flex-1'>
              <Text className='text-center text-lg'>
                Bạn cần cấp quyền truy cập camera
              </Text>
              <Button onPress={requestPermission} title='Cấp quyền' />
            </View>
          ) : (
            <CameraView
              active={modalVisible}
              className='flex-1'
              mute={true}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={(scanningResult) => {
                setCodeContent(scanningResult.data);
                closeModal;
              }}
              children={
                <View className='flex-1 relative'>
                  <Pressable onPress={closeModal} style={style.closeButton}>
                    <MaterialIcons name='close' size={24} color='white' />
                  </Pressable>
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default QRScannerButton;

const style = StyleSheet.create({
  closeButton: {
    backgroundColor: 'rgba( 0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    display: 'flex',
    borderRadius: 9999,
    height: 40,
    width: 40,
    left: 40,
    top: 40,
  },
});
