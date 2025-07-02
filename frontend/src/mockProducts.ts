export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  description: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Organic Apples',
    price: 3.99,
    rating: 4.5,
    category: 'grocery',
    image: 'https://via.placeholder.com/300?text=Apples',
    description: 'Crisp organic apples picked fresh from local farms.'
  },
  {
    id: 2,
    title: 'Wireless Headphones',
    price: 59.99,
    rating: 4.2,
    category: 'electronics',
    image: 'https://via.placeholder.com/300?text=Headphones',
    description: 'Bluetooth headphones with noise cancellation and long battery life.'
  },
  {
    id: 3,
    title: 'Smart LED TV',
    price: 399.99,
    rating: 4.6,
    category: 'electronics',
    image: 'https://via.placeholder.com/300?text=TV',
    description: '40-inch smart TV with vibrant display and built-in streaming apps.'
  },
  {
    id: 4,
    title: 'Comforter Set',
    price: 79.99,
    rating: 4.3,
    category: 'home',
    image: 'https://via.placeholder.com/300?text=Comforter',
    description: 'Plush queen-size comforter set to keep you cozy all night.'
  },
  {
    id: 5,
    title: 'Action Figure',
    price: 14.99,
    rating: 4.1,
    category: 'toys',
    image: 'https://via.placeholder.com/300?text=Action+Figure',
    description: 'Collectible action figure with movable joints and accessories.'
  },
  {
    id: 6,
    title: 'Women\'s Sneakers',
    price: 49.99,
    rating: 4.4,
    category: 'fashion',
    image: 'https://via.placeholder.com/300?text=Sneakers',
    description: 'Comfortable sneakers perfect for running errands or workouts.'
  },
  {
    id: 7,
    title: 'Yoga Mat',
    price: 19.99,
    rating: 4.7,
    category: 'sports',
    image: 'https://via.placeholder.com/300?text=Yoga+Mat',
    description: 'Non-slip yoga mat providing excellent grip for daily practice.'
  },
  {
    id: 8,
    title: 'Blender',
    price: 29.99,
    rating: 4.0,
    category: 'home',
    image: 'https://via.placeholder.com/300?text=Blender',
    description: 'High-speed blender ideal for smoothies and sauces.'
  },
  {
    id: 9,
    title: 'Kids T-shirt',
    price: 9.99,
    rating: 4.3,
    category: 'fashion',
    image: 'https://via.placeholder.com/300?text=Kids+Tshirt',
    description: 'Soft cotton T-shirt available in fun colors and prints.'
  },
  {
    id: 10,
    title: 'Chocolate Cookies',
    price: 2.99,
    rating: 4.8,
    category: 'grocery',
    image: 'https://via.placeholder.com/300?text=Cookies',
    description: 'Rich chocolate chip cookies baked to perfection.'
  }
];
