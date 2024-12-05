import Toast from 'react-native-toast-message';
import { Linking } from 'react-native';

const openLink = async (link: string) => {
  const canOpenURL = await Linking.canOpenURL(link);

  if (canOpenURL) {
    await Linking.openURL(link);
  } else {
    Toast.show({ type: 'error', text1: 'Không thể mở URL' });
  }
};

export default openLink;
