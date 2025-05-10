import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { User as UserType } from '../../types';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user?: UserType;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and menu */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 text-gray-500 rounded-md lg:hidden hover:text-gray-600 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:flex items-center">
              <span className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 0.75C3.77208 0.75 0.75 3.77208 0.75 7.5C0.75 11.2279 3.77208 14.25 7.5 14.25C11.2279 14.25 14.25 11.2279 14.25 7.5C14.25 3.77208 11.2279 0.75 7.5 0.75ZM7.5 1.75C10.6756 1.75 13.25 4.32436 13.25 7.5C13.25 10.6756 10.6756 13.25 7.5 13.25C4.32436 13.25 1.75 10.6756 1.75 7.5C1.75 4.32436 4.32436 1.75 7.5 1.75ZM7 10V9H8V10H7ZM7 8V4H8V8H7Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="font-bold text-xl text-gray-900">Social Media Automator</span>
              </span>
            </div>

            <nav className="hidden lg:ml-10 lg:flex lg:space-x-8">
              <a 
                href="#"
                className="px-3 py-2 text-sm font-medium text-blue-600 rounded-md" 
                aria-current="page"
              >
                Dashboard
              </a>
              <Link 
                to="/how-to-connect"
                className="px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-700"
              >
                How to Connect
              </Link>
            </nav>
          </div>

          {/* Right side - Notifications and profile */}
          <div className="flex items-center">
            {/* Removed bell icon */}

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu-button"
                  aria-expanded={isProfileMenuOpen}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </button>
              </div>
              
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.name || 'Guest User'}</div>
                    <div className="text-gray-500 truncate">{user?.email || ''}</div>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </a>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    role="menuitem"
                    onClick={onLogout}
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;