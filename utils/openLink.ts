import Toast from 'react-native-toast-message';
import { Linking } from 'react-native';

const openLink = async (link: string) => {
  const canOpenURL: boolean = await Linking.canOpenURL(link);

  if (canOpenURL) {
    await Linking.openURL(link);
  } else {
    Toast.show({
      type: 'error',
      text1: 'Lỗi, vui lòng liên hệ bộ phận hỗ trợ',
    });
  }
};

export default openLink;
