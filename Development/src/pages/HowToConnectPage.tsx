import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const platforms = [
  {
    name: 'Facebook Page',
    icon: <Facebook className="h-8 w-8 text-blue-600" />,
    color: 'border-blue-200 bg-blue-50',
    steps: [
      'Go to the Meta for Developers site: https://developers.facebook.com/',
      'Log in and click "My Apps" > "Create App". Choose "Business" as the app type.',
      'Fill in the required details and create the app.',
      'In your app dashboard, click "Add Product" and select "Facebook Login". Also add "Pages API".',
      'In the left sidebar, go to "App Review > Permissions and Features". Add and request the following permissions: pages_manage_posts, pages_read_engagement, pages_show_list, public_profile.',
      'Go to "Settings > Basic" to find your App ID and App Secret (for reference, not for posting).',
      'Go to the Graph API Explorer: https://developers.facebook.com/tools/explorer/',
      'Select your app from the dropdown. Click "Get User Access Token" and check the permissions listed above. Generate the token and log in as the page admin.',
      'In the Graph API Explorer, run the query: me/accounts',
      'Find your page in the response. Copy the "access_token" (this is your Page Access Token) and the "id" (this is your Page ID).',
      'Use the Page Access Token and Page ID in the connect modal.'
    ]
  },
  {
    name: 'Instagram Business',
    icon: <Instagram className="h-8 w-8 text-pink-500" />,
    color: 'border-pink-200 bg-pink-50',
    steps: [
      'Ensure your Instagram account is a Business Account and is connected to a Facebook Page you manage.',
      'Follow the Facebook steps above to get a Page Access Token with instagram_basic and instagram_content_publish permissions.',
      'In the Graph API Explorer, run the query: {page-id}?fields=instagram_business_account (replace {page-id} with your Facebook Page ID).',
      'Copy the "id" from the "instagram_business_account" field in the response. This is your Instagram Business Account ID.',
      'Use the Page Access Token and Instagram Business Account ID in the connect modal.'
    ]
  },
  {
    name: 'X (Twitter)',
    icon: <Twitter className="h-8 w-8 text-black" />,
    color: 'border-gray-200 bg-gray-50',
    steps: [
      'Go to the Twitter Developer Portal: https://developer.twitter.com/en/portal/dashboard',
      'Log in and click "Create Project" and then "Create App".',
      'Fill in the required details. Once the app is created, go to the "Keys and Tokens" tab.',
      'Generate your API Key and API Key Secret. (You may also need a Bearer Token for some endpoints.)',
      'For posting as a user, set up OAuth 1.0a or OAuth 2.0. You will need to generate Access Tokens for your user account.',
      'Use the API Key and API Key Secret (and Access Token/Secret if required) in the connect modal.'
    ]
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="h-8 w-8 text-blue-700" />,
    color: 'border-blue-300 bg-blue-50',
    steps: [
      'Go to LinkedIn Developers: https://www.linkedin.com/developers/apps',
      'Log in and click "Create app". Fill in the required details.',
      'Once the app is created, copy your Client ID and Client Secret.',
      'In the app settings, set up OAuth 2.0. Add a redirect URL (e.g., http://localhost:3000/ for local testing).',
      'Request the w_member_social permission for posting.',
      'Use the Client ID and Primary Client Secret in the connect modal. You will need to complete the OAuth flow to get an Access Token for posting.'
    ]
  }
];

const HowToConnectPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">How to Connect Your Social Media Accounts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {platforms.map((platform) => (
          <div key={platform.name} className={`rounded-xl shadow border ${platform.color} p-6 flex flex-col`}>
            <div className="flex items-center mb-4 space-x-3">
              {platform.icon}
              <h2 className="text-xl font-semibold text-gray-800">{platform.name}</h2>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 pl-2">
              {platform.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToConnectPage; 