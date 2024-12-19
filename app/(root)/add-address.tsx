import { ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Modal, Switch, Text } from 'react-native';
import { View, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import { IAddress } from '@/types/type';
import { AntDesign } from '@expo/vector-icons';

interface Base {
  code: number;
  name: string;
}

interface Ward extends Base {}

interface District extends Base {
  wards: Ward;
}

interface Province extends Base {
  districts: District;
}

const AddAddress = () => {
  const { token } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const VN_PROVINCE_URL = 'https://provinces.open-api.vn/api';
  const [data, setData] = useState<IAddress>({
    address: {
      address_full: '',
      address_recipient_name: '',
      address_recipient_phonenumber: '',
      address_home: '',
      address_note: '',
    },
    is_default: false,
  });

  const toggleSwitch = () => {
    setData((prevState) => ({
      ...prevState,
      is_default: !data.is_default,
    }));
  };

  const handleAddAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(url, data, config);
      if (res.status === 201) {
        Toast.show({ text1: 'Thêm địa chỉ thành công' });
        router.back();
      } else {
        Toast.show({ type: 'error', text1: res.data.message });
        console.log(res.data.message);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Lỗi khi thêm địa chỉ' });
      console.log('Lỗi thêm địa chỉ: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    const res = await axios.get(`${VN_PROVINCE_URL}/p/`);
    setProvinces(res.data);
  };

  const fetchDistrict = async (provinceCode: number, name: string) => {
    const res = await axios.get(`${VN_PROVINCE_URL}/p/${provinceCode}?depth=2`);
    setProvinces([]);
    setSelectedProvince(name);
    setDistricts(res.data?.districts);
  };

  const fetchWard = async (districtCode: number, name: string) => {
    const res = await axios.get(`${VN_PROVINCE_URL}/d/${districtCode}?depth=2`);
    setDistricts([]);
    setSelectedDistrict(name);
    setWards(res.data?.wards);
  };

  const onCompleteSelectAddress = (name: string) => {
    setModalVisible(!modalVisible);
    setWards([]);
    setData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        address_full: `${name}, ${selectedDistrict}, ${selectedProvince}`,
      },
    }));
  };

  const onCloseModal = () => {
    setModalVisible(!modalVisible);
    setDistricts([]);
    setProvinces([]);
    setWards([]);
  };

  return (
    <SafeAreaView className='bg-white flex-1'>
      <ScrollView stickyHeaderIndices={[0]}>
        <ScreenHeader text='Thêm địa chỉ' />
        <View className='p-3 bg-white'>
          <RectangleInput
            label='Tên người nhận'
            value={data.address.address_recipient_name}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_recipient_name: text,
                },
              }))
            }
          />
          <RectangleInput
            label='Số điện thoại'
            keyboardType='numeric'
            value={data.address?.address_recipient_phonenumber}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_recipient_phonenumber: text,
                },
              }))
            }
          />
          <RectangleInput
            value={data.address?.address_full}
            label='Địa chỉ'
            multiline
            onFocus={() => {
              setModalVisible(!modalVisible);
              fetchProvinces();
            }}
          />
          <Modal
            animationType='slide'
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View
              style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
              className='flex-1 items-center justify-end'
            >
              <View className='bg-white rounded-tl-lg rounded-tr-lg w-full p-2 h-[80%]'>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-left font-bold mb-2 mr-1 text-lg'>
                    Chọn địa chỉ
                  </Text>

                  <TouchableOpacity onPress={onCloseModal}>
                    <AntDesign name='close' size={24} color='black' />
                  </TouchableOpacity>
                </View>
                <Text>Chọn tỉnh:</Text>
                <ScrollView showsHorizontalScrollIndicator={false}>
                  {provinces.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => fetchDistrict(item?.code, item?.name)}
                      className='border-b border-gray-200 p-3'
                      key={index}
                    >
                      <Text>{item?.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {districts?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => fetchWard(item?.code, item?.name)}
                      className='border-b border-gray-200 p-3'
                      key={index}
                    >
                      <Text>{item?.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {wards?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        onCompleteSelectAddress(item?.name);
                      }}
                      className='border-b border-gray-200 p-3'
                      key={index}
                    >
                      <Text>{item?.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
          <RectangleInput
            label='Số nhà'
            value={data.address?.address_home}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_home: text,
                },
              }))
            }
          />
          <RectangleInput
            label='Ghi chú (không bắt buộc)'
            value={data.address?.address_note}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_note: text,
                },
              }))
            }
          />
        </View>
        <View className='p-3 flex-row items-center justify-between border-y border-gray-200'>
          <Text>Đặt làm địa chỉ mặc định</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#fb77c5' }}
            onValueChange={toggleSwitch}
            value={data?.is_default}
          />
        </View>
        <View className='m-3'>
          <CustomButton
            onPress={handleAddAddress}
            disabled={loading}
            loading={loading}
            title='Thêm'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddress;
