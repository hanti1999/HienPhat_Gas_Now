import { StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CheckedLabel = () => {
  return (
    <View className='absolute top-0 left-0 right-0 bottom-0'>
      <View style={styles.square}>
        <AntDesign name='check' size={14} color='white' />
      </View>
      <View style={styles.triangle} className='top-0 right-4' />
      <View style={styles.triangle} className='top-4 right-0' />
    </View>
  );
};

export default CheckedLabel;

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderLeftColor: 'transparent',
    borderTopWidth: 16,
    borderTopColor: '#fb77c5',
    borderBottomWidth: 16,
    borderBottomColor: 'transparent',
    position: 'absolute',
  },
  square: {
    backgroundColor: '#fb77c5',
    position: 'absolute',
    borderTopRightRadius: 7,
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
