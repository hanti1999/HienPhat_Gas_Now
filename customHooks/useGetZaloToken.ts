import { ZaloToken } from '@/types/type';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

const useFetch = (url: string) => {
  const [token, setToken] = useState<ZaloToken>({
    access_token: '',
    refresh_token: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(url);

        if (res.status === 200) {
          setToken({
            access_token: res.data.ztk_access_token,
            refresh_token: res.data.ztk_refresh_token,
          });
        } else {
          Toast.show({ type: 'error', text1: 'Lấy token không thành công' });
        }
      } catch (error) {
        console.error('Lấy token không thành công: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return {
    token,
    loading,
  };
};

export default useFetch;
