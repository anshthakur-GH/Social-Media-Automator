export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'threads';

export interface SocialAccount {
  platform: SocialPlatform;
  connected: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  accounts: SocialAccount[];
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}