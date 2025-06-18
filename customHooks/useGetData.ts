import { useState, useEffect, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import axios, { AxiosError } from 'axios';
import getNewToken from '@/utils/getNewToken';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void;
  clearData: () => void;
}

function useGetData<T>(
  url: string,
  config?: any,
  autoFetch = true
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(url, config);
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message);
      if (err.response.status === 401) {
        console.log('loi 401'); // remove log
        await getNewToken();
      } else {
        Toast.show({ type: 'error', text1: 'Lỗi hệ thống!' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [url]);

  const clearData = useCallback(() => {
    setData(null);
  }, [url]);

  return { data, loading, error, refetch: fetchData, clearData };
}

export default useGetData;
