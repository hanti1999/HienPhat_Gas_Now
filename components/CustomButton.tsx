import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { ButtonProps } from '@/types/type';

const getBgVariantStyle = (variant: ButtonProps['bgVariant']) => {
  switch (variant) {
    case 'secondary':
      return 'bg-white';
    case 'danger':
      return 'bg-red-500';
    case 'success':
      return 'bg-green-500';
    case 'outline':
      return 'bg-transparent border-primary-pink border';
    default:
      return 'bg-primary-pink';
  }
};

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
  switch (variant) {
    case 'primary':
      return 'text-black';
    case 'secondary':
      return 'text-primary-pink';
    case 'danger':
      return 'text-red-100';
    case 'success':
      return 'text-green-100';
    default:
      return 'text-white';
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = 'primary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  className,
  loading = false,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full rounded-full p-3 flex flex-row justify-center items-center ${getBgVariantStyle(
        bgVariant
      )} ${className}`}
      {...props}
    >
      {IconLeft && IconLeft}
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <Text
          className={`text-lg font-semibold ${getTextVariantStyle(
            textVariant
          )}`}
        >
          {title}
        </Text>
      )}
      {IconRight && IconRight}
    </TouchableOpacity>
  );
};

export default CustomButton;
