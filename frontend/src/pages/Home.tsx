import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Grocery', image: 'https://via.placeholder.com/300?text=Grocery', slug: 'grocery' },
  { name: 'Electronics', image: 'https://via.placeholder.com/300?text=Electronics', slug: 'electronics' },
  { name: 'Home', image: 'https://via.placeholder.com/300?text=Home', slug: 'home' },
  { name: 'Toys', image: 'https://via.placeholder.com/300?text=Toys', slug: 'toys' },
  { name: 'Fashion', image: 'https://via.placeholder.com/300?text=Fashion', slug: 'fashion' },
  { name: 'Sports', image: 'https://via.placeholder.com/300?text=Sports', slug: 'sports' },
];

const Home: React.FC = () => {
  useEffect(() => {
    console.log('Landing page rendered');
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-cover bg-center h-64 sm:h-80" style={{ backgroundImage: `url('https://via.placeholder.com/1200x400?text=Seasonal+Deal')` }}>
        <div className="bg-black bg-opacity-50 h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-center">Big Savings This Season</h1>
          <Link to="/search" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded">Shop Now</Link>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link key={cat.slug} to={`/search?category=${cat.slug}`} className="text-center border rounded-lg overflow-hidden hover:shadow-lg">
            <img src={cat.image} alt={cat.name} className="w-full h-24 object-cover" />
            <div className="p-2 font-medium">{cat.name}</div>
          </Link>
        ))}
      </div>

      {/* Feature Modules */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-2">Stay Stocked with SmartPantry</h2>
          <p className="mb-4">Track pantry items and auto-reorder when running low.</p>
          <Link to="/pantry/setup" className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Set up Pantry</Link>
        </div>
        <div className="border rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-2">Find the Perfect Gift with AI</h2>
          <p className="mb-4">Just tell us the occasion. We'll do the rest.</p>
          <Link to="/gift" className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Try GiftGenius</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
