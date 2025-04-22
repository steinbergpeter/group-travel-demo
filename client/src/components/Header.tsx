import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Header: React.FC = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
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
                  onClick={() => setIsMenuOpen((v) => !v)}
                >
                  <span>{user.name || 'Account'}</span>
                  <span className='w-6 h-6 rounded-full bg-white text-teal-700 flex items-center justify-center text-xs font-bold'>
                    {user.name ? user.name[0] : 'U'}
                  </span>
                </button>
                {isMenuOpen && (
                  <div className='absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-10'>
                    <Link
                      to='/dashboard'
                      className='block px-4 py-2 hover:bg-gray-100'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 hover:bg-gray-100'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                      onClick={() => {
                        setIsMenuOpen(false);
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
  );
};

export default Header;
