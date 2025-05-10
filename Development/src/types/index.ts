export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'threads';

export interface SocialMediaAccount {
  platform: SocialPlatform;
  connected: boolean;
  name?: string;
}

export interface Post {
  id: string;
  content: string;
  image?: string;
  platforms: SocialPlatform[];
  scheduledDate?: Date;
  published: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accounts: SocialMediaAccount[];
}