import { TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { InputFieldProps } from '@/types/type';
import { AntDesign } from '@expo/vector-icons';

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  children,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='my-2 w-full'>
          {label && (
            <Text className={`text-lg font-RobotoMedium mb-1.5 ${labelStyle}`}>
              {label}
            </Text>
          )}
          <View
            className={`flex flex-row px-4 justify-start items-center border bg-gray-50 rounded-full border-gray-300 focus:border-primary-pink ${containerStyle}`}
          >
            {icon && (
              <View>
                <AntDesign
                  name={icon}
                  size={24}
                  color='gray'
                  className={`${iconStyle}`}
                />
              </View>
            )}
            <TextInput
              className={`p-4 font-RobotoMedium text-[16px] flex-1 text-left ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              placeholderTextColor={'#999'}
              {...props}
            />
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
