import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import GiftGenius from './pages/GiftGenius';
import ProductSearch from './pages/ProductSearch';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import PantrySetup from './pages/PantrySetup';
import GiftBundlePage from './pages/GiftBundlePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          {/* Toast notifications container */}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<ProductSearch />} />
            <Route path="/products" element={<ProductSearch />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/pantry/setup" element={<PantrySetup />} />
            <Route path="/gift" element={<GiftGenius />} />
            <Route path="/bundle" element={<GiftBundlePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;
