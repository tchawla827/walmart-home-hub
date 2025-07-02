import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import GiftGenius from './pages/GiftGenius';
import ProductSearch from './pages/ProductSearch';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import PantrySetup from './pages/PantrySetup';
import { CartProvider } from './context/CartContext';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<ProductSearch />} />
          <Route path="/products" element={<ProductSearch />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/pantry/setup" element={<PantrySetup />} />
          <Route path="/gift" element={<GiftGenius />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
