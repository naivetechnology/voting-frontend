import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';

const BASE_URL = `${API_BASE_URL}/votees`; // Update with your actual backend URL

export const fetchVotees = async () => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

export const fetchVoteeById = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`);
  return data;
};

export const createVotee = async (votee: {
  name: string;
  message: string;
  categories: string[];
}) => {
  const { data } = await axios.post(BASE_URL, votee);
  return data;
};
