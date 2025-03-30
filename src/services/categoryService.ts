import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';

export const getCategories = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/categories`);
  return data;
};
