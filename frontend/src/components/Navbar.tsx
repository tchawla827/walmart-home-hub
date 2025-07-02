import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-lg font-bold">SmartCart</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/pantry/setup" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">SmartPantry</Link>
              <Link to="/gift" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">GiftGenius</Link>
              <Link to="/cart" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Cart</Link>
              <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/pantry/setup" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">SmartPantry</Link>
          <Link to="/gift" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">GiftGenius</Link>
          <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Cart</Link>
          <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
