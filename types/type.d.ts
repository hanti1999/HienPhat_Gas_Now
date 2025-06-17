import { TextInputProps, TouchableOpacityProps } from 'react-native';
declare interface IBanner {
  banner_id: string;
  banner_img_url: string;
  product_id: string[];
  banner_type: 'main' | 'sub';
}

declare interface IBrand {
  brand_id: string;
  brand_name: string;
  brand_img_url: string;
  brand_des: null | string;
}

declare interface ICategory {
  category_id: string;
  category_name: string;
  category_img_url: string;
  category_des: null | string;
}

declare interface Base {
  code: number;
  name: string;
}

declare interface Ward extends Base {}

declare interface District extends Base {
  wards: Ward;
}

declare interface Province extends Base {
  districts: District;
}

declare interface IOrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  product_quantity: number;
  unit_price: number;
  total_price: number;
}

declare interface IOrder {
  order_id: string;
  total_order_price: number;
  created_at: string;
  points_earned: number;
  points_used: number;
  order_status: string;
  is_rated: boolean;
  items: IOrderItem[];
}

declare interface IAddress {
  address: {
    address_full: string;
    address_home: string;
    address_id?: string;
    address_note: string;
    address_recipient_name: string;
    address_recipient_phonenumber: string;
  };
  is_default?: boolean;
}

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
  points: {
    total_points: number;
  };
}

declare interface ZaloToken {
  access_token: string;
  refresh_token: string;
}

declare interface AuthType {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiry: string | null;
}

declare interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
}

declare interface CartItem {
  id: string;
  title: string;
  productImg: string;
  price: number;
  oldPrice: number;
  quantity: number;
  totalPrice: number;
}

declare interface CartType {
  cartItems: CartItem[];
  totalAmount: number;
  totalDiscount: number;
  totalQuantity: number;
}

declare interface Review {
  review_id: string;
  review_comment: string;
  review_rating: string;
  review_productrating: number;
  review_servicerating: number;
  user: {
    user_fullname: string;
    user_id: string;
    user_img_url: string;
  };
}

declare interface Product {
  brand_id: string;
  category_id: string;
  final_price: number;
  product_discount: number;
  product_id: string;
  product_image_url: string;
  product_instock: boolean;
  product_name: string;
  product_price: number;
  product_sold: number;
}

declare interface User {
  name: string;
  phoneNumber: string;
  password: string;
  address: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  bgVariant?:
    | 'primary'
    | 'secondary'
    | 'outline-blue'
    | 'danger'
    | 'outline'
    | 'pink'
    | 'disabled';
  textVariant?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'disabled';
  IconLeft?: any;
  IconRight?: any;
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
