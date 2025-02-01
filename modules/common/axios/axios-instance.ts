import axios from 'axios';

export const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  timeout: 8000,
});

export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
});
