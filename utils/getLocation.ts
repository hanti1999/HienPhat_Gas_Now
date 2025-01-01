import Toast from 'react-native-toast-message';
import * as Location from 'expo-location';

const handleGetLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Toast.show({ type: 'info', text1: 'Quyền truy cập vị trí bị từ chối' });
    return '';
  }

  let currentLocation = await Location.getCurrentPositionAsync({});

  let reverseGeocode = await Location.reverseGeocodeAsync({
    longitude: currentLocation.coords.longitude,
    latitude: currentLocation.coords.latitude,
  });

  if (reverseGeocode[0]?.formattedAddress === undefined) {
    return `${reverseGeocode[0]?.name}, ${reverseGeocode[0]?.street}, ${reverseGeocode[0]?.subregion}, ${reverseGeocode[0]?.region}`;
  } else {
    return `${reverseGeocode[0]?.formattedAddress}`;
  }
};

export default handleGetLocation;
