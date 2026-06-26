// @ts-nocheck
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const sendOtp = async (mobileNum: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/send-otp`, { mobileNum });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const verifyOtp = async (mobileNum: string, otpVal: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, { mobileNum, otpVal });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getLoads = async () => {
  try {
    const response = await axios.get(`${API_URL}/loads`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const createLoad = async (loadData: any) => {
  try {
    const response = await axios.post(`${API_URL}/loads`, loadData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
