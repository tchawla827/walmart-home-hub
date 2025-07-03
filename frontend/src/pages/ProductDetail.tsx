import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts, Product } from '../mockProducts';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      console.log(`Viewing product ID: ${id}`);
    }
  }, [id]);

  const product: Product | undefined = mockProducts.find(
    (p) => p.id === parseInt(id || '', 10)
  );

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
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
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
              src={product.image}
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
            
            <div className="flex items-center mb-4">
              <div className="flex text-accent-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current'}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {product.rating} rating
              </span>
            </div>

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