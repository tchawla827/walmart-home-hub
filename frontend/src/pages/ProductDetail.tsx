import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import AddToCartButton from '../components/AddToCartButton';
import api from '../api';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

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
          <div className="md:w-1/2 bg-white p-6 flex flex-col items-center justify-center">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="w-full h-auto max-h-96 object-contain"
            />
            {product.images && product.images.length > 0 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {product.images.map((img) => (
                  <img
                    key={img}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 cursor-pointer border rounded-lg ${selectedImage === img ? 'border-primary-500' : 'border-transparent'}`}
                    alt="thumbnail"
                  />
                ))}
              </div>
            )}
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

            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-6">
              {product.brand && (
                <div><span className="font-medium">Brand:</span> {product.brand}</div>
              )}
              {product.sku && (
                <div><span className="font-medium">SKU:</span> {product.sku}</div>
              )}
              {product.rating !== undefined && (
                <div><span className="font-medium">Rating:</span> {product.rating}</div>
              )}
              {product.discountPercentage !== undefined && (
                <div><span className="font-medium">Discount:</span> {product.discountPercentage}%</div>
              )}
              {product.stock !== undefined && (
                <div><span className="font-medium">Stock:</span> {product.stock}</div>
              )}
              {product.weight !== undefined && (
                <div><span className="font-medium">Weight:</span> {product.weight}</div>
              )}
              {product.dimensions && (
                <div><span className="font-medium">Dimensions:</span> {product.dimensions.width}x{product.dimensions.height}x{product.dimensions.depth}</div>
              )}
              {product.warrantyInformation && (
                <div><span className="font-medium">Warranty:</span> {product.warrantyInformation}</div>
              )}
              {product.shippingInformation && (
                <div><span className="font-medium">Shipping:</span> {product.shippingInformation}</div>
              )}
              {product.availabilityStatus && (
                <div><span className="font-medium">Availability:</span> {product.availabilityStatus}</div>
              )}
              {product.returnPolicy && (
                <div><span className="font-medium">Return Policy:</span> {product.returnPolicy}</div>
              )}
              {product.minimumOrderQuantity !== undefined && (
                <div><span className="font-medium">Min Order Qty:</span> {product.minimumOrderQuantity}</div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="sm:col-span-2"><span className="font-medium">Tags:</span> {product.tags.join(', ')}</div>
              )}
              {product.meta && (
                <>
                  <div><span className="font-medium">Barcode:</span> {product.meta.barcode}</div>
                  <div><span className="font-medium">Created:</span> {new Date(product.meta.createdAt).toLocaleDateString()}</div>
                  <div><span className="font-medium">Updated:</span> {new Date(product.meta.updatedAt).toLocaleDateString()}</div>
                </>
              )}
            </div>

            {product.meta?.qrCode && (
              <img src={product.meta.qrCode} alt="QR Code" className="h-24 mb-4" />
            )}

            <AddToCartButton product={product} />
          </div>
        </div>
        {product.reviews && product.reviews.length > 0 && (
          <div className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((r, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <p className="text-sm mb-1"><span className="font-medium">{r.reviewerName}</span> rated {r.rating}/5</p>
                  <p className="text-xs text-gray-500 mb-2">{new Date(r.date).toLocaleDateString()}</p>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;