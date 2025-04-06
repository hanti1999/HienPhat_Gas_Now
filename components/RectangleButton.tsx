import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { ButtonProps } from '@/types/type';

const getBgVariantStyle = (variant: ButtonProps['bgVariant']) => {
  switch (variant) {
    case 'secondary':
      return 'bg-primary-blue';
    case 'danger':
      return 'bg-primary-red';
    case 'pink':
      return 'bg-primary-pink';
    case 'outline':
      return 'bg-transparent border-primary-pink border';
    case 'outline-blue':
      return 'bg-transparent border-[#0068ff] border';
    case 'disabled':
      return 'bg-[rgba(0 0 0 0.04)] border-[#d9d9d9] border';
    default:
      return 'bg-primary-pink';
  }
};

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
  switch (variant) {
    case 'primary':
      return 'text-[#fb77c5]';
    case 'secondary':
      return 'text-[#0068ff]';
    case 'danger':
      return 'text-white';
    case 'success':
      return 'text-green-100';
    case 'disabled':
      return 'text-[rgba(0 0 0 0.25)]';
    default:
      return 'text-white';
  }
};

const RectangleButton = ({
  onPress,
  title,
  bgVariant,
  className,
  loading,
  textVariant,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`rounded-lg flex-1 h-[60px] items-center justify-center ${getBgVariantStyle(
        bgVariant
      )} ${className}`}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <Text className={`text-[18px] ${getTextVariantStyle(textVariant)}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default RectangleButton;
