import axios from '../api/axiosConfig.js';

export const getEquipmentList = async (userId) => {
  const response = await axiosInstance.get(`/equipment?userId=${userId}`);
  return response.data;
};

export const getEquipmentById = async (id) => {
  const response = await axiosInstance.get(`/equipment/${id}`);
  return response.data;
};

export const createEquipment = async (equipment) => {
  const response = await axiosInstance.post('/equipment', equipment);
  return response.data;
};

export const updateEquipment = async (id, equipment) => {
  const response = await axiosInstance.put(`/equipment/${id}`, equipment);
  return response.data;
};

export const deleteEquipment = async (id) => {
  await axiosInstance.delete(`/equipment/delete/${id}`);
};

export const resetSystem = async () => {
  try {
    const res = await axiosInstance.delete('/equipment/reset-all');
    return res.data;
  } catch (err) {
    console.error('RESET ERROR:', err.response || err);
    throw err;
  }
};
