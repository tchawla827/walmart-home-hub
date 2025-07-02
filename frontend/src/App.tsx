import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';
import ProductSearch from './pages/ProductSearch';
import CartPage from './pages/CartPage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/products" element={<ProductSearch />} />
        <Route path="/pantry/setup" element={<Placeholder title="SmartPantry Setup" />} />
        <Route path="/gift" element={<Placeholder title="GiftGenius" />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Placeholder title="Profile" />} />
      </Routes>
    </Router>
  );
};

export default App;
