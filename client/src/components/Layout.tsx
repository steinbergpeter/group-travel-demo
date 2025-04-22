import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header */}
      <header className='bg-teal-600 text-white py-3 shadow-md'>
        <div className='container mx-auto px-4 max-w-7xl'>
          <div className='flex items-center'>
            <Link to='/' className='text-xl font-bold hover:underline'>
              TripMeld
            </Link>
            <div className='flex-1' />
            <nav className='flex items-center gap-4'>
              <Link
                to='/'
                className='px-3 py-2 rounded hover:bg-teal-700 transition-colors'
              >
                Home
              </Link>
              {user ? (
                <div className='relative'>
                  <button
                    className='flex items-center gap-2 px-3 py-2 rounded hover:bg-teal-700 transition-colors'
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <span>{user.name || 'Account'}</span>
                    <span className='w-6 h-6 rounded-full bg-white text-teal-700 flex items-center justify-center text-xs font-bold'>
                      {user.name ? user.name[0] : 'U'}
                    </span>
                  </button>
                  {menuOpen && (
                    <div className='absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-10'>
                      <Link
                        to='/dashboard'
                        className='block px-4 py-2 hover:bg-gray-100'
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to='/profile'
                        className='block px-4 py-2 hover:bg-gray-100'
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to='/login'
                    className='px-3 py-2 rounded hover:bg-teal-700 transition-colors'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='px-3 py-2 border border-white rounded hover:bg-white hover:text-teal-700 transition-colors'
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1'>{children}</main>

      {/* Footer */}
      <footer className='bg-gray-100 py-6 mt-8'>
        <div className='container mx-auto px-4 max-w-7xl'>
          <div className='flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left'>
            <div className='mb-4 md:mb-0'>
              <div className='text-lg font-bold mb-2'>TripMeld</div>
              <div className='text-sm text-gray-600'>
                Group travel planning made easy
              </div>
            </div>
            <div className='flex gap-12'>
              <div>
                <div className='font-medium mb-2'>Links</div>
                <Link
                  to='/'
                  className='block text-sm text-gray-600 mb-1 hover:underline'
                >
                  Home
                </Link>
                <Link
                  to='/about'
                  className='block text-sm text-gray-600 mb-1 hover:underline'
                >
                  About
                </Link>
                <Link
                  to='/contact'
                  className='block text-sm text-gray-600 hover:underline'
                >
                  Contact
                </Link>
              </div>
              <div>
                <div className='font-medium mb-2'>Legal</div>
                <Link
                  to='/privacy'
                  className='block text-sm text-gray-600 mb-1 hover:underline'
                >
                  Privacy
                </Link>
                <Link
                  to='/terms'
                  className='block text-sm text-gray-600 hover:underline'
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
          <div className='text-sm text-gray-500 mt-8 text-center'>
            © 2025 TripMeld. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
