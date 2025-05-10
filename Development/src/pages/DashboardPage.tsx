import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import SocialMediaCards from '../components/dashboard/SocialMediaCards';
import PostCreationForm from '../components/dashboard/PostCreationForm';
import { User, SocialPlatform } from '../types';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  onConnectPlatform: (platform: SocialPlatform) => void;
  onPublishPost: (content: string, platforms: SocialPlatform[], scheduledDate?: Date, image?: File) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onLogout,
  onConnectPlatform,
  onPublishPost,
}) => {
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [credentials, setCredentials] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
  });
  const [error, setError] = useState('');

  const handleRequestCredentials = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setShowCredentialModal(true);
  };

  const getFieldsForPlatform = (platform: SocialPlatform | null) => {
    switch (platform) {
      case 'facebook':
        return { label1: 'Page Access Token', label2: 'Page ID' };
      case 'instagram':
        return { label1: 'Page Access Token', label2: 'Instagram Business Account ID' };
      case 'twitter':
        return {
          label1: 'API Key',
          label2: 'API Key Secret',
          label3: 'Access Token',
          label4: 'Access Token Secret',
        };
      case 'linkedin':
        return { label1: 'Client ID', label2: 'Primary Client Secret' };
      case 'threads':
        return { label1: 'Threads App ID', label2: 'Threads App Secret' };
      default:
        return { label1: 'Field 1', label2: 'Field 2' };
    }
  };

  const handleModalClose = () => {
    setShowCredentialModal(false);
    setSelectedPlatform(null);
    setCredentials({ field1: '', field2: '', field3: '', field4: '' });
    setError('');
  };

  const handleCredentialChange = (field: 'field1' | 'field2' | 'field3' | 'field4', value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.field1 || !credentials.field2 || (selectedPlatform === 'twitter' && (!credentials.field3 || !credentials.field4))) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const body = {
        platform: selectedPlatform,
        credentials:
          selectedPlatform === 'twitter'
            ? {
                field1: credentials.field1,
                field2: credentials.field2,
                field3: credentials.field3,
                field4: credentials.field4,
              }
            : {
                field1: credentials.field1,
                field2: credentials.field2,
              },
      };
      const response = await fetch('http://localhost:5000/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to connect.');
        return;
      }
      onConnectPlatform(selectedPlatform!);
      handleModalClose();
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect your social media accounts and start posting across platforms.
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Social Media Accounts</h2>
          <SocialMediaCards
            accounts={user.accounts}
            onConnect={onConnectPlatform}
            onRequestCredentials={handleRequestCredentials}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create Content</h2>
          <PostCreationForm onPublish={onPublishPost} />
        </div>
      </main>

      <Modal
        open={showCredentialModal}
        onClose={handleModalClose}
        title={selectedPlatform ? `Connect to ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}` : 'Connect'}
      >
        <form onSubmit={handleCredentialSubmit} className="space-y-4">
          <Input
            label={getFieldsForPlatform(selectedPlatform).label1}
            value={credentials.field1}
            onChange={e => handleCredentialChange('field1', e.target.value)}
            fullWidth
            required
          />
          <Input
            label={getFieldsForPlatform(selectedPlatform).label2}
            value={credentials.field2}
            onChange={e => handleCredentialChange('field2', e.target.value)}
            fullWidth
            required
          />
          {selectedPlatform === 'twitter' && (
            <>
              <Input
                label={getFieldsForPlatform(selectedPlatform).label3}
                value={credentials.field3}
                onChange={e => handleCredentialChange('field3', e.target.value)}
                fullWidth
                required
              />
              <Input
                label={getFieldsForPlatform(selectedPlatform).label4}
                value={credentials.field4}
                onChange={e => handleCredentialChange('field4', e.target.value)}
                fullWidth
                required
              />
            </>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" fullWidth>
            Connect
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;