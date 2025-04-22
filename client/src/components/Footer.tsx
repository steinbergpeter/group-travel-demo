import React from 'react';

const Footer: React.FC = () => (
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
            <a
              href='/'
              className='block text-sm text-gray-600 mb-1 hover:underline'
            >
              Home
            </a>
            <a
              href='/about'
              className='block text-sm text-gray-600 mb-1 hover:underline'
            >
              About
            </a>
            <a
              href='/contact'
              className='block text-sm text-gray-600 hover:underline'
            >
              Contact
            </a>
          </div>
          <div>
            <div className='font-medium mb-2'>Legal</div>
            <a
              href='/privacy'
              className='block text-sm text-gray-600 mb-1 hover:underline'
            >
              Privacy
            </a>
            <a
              href='/terms'
              className='block text-sm text-gray-600 hover:underline'
            >
              Terms
            </a>
          </div>
        </div>
      </div>
      <div className='text-sm text-gray-500 mt-8 text-center'>
        © 2025 TripMeld. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
