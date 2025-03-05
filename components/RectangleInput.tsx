import { View, Text, Keyboard, TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='my-2 w-full'>
        {label && (
          <Text className={`font-medium mb-1.5 ${labelStyle}`}>{label}</Text>
        )}
        <View
          className={`flex flex-row px-3 justify-start items-center border rounded-lg border-gray-500 focus:border-primary-pink ${containerStyle}`}
        >
          {icon && (
            <AntDesign
              color='gray'
              name={icon}
              size={24}
              className={`${iconStyle}`}
            />
          )}
          <TextInput
            className={`p-2 text-[16px] flex-1 text-left ${inputStyle}`}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={'#999'}
            {...props}
          />
          {children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputField;
