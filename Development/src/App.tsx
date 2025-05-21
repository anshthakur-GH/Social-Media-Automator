import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HowToConnectPage from './pages/HowToConnectPage';
import { User, SocialPlatform } from './types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
  const [user, setUser] = useState<User>(mockUser);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    // Check if user's system prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  // Update theme when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = (email: string, password: string) => {
    console.log('Login attempt with:', email, password);
    setIsAuthenticated(true);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    console.log('Social login with:', provider);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleConnectPlatform = (platform: SocialPlatform) => {
    setUser(prevUser => ({
      ...prevUser,
      accounts: prevUser.accounts.map(account => 
        account.platform === platform
          ? { ...account, connected: !account.connected }
          : account
      ),
    }));
  };

  const handlePublishPost = async (content: string, platforms: SocialPlatform[], scheduledDate?: Date, image?: File) => {
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              <DashboardPage
                user={user}
                onLogout={handleLogout}
                onConnectPlatform={handleConnectPlatform}
                onPublishPost={handlePublishPost}
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
            ) : (
              <LoginPage
                onLogin={handleLogin}
                onSocialLogin={handleSocialLogin}
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
            )
          } />
          <Route path="/how-to-connect" element={
            <HowToConnectPage
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
            />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;