import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HowToConnectPage from './pages/HowToConnectPage';
import { User, SocialPlatform, LoginData, RegisterData } from './types';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  accounts: [
    { platform: 'facebook', connected: false },
    { platform: 'twitter', connected: false },
    { platform: 'instagram', connected: false },
    { platform: 'linkedin', connected: false },
    { platform: 'threads', connected: false },
  ],
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (data: LoginData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleConnectPlatform = (platform: SocialPlatform) => {
    if (!user) return;
    
    setUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        accounts: prevUser.accounts.map(account => 
          account.platform === platform
            ? { ...account, connected: !account.connected }
            : account
        ),
      };
    });
  };

  const handlePublishPost = async (content: string, platforms: SocialPlatform[], scheduledDate?: Date, image?: File) => {
    if (!user) return;

    let allSuccess = true;
    for (const platform of platforms) {
      try {
        const response = await fetch('http://localhost:5000/api/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform,
            content,
            image: image ? { name: image.name, size: image.size } : undefined,
            scheduledDate: scheduledDate?.toISOString(),
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          allSuccess = false;
          alert(`Failed to post to ${platform}: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        allSuccess = false;
        alert(`Network error posting to ${platform}`);
      }
    }
    if (allSuccess) {
      alert(`Post ${scheduledDate ? 'scheduled' : 'published'} successfully to all selected platforms!`);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } />
          <Route path="/register" element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <RegisterPage onRegister={handleRegister} />
            )
          } />
          <Route path="/dashboard" element={
            isAuthenticated && user ? (
              <DashboardPage
                user={user}
                onLogout={handleLogout}
                onConnectPlatform={handleConnectPlatform}
                onPublishPost={handlePublishPost}
              />
            ) : (
              <Navigate to="/" />
            )
          } />
          <Route path="/how-to-connect" element={<HowToConnectPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;