import { TextInputProps, TouchableOpacityProps } from 'react-native';

declare interface ProfileType {
  account: {
    account_id: string;
    account_phonenumber: string;
    account_email: string;
  };
  user: {
    user_fullname: string;
    user_img_url: string;
  };
  address: {
    address_full: string;
  };
}

declare interface ZaloToken {
  access_token: string;
  refresh_token: string;
}

declare interface SigninData {
  phonenumber: string;
  password: string;
}

declare interface SignupData {
  user_fullname: string;
  phonenumber: string;
  address_detail: string;
  password: string;
  confirmPass: string;
}

declare interface CartType {
  cartItems: Array<{
    id: string;
    title: string;
    productImg: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  totalQuantity: number;
}

declare interface AuthType {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiry: string | null;
  refreshTokenExpiry: string | null;
}

declare interface ITabIcon {
  icon1: any;
  icon2: any;
  focused: boolean;
}

declare interface Product {
  _id: string;
  title: string;
  image: string;
  discount: number;
  price: number;
  sold: number;
  brand: {
    _id: string;
    name: string;
    description: string;
    image: string;
  };
  category: {
    _id: string;
    name: string;
    description: string;
    image: string;
  };
  carouselImages: string[];
  features: string[];
  description: string[];
  inStock: boolean;
  reviews: [
    {
      _id: string;
      name: string;
      comment: string;
      rating: number;
      productRating: number;
      serviceRating: number;
      createAt: Date;
    }
  ];
}

declare interface User {
  name: string;
  phoneNumber: string;
  password: string;
  address: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  bgVariant?: 'primary' | 'outline-blue' | 'danger' | 'outline' | 'success';
  textVariant?: 'primary' | 'default' | 'secondary' | 'danger' | 'success';
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  loading?: boolean;
}

declare interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  children?: React.ReactNode;
}

declare type PossibleRuleType =
  | 'MIN_LENGTH'
  | 'MAX_LENGTH'
  | 'SPECIAL_CHARS'
  | 'NUMERIC'
  | 'UPPERCASE_LETTER'
  | 'LOWERCASE_LETTER'
  | 'PASSWORDS_MATCH';

declare type RuleType = {
  key: PossibleRuleType;
  label?: string;
  ruleValue?: number;
};

declare interface Driver {
  driver_id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
}

declare interface MarkerData {
  latitude: number;
  longitude: number;
  id: number;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  first_name: string;
  last_name: string;
  time?: number;
  price?: string;
}

declare interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: number | null;
  onMapReady?: () => void;
}

declare interface Ride {
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: number;
  fare_price: number;
  payment_status: string;
  driver_id: number;
  user_email: string;
  created_at: string;
  driver: {
    first_name: string;
    last_name: string;
    car_seats: number;
  };
}

declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface PaymentProps {
  fullName: string;
  email: string;
  amount: string;
  driverId: number;
  rideTime: number;
}

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}

declare interface DriverCardProps {
  item: MarkerData;
  selected: number;
  setSelected: () => void;
}
