import api from './api';

export const dashboardService = {
  async getStats(): Promise<any> {
    const { data } = await api.get('/dashboard');
    return data;
  }
};
