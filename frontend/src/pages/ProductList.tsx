import React, { useEffect, useState } from 'react';

import api from '../api';

import { Product } from '../types';

const SkeletonCard: React.FC = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 h-48" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
    <div className="relative">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-48 object-contain bg-white p-4"
      />
      {product.description && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 p-4 text-sm text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          {product.description}
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
        {product.title}
      </h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="text-primary-600 dark:text-primary-400 font-bold mt-2">
        ${product.price.toFixed(2)}
      </p>
    </div>
  </div>
);

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>('/api/products');
        console.log('Fetched products', res.data);
        setProducts(res.data);
      } catch (e) {
        console.error('Failed to fetch products', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    const matchCat = category ? p.category === category : true;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    console.log('Filter', { search, category });
  }, [search, category]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="w-full md:w-1/3 border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-64 border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
