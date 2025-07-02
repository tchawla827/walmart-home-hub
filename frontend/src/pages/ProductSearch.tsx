import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../mockProducts';

const ProductSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category')?.toLowerCase() || '';

  useEffect(() => {
    if (query) {
      console.log(`Searching for: ${query}`);
    }
    if (category) {
      console.log(`Filtering category: ${category}`);
    }
  }, [query, category]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params: Record<string, string> = {};
    if (value) params['category'] = value;
    if (query) params['q'] = query;
    setSearchParams(params);
  };

  const products = mockProducts.filter((p) => {
    const matchesQuery = query ? p.title.toLowerCase().includes(query) : true;
    const matchesCategory = category ? p.category.toLowerCase() === category : true;
    return matchesQuery && matchesCategory;
  });

  const categories = Array.from(new Set(mockProducts.map((p) => p.category)));

  const addToCart = (id: number) => {
    console.log(`Add to cart: ${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {products.length === 0 ? (
        <p>No products found for your search</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
