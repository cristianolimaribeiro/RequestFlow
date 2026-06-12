import api from './api';
import { User } from '../types/user';

export const userService = {
  async list(): Promise<User[]> {
    const { data } = await api.get('/users');
    return data;
  },
  async create(user: any): Promise<User> {
    const { data } = await api.post('/users', user);
    return data;
  },
  async update(id: number, user: any): Promise<User> {
    const { data } = await api.put(`/users/${id}`, user);
    return data;
  },
  async toggleActive(id: number): Promise<User> {
    const { data } = await api.patch(`/users/${id}/toggle-active`);
    return data;
  }
};
