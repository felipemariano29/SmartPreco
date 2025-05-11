import { getClerkInstance } from "@clerk/clerk-expo";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
export const clerkInstance = getClerkInstance();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  async (config) => {
    if (clerkInstance.session) {
      const token = await clerkInstance.session.getToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;