import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Product } from '../types';

interface Category {
  name: string;
  image: string;
  slug: string;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<Product[]>("/api/products");
        const map: Record<string, string> = {};
        res.data.forEach((p) => {
          if (!map[p.category]) {
            map[p.category] = p.thumbnail;
          }
        });
        const cats = Object.entries(map).map(([slug, image]) => ({
          slug,
          image,
          name: capitalize(slug),
        }));
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();

    console.log('Landing page rendered');
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div 
  className="relative bg-cover bg-center h-80 sm:h-96 md:h-[32rem]"
  style={{ 
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://via.placeholder.com/1200x600?text=Seasonal+Deals')`,
    backgroundBlendMode: 'multiply'
  }}
>
  <div className="container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
      Big Savings This Season
    </h1>
    <p className="text-xl text-white mb-8 max-w-2xl drop-shadow-lg">
      Discover incredible deals on everything you need
    </p>
    <Link 
      to="/search" 
      className="bg-accent-400 hover:bg-accent-500 text-gray-900 font-bold px-8 py-3 rounded-lg text-lg transition-all hover:scale-105 shadow-lg"
    >
      Shop Now
    </Link>
  </div>
</div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-8 text-center">
          Shop by Category
        </h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/search?category=${cat.slug}`}
                className="group text-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Feature Modules */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
            <div className="bg-primary-100 dark:bg-gray-700 p-6">
              <h2 className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                Stay Stocked with SmartPantry
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track pantry items and auto-reorder when running low.
              </p>
            </div>
            <div className="p-6 mt-auto">
              <Link 
                to="/pantry/setup" 
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
              >
                Set up Pantry
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
            <div className="bg-accent-50 dark:bg-gray-700 p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Find the Perfect Gift with AI
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Just tell us the occasion. We'll do the rest.
              </p>
            </div>
            <div className="p-6 mt-auto">
              <Link 
                to="/gift" 
                className="inline-block bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
              >
                Try GiftGenius
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Deal of the Day */}
      <div className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Deal of the Day
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Don't miss out on today's exclusive offers
          </p>
          <Link 
            to="/deal-of-the-day" 
            className="inline-block bg-white hover:bg-gray-100 text-primary-600 px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
          >
            View Today's Deals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;