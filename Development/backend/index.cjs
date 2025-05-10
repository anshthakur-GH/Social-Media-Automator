require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { TwitterApi } = require('twitter-api-v2');

const app = express();
const PORT = 5000;

// LinkedIn OAuth configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = 'http://localhost:3000/linkedin-callback';

app.use(cors());
app.use(bodyParser.json());

// In-memory store for connected platforms and credentials (for demo only)
const userConnections = {};

// LinkedIn OAuth endpoints
app.get('/api/linkedin/auth', (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${LINKEDIN_REDIRECT_URI}&scope=w_member_social`;
  res.json({ authUrl });
});

app.post('/api/linkedin/callback', async (req, res) => {
  const { code } = req.body;
  try {
    console.log('Starting LinkedIn OAuth callback with code:', code);
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: LINKEDIN_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('LinkedIn token response:', tokenData);

    if (tokenData.error) {
      console.error('LinkedIn token error:', tokenData);
      throw new Error(tokenData.error_description || 'Failed to get access token');
    }

    // Get user profile to verify connection
    console.log('Fetching LinkedIn profile with token:', tokenData.access_token);
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const profileData = await profileResponse.json();
    console.log('LinkedIn profile response:', profileData);
    
    if (!profileResponse.ok) {
      console.error('LinkedIn profile error:', profileData);
      throw new Error(profileData.message || 'Failed to get profile');
    }

    // Store the connection with expiration time
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    userConnections['linkedin'] = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      expiresAt: expiresAt,
      userId: profileData.id,
    };

    console.log('LinkedIn connection stored successfully:', {
      userId: profileData.id,
      expiresAt: new Date(expiresAt).toISOString()
    });

    res.json({ 
      success: true, 
      message: 'LinkedIn connected successfully',
      profile: profileData
    });
  } catch (error) {
    console.error('LinkedIn connection error:', {
      message: error.message,
      stack: error.stack 
    });
    res.status(500).json({ 
      error: 'Failed to connect to LinkedIn',
      details: error.message 
    });
  }
});

// Function to get valid LinkedIn token
async function getValidLinkedInToken(platform) {
  console.log('Getting valid LinkedIn token');
  const connection = userConnections[platform];
  if (!connection) {
    console.error('No LinkedIn connection found');
    throw new Error('Not connected to LinkedIn');
  }

  // Verify the token is still valid by making a test request
  try {
    const testResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${connection.accessToken}`,
      },
    });

    if (!testResponse.ok) {
      console.log('Token validation failed, attempting refresh');
      return await refreshLinkedInToken(platform);
    }

    console.log('Token is valid');
    return connection.accessToken;
  } catch (error) {
    console.log('Token validation error, attempting refresh:', error.message);
    return await refreshLinkedInToken(platform);
  }
}

// LinkedIn token refresh function
async function refreshLinkedInToken(platform) {
  console.log('Attempting to refresh LinkedIn token');
  const connection = userConnections[platform];
  if (!connection || !connection.refreshToken) {
    console.error('No refresh token available for LinkedIn');
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: connection.refreshToken,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
    });

    const data = await response.json();
    console.log('LinkedIn refresh token response:', data);

    if (data.error) {
      console.error('LinkedIn refresh token error:', data);
      throw new Error(data.error_description || 'Failed to refresh token');
    }

    // Update the stored connection with new tokens
    const expiresAt = Date.now() + (data.expires_in * 1000);
    userConnections[platform] = {
      ...connection,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      expiresAt: expiresAt,
    };

    console.log('LinkedIn token refreshed successfully');
    return data.access_token;
  } catch (error) {
    console.error('LinkedIn token refresh error:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Connect endpoint (store credentials in memory)
app.post('/api/connect', (req, res) => {
  const { platform, credentials } = req.body;
  if (!platform || !credentials) {
    return res.status(400).json({ error: 'Platform and credentials required' });
  }
  userConnections[platform] = credentials;
  res.json({ success: true, platform });
});

// Post endpoint (real API for Facebook/Instagram, placeholders for others)
app.post('/api/post', async (req, res) => {
  const { platform, content, image } = req.body;
  if (!platform || !content) {
    return res.status(400).json({ error: 'Platform and content required' });
  }
  if (!userConnections[platform]) {
    return res.status(401).json({ error: 'Not connected to this platform' });
  }

  try {
    if (platform === 'facebook') {
      // Facebook: Post to page feed using Page Access Token
      // credentials.field1 = Page Access Token
      const pageAccessToken = userConnections[platform].field1;
      // You must provide your Facebook Page ID below
      const pageId = userConnections[platform].field2; // Let user enter Page ID as field2
      const url = `https://graph.facebook.com/${pageId}/feed`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          access_token: pageAccessToken,
        }),
      });
      const data = await response.json();
      if (data.error) {
        return res.status(400).json({ error: data.error.message });
      }
      return res.json({ success: true, platform, postId: data.id });
    } else if (platform === 'instagram') {
      // Instagram: Post to Instagram Business Account using Page Access Token
      // credentials.field1 = Page Access Token
      // credentials.field2 = Instagram Business Account ID
      const pageAccessToken = userConnections[platform].field1;
      const igUserId = userConnections[platform].field2;
      // Step 1: Create media object
      const mediaUrl = `https://graph.facebook.com/v19.0/${igUserId}/media`;
      const mediaResponse = await fetch(mediaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: content,
          access_token: pageAccessToken,
          // For images, you need to provide an image_url (publicly accessible)
          // For demo, skip image posting unless image is a URL
          ...(image && image.url ? { image_url: image.url } : {}),
        }),
      });
      const mediaData = await mediaResponse.json();
      if (mediaData.error) {
        return res.status(400).json({ error: mediaData.error.message });
      }
      // Step 2: Publish media object
      const publishUrl = `https://graph.facebook.com/v19.0/${igUserId}/media_publish`;
      const publishResponse = await fetch(publishUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: mediaData.id,
          access_token: pageAccessToken,
        }),
      });
      const publishData = await publishResponse.json();
      if (publishData.error) {
        return res.status(400).json({ error: publishData.error.message });
      }
      return res.json({ success: true, platform, postId: publishData.id });
    } else if (platform === 'twitter') {
      // Real Twitter API posting
      // credentials.field1 = API Key
      // credentials.field2 = API Key Secret
      // credentials.field3 = Access Token
      // credentials.field4 = Access Token Secret
      const { field1: apiKey, field2: apiKeySecret, field3: accessToken, field4: accessTokenSecret } = userConnections[platform];
      if (!apiKey || !apiKeySecret || !accessToken || !accessTokenSecret) {
        return res.status(400).json({ error: 'Missing Twitter credentials. Please provide API Key, API Key Secret, Access Token, and Access Token Secret.' });
      }
      try {
        const client = new TwitterApi({
          appKey: apiKey,
          appSecret: apiKeySecret,
          accessToken,
          accessSecret: accessTokenSecret,
        });
        
        // Verify credentials before posting
        try {
          await client.v2.me();
        } catch (verifyErr) {
          console.error('Twitter credential verification failed:', verifyErr);
          return res.status(401).json({ 
            error: 'Twitter authentication failed', 
            details: verifyErr.message 
          });
        }

        let tweet;
        if (image && image.url) {
          // First upload the media
          const mediaId = await client.v1.uploadMedia(image.url);
          // Then create the tweet with the media
          tweet = await client.v2.tweet({
            text: content,
            media: { media_ids: [mediaId] }
          });
        } else {
          // Just post the text if no image
          tweet = await client.v2.tweet(content);
        }
        
        return res.json({ success: true, platform, tweetId: tweet.data.id });
      } catch (err) {
        console.error('Twitter posting error:', err);
        return res.status(400).json({ 
          error: 'Failed to post to Twitter', 
          details: err.message,
          code: err.code
        });
      }
    } else if (platform === 'linkedin') {
      try {
        console.log('Starting LinkedIn post process...');
        console.log('Current user connections:', JSON.stringify(userConnections, null, 2));
        
        // Verify LinkedIn connection exists
        if (!userConnections[platform]) {
          console.error('No LinkedIn connection found in userConnections');
          return res.status(401).json({ 
            error: 'LinkedIn authentication failed', 
            details: 'Not connected to LinkedIn. Please connect your account first.',
            code: 'NOT_CONNECTED'
          });
        }

        const { accessToken, userId } = userConnections[platform];
        
        // Verify we have the required data
        if (!accessToken || !userId) {
          console.error('Missing LinkedIn credentials:', { 
            hasAccessToken: !!accessToken, 
            hasUserId: !!userId,
            connectionData: userConnections[platform]
          });
          delete userConnections[platform];
          return res.status(401).json({ 
            error: 'LinkedIn authentication failed', 
            details: 'Invalid LinkedIn connection. Please reconnect your account.',
            code: 'INVALID_CREDENTIALS'
          });
        }

        // Verify the token is still valid
        console.log('Verifying LinkedIn token...');
        const verifyResponse = await fetch('https://api.linkedin.com/v2/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202304'
          },
        });

        const verifyData = await verifyResponse.json();
        console.log('LinkedIn verification response:', {
          status: verifyResponse.status,
          statusText: verifyResponse.statusText,
          data: verifyData
        });

        if (!verifyResponse.ok) {
          console.error('LinkedIn token verification failed:', {
            status: verifyResponse.status,
            statusText: verifyResponse.statusText,
            data: verifyData
          });
          delete userConnections[platform];
          return res.status(401).json({ 
            error: 'LinkedIn authentication failed', 
            details: 'Your LinkedIn connection has expired. Please reconnect your account.',
            code: 'TOKEN_EXPIRED'
          });
        }

        // Prepare the post data
        const postData = {
          author: `urn:li:person:${userId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        };

        console.log('LinkedIn post data:', JSON.stringify(postData, null, 2));

        // Create the post
        console.log('Sending post request to LinkedIn...');
        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202304'
          },
          body: JSON.stringify(postData)
        });

        const responseText = await response.text();
        console.log('LinkedIn API Response:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse LinkedIn response:', e);
          throw new Error(`Failed to parse LinkedIn response: ${responseText}`);
        }

        if (!response.ok) {
          console.error('LinkedIn API Error:', {
            status: response.status,
            statusText: response.statusText,
            data: data
          });

          if (response.status === 401 || response.status === 403) {
            console.error('LinkedIn authentication failed - token expired or invalid');
            delete userConnections[platform];
            return res.status(401).json({ 
              error: 'LinkedIn authentication failed', 
              details: 'Your LinkedIn connection has expired. Please reconnect your account.',
              code: 'AUTH_EXPIRED'
            });
          }

          throw new Error(`LinkedIn API error (${response.status}): ${data.message || response.statusText}`);
        }

        console.log('LinkedIn post created successfully:', data);
        return res.json({ 
          success: true, 
          platform, 
          postId: data.id,
          message: 'Post created successfully. It may take a few minutes to appear on your LinkedIn profile.'
        });
      } catch (error) {
        console.error('LinkedIn posting error:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });

        // Clean up invalid connection
        if (error.message.includes('token') || error.message.includes('unauthorized')) {
          delete userConnections[platform];
          return res.status(401).json({ 
            error: 'LinkedIn authentication failed', 
            details: 'Your LinkedIn connection has expired. Please reconnect your account.',
            code: 'AUTH_EXPIRED'
          });
        }

        return res.status(500).json({ 
          error: 'Failed to post to LinkedIn', 
          details: error.message,
          code: error.code
        });
      }
    } else if (platform === 'threads') {
      // Threads: No official API, mock response
      return res.json({ success: true, platform, message: 'Threads posting is not supported (no official API).' });
    } else {
      return res.status(400).json({ error: 'Unknown platform' });
    }
  } catch (err) {
    console.error('Posting error:', err);
    return res.status(500).json({ 
      error: 'Server error', 
      details: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 