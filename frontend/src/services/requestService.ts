import api from './api';
import { Request } from '../types/request';

export const requestService = {
  async listAll(): Promise<Request[]> {
    const { data } = await api.get('/requests');
    return data;
  },
  async listMy(): Promise<Request[]> {
    const { data } = await api.get('/requests/my');
    return data;
  },
  async getById(id: number): Promise<Request> {
    const { data } = await api.get(`/requests/${id}`);
    return data;
  },
  async create(request: any): Promise<Request> {
    const { data } = await api.post('/requests', request);
    return data;
  },
  async analyze(id: number): Promise<Request> {
    const { data } = await api.patch(`/requests/${id}/analyze`);
    return data;
  },
  async approve(id: number, comment?: string): Promise<Request> {
    const { data } = await api.patch(`/requests/${id}/approve`, { comment });
    return data;
  },
  async reject(id: number, comment: string): Promise<Request> {
    const { data } = await api.patch(`/requests/${id}/reject`, { comment });
    return data;
  },
  async cancel(id: number): Promise<Request> {
    const { data } = await api.patch(`/requests/${id}/cancel`);
    return data;
  },
  async complete(id: number): Promise<Request> {
    const { data } = await api.patch(`/requests/${id}/complete`);
    return data;
  },
  async uploadAttachment(id: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post(`/requests/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  getAttachmentUrl(requestId: number, attachmentId: number): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';
    return `${baseUrl}/requests/${requestId}/attachments/${attachmentId}`;
  }
};
