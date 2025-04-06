import { View, Text, Modal, Dimensions } from 'react-native';
import React from 'react';
import RectangleButton from './RectangleButton';

interface IProps {
  onConfirm: () => void;
  onClose: () => void;
  text: string;
  modalVisible: boolean;
  loading?: boolean;
}

const ConfirmModal = (props: IProps) => {
  const { onConfirm, onClose, modalVisible, loading, text } = props;
  const width = Dimensions.get('window').width;

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View
        style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
        className='flex-1 items-center justify-center'
      >
        <View
          className='p-3 rounded-xl bg-white shadow-lg'
          style={{ width: width * 0.8 - 8 }}
        >
          <Text className='text-center my-4 text-lg'>{text}</Text>
          <View style={{ gap: 8 }} className='flex-row items-center'>
            <RectangleButton
              title='Hủy'
              bgVariant='outline'
              textVariant='primary'
              onPress={onClose}
            />
            <RectangleButton
              title='Đồng ý'
              loading={loading}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
