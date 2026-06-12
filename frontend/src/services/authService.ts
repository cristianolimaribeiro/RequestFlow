import api from './api';
import { AuthResponse } from '../types/auth';

export const authService = {
  async login(credentials: any): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  }
};
