export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'threads';

export interface SocialAccount {
  platform: SocialPlatform;
  connected: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  accounts: SocialAccount[];
}