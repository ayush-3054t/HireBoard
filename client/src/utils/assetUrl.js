import { API_BASE_URL } from '../api/axios';

export const assetUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `${API_BASE_URL}/${value.replace(/^\//, '')}`;
};
