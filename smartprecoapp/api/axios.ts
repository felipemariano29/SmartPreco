import { getClerkInstance } from "@clerk/clerk-expo";
import axios, { type AxiosRequestConfig } from "axios";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
export const clerkInstance = getClerkInstance();

console.log("API URL:", EXPO_PUBLIC_API_URL);

const axiosClient = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    if (clerkInstance.session) {
      const token = await clerkInstance.session.getToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const axiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = axiosClient({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then((res) => res.data as T);

  (promise as any).cancel = () => source.cancel("Query was cancelled");
  return promise;
};

export default axiosClient;
