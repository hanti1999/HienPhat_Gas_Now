import { useState, useEffect } from 'react';
import axios from 'axios';
import { ZaloToken } from '@/types/type';

const useFetch = (url?: string) => {
  const [zaloToken, setToken] = useState<ZaloToken>({
    access_token: '',
    refresh_token: '',
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null | unknown>(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API}/zalo-tokens/${process.env.EXPO_PUBLIC_ZALO_ID}`
      );

      if (res.status === 200) {
        setToken({
          access_token: res.data.ztk_access_token,
          refresh_token: res.data.ztk_refresh_token,
        });
      } else {
        setError(res.data?.error);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return {
    zaloToken,
    isLoading,
    error,
    refetch,
  };
};

export default useFetch;
