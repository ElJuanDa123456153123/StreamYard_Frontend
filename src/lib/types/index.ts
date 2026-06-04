// User Types
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

// Stream Types
export enum StreamStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

export enum StreamPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

export enum StreamPlatform {
  YOUTUBE = 'youtube',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  TWITCH = 'twitch',
  CUSTOM = 'custom',
}

export interface StreamSettings {
  enableChat: boolean;
  enableRecording: boolean;
  enableScreenShare: boolean;
  autoStart: boolean;
}

export interface Stream {
  id: string;
  title: string;
  description?: string;
  privacy: StreamPrivacy;
  status: StreamStatus;
  platform: StreamPlatform[];
  thumbnailUrl?: string;
  maxParticipants: number;
  streamSettings?: StreamSettings;
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  duration?: string;
  viewerCount: number;
  isRecorded: boolean;
  recordingUrl?: string;
  ownerId: string;
  owner?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface StreamList {
  id: string;
  title: string;
  description?: string;
  privacy: StreamPrivacy;
  status: StreamStatus;
  thumbnailUrl?: string;
  scheduledFor?: string;
  viewerCount: number;
  ownerId: string;
  createdAt: string;
}

export interface StreamStats {
  totalStreams: number;
  activeStreams: number;
  totalViewers: number;
  averageDuration: number;
}

// Session Types
export enum SessionStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  ENDED = 'ended',
  KICKED = 'kicked',
}

export enum SessionRole {
  HOST = 'host',
  GUEST = 'guest',
  PRODUCER = 'producer',
}

export interface Session {
  id: string;
  status: SessionStatus;
  role: SessionRole;
  metadata?: {
    browser?: string;
    os?: string;
    deviceType?: string;
    ip?: string;
    location?: {
      country?: string;
      city?: string;
    };
  };
  joinedAt?: string;
  leftAt?: string;
  duration?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionQuality?: {
    bitrate?: number;
    fps?: number;
    resolution?: string;
    packetLoss?: number;
  };
  userId: string;
  user?: UserProfile;
  streamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionList {
  id: string;
  status: SessionStatus;
  role: SessionRole;
  joinedAt?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Auth Types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
