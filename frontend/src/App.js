import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

import BuyerHomePage from './pages/BuyerHomePage';
import SellerHomePage from './pages/SellerHomePage';
import AddProductPage from './pages/AddProductPage';
import ViewAllProductsPage from './pages/ViewAllProductsPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/buyer-home" element={<BuyerHomePage />} />
        <Route path="/seller-home" element={<SellerHomePage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/all-products" element={<ViewAllProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
