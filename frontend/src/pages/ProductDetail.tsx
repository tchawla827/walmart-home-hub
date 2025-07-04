import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import api from '../api';



import { toast } from 'react-toastify';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {

        const res = await api.get<Product>(`/api/products/${id}`);

        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center">Loading...</div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02]"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <Link 
        to="/products" 
        className="flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-white p-6 flex items-center justify-center">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="mb-4">
              <span className="inline-block bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h1>
            


            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-8">
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="w-full bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;