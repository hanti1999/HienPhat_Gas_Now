import { View, ScrollView, Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import { generateOTP } from '@/utils/generateOTP';
import InputField from '@/components/InputField';
import OTPModal from '@/components/OTPModal';

const ResetPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | string[]>('');
  const [otp, setOtp] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const handleConfirm = () => {};

  const handleSendOtp = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView className='flex-1 bg-white'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <HeaderImage text='Lấy lại mật khẩu' />
          <View className='p-5'>
            <InputField
              label='Nhập số điện thoại cần lấy lại mật khẩu'
              placeholder='Nhập số điện thoại...'
              keyboardType='numeric'
              onChangeText={setPhoneNumber}
            />
            <CustomButton
              onPress={handleSendOtp}
              className='mt-5'
              title='Gửi mã xác nhận'
            />
            <OTPModal
              onClose={handleCloseModal}
              onConfirm={handleConfirm}
              onCodeChanged={setCode}
              modalVisible={modalVisible}
              phone={phoneNumber}
              loading={loading}
              code={code}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default ResetPassword;
