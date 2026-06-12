import api from './api';
import { Category } from '../types/category';

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await api.get('/categories');
    return data;
  },
  async create(category: any): Promise<Category> {
    const { data } = await api.post('/categories', category);
    return data;
  },
  async update(id: number, category: any): Promise<Category> {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  },
  async toggleActive(id: number): Promise<Category> {
    const { data } = await api.patch(`/categories/${id}/toggle-active`);
    return data;
  }
};
