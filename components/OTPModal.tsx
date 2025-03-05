import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import React from 'react';

interface IProps {
  onCodeChanged: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  phone: string | string[];
  modalVisible: boolean;
  loading: boolean;
}

const OTPModal = (props: IProps) => {
  const { onCodeChanged, onConfirm, onClose, modalVisible, loading, phone } =
    props;

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
          <OtpInput
            numberOfDigits={6}
            focusColor={'#fb77c5'}
            autoFocus={false}
            onTextChange={onCodeChanged}
            type='numeric'
            theme={{
              pinCodeTextStyle: { fontSize: 20 },
              containerStyle: { marginTop: 10, marginBottom: 10 },
            }}
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
