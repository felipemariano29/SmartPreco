import { env } from "@/env";
import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const AXIOS_INSTANCE = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const sessionToken = Cookies.get('__session')
  if (sessionToken) {
    config.headers.Authorization = `Bearer ${sessionToken}`
  }
  return config
})

export const axiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
  ): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
      ...config,
      ...options,
      cancelToken: source.token,
    }).then(({ data }: { data: T }) => data);
  
    // @ts-expect-error - Adding cancel method to Promise which TypeScript doesn't expect
    promise.cancel = () => {
      source.cancel('Query was cancelled');
    };
    return promise;
  };