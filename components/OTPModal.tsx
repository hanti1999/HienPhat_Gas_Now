import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text, Modal, StyleSheet } from 'react-native';
import React from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';

interface IProps {
  onCodeChanged: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  phone: string | string[];
  modalVisible: boolean;
  loading: boolean;
  code: string;
}

const OTPModal = (props: IProps) => {
  const {
    onCodeChanged,
    onConfirm,
    onClose,
    modalVisible,
    loading,
    phone,
    code,
  } = props;

  return (
    <Modal
      visible={modalVisible}
      animationType='fade'
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
        className='flex-1 items-center justify-center'
      >
        <View className='p-2 rounded-xl bg-white'>
          <Text className='text-center mt-4 text-[16px]'>
            Nhập OTP được gửi đến {phone} để tiếp tục
          </Text>
          <OTPInputView
            codeInputHighlightStyle={{ borderColor: '#fb77c5' }}
            codeInputFieldStyle={styles.codeInputFieldStyle}
            style={{ height: 100, width: '80%' }}
            onCodeChanged={onCodeChanged}
            autoFocusOnLoad={false}
            pinCount={6}
            code={code}
          />
          <View className='flex-row justify-evenly'>
            <TouchableOpacity
              className='rounded-full w-32 h-10 justify-center border-primary-pink border'
              onPress={onClose}
            >
              <Text className='text-center text-[16px]'>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='rounded-full w-32 h-10 justify-center bg-primary-pink border-primary-pink border'
              disabled={loading}
              onPress={onConfirm}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text className='text-center text-[16px] text-white'>
                  Xác minh
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OTPModal;

const styles = StyleSheet.create({
  codeInputFieldStyle: {
    borderRadius: 12,
    color: '#333',
    height: 50,
    fontSize: 16,
  },
});
