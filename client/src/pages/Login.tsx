import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(UserContext);

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (email === 'demo@example.com' && password === 'password') {
        login(email);
        // Optionally show a toast/alert here
      } else {
        // Optionally show a toast/alert here
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='mt-2 text-gray-600'>Login to your TripMeld account</p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your.email@example.com'
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                emailError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {emailError && (
              <p className='text-red-500 text-xs mt-1'>{emailError}</p>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='********'
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {passwordError && (
              <p className='text-red-500 text-xs mt-1'>{passwordError}</p>
            )}
          </div>
          <div className='flex justify-between items-center'>
            <label className='flex items-center text-sm'>
              <input type='checkbox' defaultChecked className='mr-2' /> Remember
              me
            </label>
            <Link
              to='/forgot-password'
              className='text-teal-600 hover:underline text-sm'
            >
              Forgot password?
            </Link>
          </div>
          <button
            type='submit'
            className='w-full py-2 px-4 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700 transition-colors disabled:opacity-60'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
          <div className='flex items-center my-2'>
            <div className='flex-grow border-t border-gray-200' />
            <span className='mx-2 text-gray-400 text-xs'>or</span>
            <div className='flex-grow border-t border-gray-200' />
          </div>
          <div className='text-center'>
            <span className='text-sm'>
              Don't have an account?{' '}
              <Link to='/register' className='text-teal-600 hover:underline'>
                Sign up
              </Link>
            </span>
          </div>
          <div className='bg-gray-50 p-2 rounded-md text-center'>
            <span className='text-xs'>
              Demo login: <strong>demo@example.com</strong> /{' '}
              <strong>password</strong>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
