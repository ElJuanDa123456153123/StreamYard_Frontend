import api from './api';
import { Stream, StreamList, StreamStats, CreateStreamDto, UpdateStreamDto, StreamStatus } from '../types';

export interface CreateStreamDto {
  title: string;
  description?: string;
  privacy?: string;
  platform?: string[];
  thumbnailUrl?: string;
  maxParticipants?: number;
  streamSettings?: {
    enableChat: boolean;
    enableRecording: boolean;
    enableScreenShare: boolean;
    autoStart: boolean;
  };
  scheduledFor?: string;
}

export const streamsService = {
  async create(streamData: CreateStreamDto): Promise<Stream> {
    const response = await api.post('/streams', streamData);
    return response.data;
  },

  async findAll(): Promise<StreamList[]> {
    const response = await api.get('/streams');
    return response.data;
  },

  async findPublic(limit?: number): Promise<StreamList[]> {
    const params = limit ? { limit } : {};
    const response = await api.get('/streams/public', { params });
    return response.data;
  },

  async findLive(): Promise<StreamList[]> {
    const response = await api.get('/streams/live');
    return response.data;
  },

  async findScheduled(): Promise<StreamList[]> {
    const response = await api.get('/streams/scheduled');
    return response.data;
  },

  async getStats(): Promise<StreamStats> {
    const response = await api.get('/streams/stats');
    return response.data;
  },

  async findMy(): Promise<StreamList[]> {
    const response = await api.get('/streams/my');
    return response.data;
  },

  async findById(id: string): Promise<Stream> {
    const response = await api.get(`/streams/${id}`);
    return response.data;
  },

  async update(id: string, streamData: UpdateStreamDto): Promise<Stream> {
    const response = await api.put(`/streams/${id}`, streamData);
    return response.data;
  },

  async updateStatus(id: string, status: StreamStatus): Promise<Stream> {
    const response = await api.put(`/streams/${id}/status`, { status });
    return response.data;
  },

  async incrementViewerCount(id: string): Promise<void> {
    await api.post(`/streams/${id}/viewers`);
  },

  async decrementViewerCount(id: string): Promise<void> {
    await api.delete(`/streams/${id}/viewers`);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/streams/${id}`);
  },
};
