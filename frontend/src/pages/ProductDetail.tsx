import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import AddToCartButton from '../components/AddToCartButton';
import api from '../api';
import RatingStars from '../components/RatingStars';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await api.get<Product>(`/api/products/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data.thumbnail || '');
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images Section */}
        <div className="lg:w-5/12">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="w-full h-auto max-h-96 object-contain mx-auto"
            />
          </div>
          
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden ${selectedImage === img ? 'border-primary-500 ring-2 ring-primary-300' : 'border-gray-200 dark:border-gray-600'}`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="lg:w-4/12">
          <div className="mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            {product.rating !== undefined && (
              <>
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
                </span>
              </>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage && (
                <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
              )}
            </div>
            {product.discountPercentage && (
              <span className="text-sm text-green-600 dark:text-green-400">
                Save {product.discountPercentage}%
              </span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Highlights</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {product.description.split('. ').filter(Boolean).map((point, i) => (
                <li key={i}>{point.replace(/\.$/, '')}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Quantity:</span>
                <select 
                  className="select select-bordered select-sm w-20"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, num) => num).map((num) => (
                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                  ))}
                </select>
              </div>
              
              {product.stock !== undefined && (
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              )}
            </div>

            <AddToCartButton product={product} quantity={quantity} />
          </div>

          <div className="space-y-3 text-sm">
            {product.shippingInformation && (
              <div className="flex gap-2">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>{product.shippingInformation}</span>
              </div>
            )}
            {product.returnPolicy && (
              <div className="flex gap-2">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>{product.returnPolicy}</span>
              </div>
            )}
            {product.warrantyInformation && (
              <div className="flex gap-2">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{product.warrantyInformation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:w-3/12">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Product Details</h3>
            
            <div className="space-y-3 text-sm">
              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">SKU</span>
                  <span>{product.sku}</span>
                </div>
              )}
              {product.category && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Category</span>
                  <span>{product.category}</span>
                </div>
              )}
              {product.weight !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Weight</span>
                  <span>{product.weight} lbs</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Dimensions</span>
                  <span>{product.dimensions.width}x{product.dimensions.height}x{product.dimensions.depth} in</span>
                </div>
              )}
              {product.minimumOrderQuantity !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Min Order Qty</span>
                  <span>{product.minimumOrderQuantity}</span>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tags</span>
                  <span className="text-right">{product.tags.join(', ')}</span>
                </div>
              )}
              {product.meta && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Barcode</span>
                    <span>{product.meta.barcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Added</span>
                    <span>{new Date(product.meta.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Updated</span>
                    <span>{new Date(product.meta.updatedAt).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {product.reviews.map((r, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{r.reviewerName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(r.date).toLocaleDateString()}
                    </p>
                  </div>
                  <RatingStars rating={r.rating} small />
                </div>
                <p className="text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;