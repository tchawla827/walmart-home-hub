import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts, Product } from '../mockProducts';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      console.log(`Viewing product ID: ${id}`);
    }
  }, [id]);

  const product: Product | undefined = mockProducts.find(
    (p) => p.id === parseInt(id || '', 10)
  );

  const { addToCart } = useCart();

  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Link to="/products" className="text-blue-600 mb-4 inline-block">
        &larr; Back to Products
      </Link>
      <div className="flex flex-col md:flex-row md:space-x-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full md:w-1/2 object-cover rounded mb-4 md:mb-0"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-2 capitalize">{product.category}</p>
          <p className="text-xl font-semibold mb-2">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-yellow-600 mb-2">Rating: {product.rating}</p>
          <p className="mb-4">{product.description}</p>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
