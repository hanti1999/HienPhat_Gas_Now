import { useState, useEffect, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import getNewToken from '@/utils/getNewToken';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: any;
  refetch: () => void;
  clearData: () => void;
}

function useGetData<T>(url: string, config?: any): UseFetchResult<T> {
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
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        Toast.show({ type: 'error', text1: 'Lỗi hệ thống!' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const clearData = useCallback(() => {
    setData(null);
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch, clearData };
}

export default useGetData;
