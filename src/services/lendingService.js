import axiosInstance from '../api/axiosConfig.js';

export const getLendingList = async (userId) => {
  const response = await axiosInstance.get(`/lending?userId=${userId}`);
  return response.data;
};

export const issueEquipment = async (payload) => {
  const response = await axiosInstance.post('/lending/issue', payload);
  return response.data;
};

export const returnEquipment = async (id) => {
  const response = await axiosInstance.put(`/lending/return/${id}`);
  return response.data;
};
