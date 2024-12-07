import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import PasswordValidate from '@/components/PasswordValidate';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';

const Password = () => {
  const { token } = useLocalSearchParams();
  const [currentPass, setCurrentPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  const handleChangePass = () => {
    if (!validated) {
      Toast.show({ type: 'error', text1: 'Mật khẩu không hợp lệ' });
      return;
    }
  };

  const onTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]} className='bg-gray-100 flex-1'>
        <ScreenHeader text='Thay đổi mật khẩu' />
        <View className='py-2 px-3 mt-2 bg-white'>
          <InputField
            onChangeText={(text) => setCurrentPass(text)}
            value={currentPass}
            secureTextEntry={!showPassword}
            textContentType='password'
            icon={'lock'}
            label='Mật khẩu hiện tại'
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={onTogglePassword}
                color='gray'
                size={24}
              />
            }
          />
          <Link href={'/(root)/(tabs)/home'}>
            <Text className='text-blue-500 text-base'>Quên mật khẩu?</Text>
          </Link>
          <InputField
            onChangeText={(text) => setNewPass(text)}
            value={newPass}
            secureTextEntry={!showPassword}
            textContentType='password'
            icon={'lock'}
            label='Mật khẩu mới'
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={onTogglePassword}
                color='gray'
                size={24}
              />
            }
          />
          <InputField
            onChangeText={(text) => setConfirmPass(text)}
            value={confirmPass}
            secureTextEntry={!showPassword}
            textContentType='password'
            icon={'lock'}
            label='Xác nhận mật khẩu'
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={onTogglePassword}
                color='gray'
                size={24}
              />
            }
          />
          <PasswordValidate
            newPassword={newPass}
            confirmPassword={confirmPass}
            validationRules={[
              {
                key: 'MIN_LENGTH',
                ruleValue: 8,
                label: 'Phải trên 8 ký tự',
              },
              {
                key: 'MAX_LENGTH',
                ruleValue: 20,
                label: 'Tối đa 20 ký tự',
              },
              { key: 'PASSWORDS_MATCH', label: 'Mật khẩu trùng khớp' },
            ]}
            onPasswordValidateChange={(validatedBoolean) =>
              setValidated(validatedBoolean)
            }
          />

          <CustomButton
            className='my-5'
            title='Đổi mật khẩu'
            onPress={handleChangePass}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Password;
