import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { logout } from '@/redux/slices/authSlice';

const signOut = () => {
  const dispatch = useDispatch();
  dispatch(logout());
  router.reload();
  Toast.show({ type: 'info', text1: 'Phiên đăng nhập đã hết hạn' });
};

export default signOut;
