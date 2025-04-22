import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void;
}

function useGetMultipleData<T extends any[]>(urls: string[]): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    try {
      const promises = urls.map((url) =>
        axios.get<T[number]>(url).then((res) => res.data)
      );
      const results = await Promise.all(promises);
      setData(results as T);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [urls]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

export default useGetMultipleData;
