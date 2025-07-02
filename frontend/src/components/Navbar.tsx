import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold hover:text-accent-300 transition-colors flex items-center"
            >
              <span className="mr-2">🛒</span>
              SmartCart
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/pantry/setup" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-500 hover:text-accent-300 transition-all"
              >
                SmartPantry
              </Link>
              <Link 
                to="/gift" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-500 hover:text-accent-300 transition-all"
              >
                GiftGenius
              </Link>
              <Link 
                to="/cart" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-500 hover:text-accent-300 transition-all"
              >
                Cart
              </Link>
              <Link 
                to="/profile" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-500 hover:text-accent-300 transition-all"
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-accent-300 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-accent-400 transition-all"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-700">
          <Link 
            to="/pantry/setup" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500 hover:text-accent-300 transition-all"
            onClick={() => setIsOpen(false)}
          >
            SmartPantry
          </Link>
          <Link 
            to="/gift" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500 hover:text-accent-300 transition-all"
            onClick={() => setIsOpen(false)}
          >
            GiftGenius
          </Link>
          <Link 
            to="/cart" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500 hover:text-accent-300 transition-all"
            onClick={() => setIsOpen(false)}
          >
            Cart
          </Link>
          <Link 
            to="/profile" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500 hover:text-accent-300 transition-all"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;