import React from 'react';
import { SocialPlatform, ThemeProps } from '../../types';
import Button from '../ui/Button';

interface SocialMediaCardsProps extends ThemeProps {
  accounts: { platform: SocialPlatform; connected: boolean }[];
  onConnect: (platform: SocialPlatform) => void;
  onRequestCredentials: (platform: SocialPlatform) => void;
}

const SocialMediaCards: React.FC<SocialMediaCardsProps> = ({
  accounts,
  onConnect,
  onRequestCredentials,
  isDarkMode,
}) => {
  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return '📘';
      case 'twitter':
        return '🐦';
      case 'instagram':
        return '📸';
      case 'linkedin':
        return '💼';
      case 'threads':
        return '🧵';
      default:
        return '🔗';
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'twitter':
        return 'bg-sky-500 dark:bg-sky-600';
      case 'instagram':
        return 'bg-pink-500 dark:bg-pink-600';
      case 'linkedin':
        return 'bg-blue-700 dark:bg-blue-800';
      case 'threads':
        return 'bg-gray-500 dark:bg-gray-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <div
          key={account.platform}
          className={`relative rounded-lg border ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          } p-6 shadow-sm transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${getPlatformColor(
                  account.platform
                )} text-white`}
              >
                <span className="text-xl">{getPlatformIcon(account.platform)}</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {account.connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button
              onClick={() =>
                account.connected
                  ? onConnect(account.platform)
                  : onRequestCredentials(account.platform)
              }
              variant={account.connected ? 'outline' : 'primary'}
              className={account.connected ? 'dark:border-gray-700 dark:text-white dark:hover:bg-gray-800' : ''}
            >
              {account.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialMediaCards;