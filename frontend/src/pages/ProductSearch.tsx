import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category')?.toLowerCase() || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (query) {
      console.log(`Searching for: ${query}`);
      toast.info(`Searching for: ${query}`);
    }
    if (category) {
      console.log(`Filtering category: ${category}`);
      toast.info(`Filtering by: ${category}`);
    }
  }, [query, category]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params: Record<string, string> = {};
    if (value) params['category'] = value;
    if (query) params['q'] = query;
    setSearchParams(params);
  };

  const filtered = products.filter((p) => {
    const matchesQuery = query ? p.name.toLowerCase().includes(query) : true;
    const matchesCategory = category ? p.category.toLowerCase() === category : true;
    return matchesQuery && matchesCategory;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
          {query ? `Search Results for "${query}"` : 'Our Products'}
        </h1>
        <div className="relative w-full md:w-64">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 pr-8 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c.toLowerCase()}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No products found
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {query ? 'Try a different search term' : 'No products available in this category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;