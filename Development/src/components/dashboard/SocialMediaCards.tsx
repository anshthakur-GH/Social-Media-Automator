import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { SocialMediaAccount, SocialPlatform } from '../../types';

interface SocialMediaCardsProps {
  accounts: SocialMediaAccount[];
  onConnect: (platform: SocialPlatform) => void;
  onRequestCredentials?: (platform: SocialPlatform) => void;
}

const SocialMediaCards: React.FC<SocialMediaCardsProps> = ({ accounts, onConnect, onRequestCredentials }) => {
  
  const platformConfig = {
    facebook: {
      name: 'Facebook',
      icon: <Facebook className="h-6 w-6" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      description: 'Connect to share posts to your Facebook page or profile.'
    },
    twitter: {
      name: 'X (Twitter)',
      icon: <Twitter className="h-6 w-6" />,
      color: 'text-black',
      bg: 'bg-gray-50',
      border: 'border-gray-100',
      description: 'Connect to share tweets to your X (Twitter) account.'
    },
    instagram: {
      name: 'Instagram',
      icon: <Instagram className="h-6 w-6" />,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      description: 'Connect to share images and videos to your Instagram.'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: <Linkedin className="h-6 w-6" />,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      description: 'Connect to share updates to your LinkedIn profile or page.'
    },
    threads: {
      name: 'Threads',
      icon: <Instagram className="h-6 w-6" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      description: 'Connect to share posts to your Threads account.'
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {accounts.map((account) => {
        const platform = platformConfig[account.platform];
        
        return (
          <Card 
            key={account.platform}
            className={`transition-all duration-200 ${platform.border} hover:shadow-md`}
          >
            <CardHeader className={`${platform.bg}`}>
              <div className="flex justify-between items-center">
                <div className={`${platform.color} p-2 rounded-md ${platform.bg}`}>
                  {platform.icon}
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${account.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {account.connected ? 'Connected' : 'Not connected'}
                </div>
              </div>
              <CardTitle>{platform.name}</CardTitle>
              <CardDescription>{platform.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-4">
              <Button 
                fullWidth
                variant={account.connected ? 'secondary' : 'primary'}
                onClick={() => {
                  if (!account.connected && onRequestCredentials) {
                    onRequestCredentials(account.platform);
                  } else {
                    onConnect(account.platform);
                  }
                }}
                leftIcon={account.connected ? <Check className="h-4 w-4" /> : null}
              >
                {account.connected ? 'Connected' : 'Connect'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default SocialMediaCards;