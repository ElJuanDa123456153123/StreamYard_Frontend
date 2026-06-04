import api from './api';
import { Session, SessionList, CreateSessionDto, UpdateSessionDto } from '../types';

export interface CreateSessionDto {
  role: string;
  metadata?: {
    browser?: string;
    os?: string;
    deviceType?: string;
    ip?: string;
  };
}

export const sessionsService = {
  async create(streamId: string, sessionData: CreateSessionDto): Promise<Session> {
    const response = await api.post(`/sessions/streams/${streamId}`, sessionData);
    return response.data;
  },

  async findAll(): Promise<SessionList[]> {
    const response = await api.get('/sessions');
    return response.data;
  },

  async findByStream(streamId: string): Promise<SessionList[]> {
    const response = await api.get(`/sessions/stream/${streamId}`);
    return response.data;
  },

  async findActiveByStream(streamId: string): Promise<SessionList[]> {
    const response = await api.get(`/sessions/stream/${streamId}/active`);
    return response.data;
  },

  async getActiveCount(streamId: string): Promise<number> {
    const response = await api.get(`/sessions/stream/${streamId}/count`);
    return response.data.count;
  },

  async findMy(): Promise<SessionList[]> {
    const response = await api.get('/sessions/my');
    return response.data;
  },

  async findById(id: string): Promise<Session> {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  async update(id: string, sessionData: UpdateSessionDto): Promise<Session> {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  },

  async join(id: string): Promise<Session> {
    const response = await api.post(`/sessions/${id}/join`);
    return response.data;
  },

  async leave(id: string): Promise<Session> {
    const response = await api.post(`/sessions/${id}/leave`);
    return response.data;
  },

  async kick(sessionId: string, streamId: string): Promise<void> {
    await api.post(`/sessions/${sessionId}/kick`, null, {
      params: { streamId },
    });
  },

  async endAll(streamId: string): Promise<void> {
    await api.post(`/sessions/streams/${streamId}/end-all`);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/sessions/${id}`);
  },
};
