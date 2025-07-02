export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
  image: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Organic Apples',
    price: 3.99,
    rating: 4.5,
    category: 'grocery',
    image: 'https://via.placeholder.com/300?text=Apples'
  },
  {
    id: 2,
    title: 'Wireless Headphones',
    price: 59.99,
    rating: 4.2,
    category: 'electronics',
    image: 'https://via.placeholder.com/300?text=Headphones'
  },
  {
    id: 3,
    title: 'Smart LED TV',
    price: 399.99,
    rating: 4.6,
    category: 'electronics',
    image: 'https://via.placeholder.com/300?text=TV'
  },
  {
    id: 4,
    title: 'Comforter Set',
    price: 79.99,
    rating: 4.3,
    category: 'home',
    image: 'https://via.placeholder.com/300?text=Comforter'
  },
  {
    id: 5,
    title: 'Action Figure',
    price: 14.99,
    rating: 4.1,
    category: 'toys',
    image: 'https://via.placeholder.com/300?text=Action+Figure'
  },
  {
    id: 6,
    title: 'Women\'s Sneakers',
    price: 49.99,
    rating: 4.4,
    category: 'fashion',
    image: 'https://via.placeholder.com/300?text=Sneakers'
  },
  {
    id: 7,
    title: 'Yoga Mat',
    price: 19.99,
    rating: 4.7,
    category: 'sports',
    image: 'https://via.placeholder.com/300?text=Yoga+Mat'
  },
  {
    id: 8,
    title: 'Blender',
    price: 29.99,
    rating: 4.0,
    category: 'home',
    image: 'https://via.placeholder.com/300?text=Blender'
  },
  {
    id: 9,
    title: 'Kids T-shirt',
    price: 9.99,
    rating: 4.3,
    category: 'fashion',
    image: 'https://via.placeholder.com/300?text=Kids+Tshirt'
  },
  {
    id: 10,
    title: 'Chocolate Cookies',
    price: 2.99,
    rating: 4.8,
    category: 'grocery',
    image: 'https://via.placeholder.com/300?text=Cookies'
  }
];
