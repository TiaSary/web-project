import React from 'react';
import { Link } from 'react-router-dom';

function SellerHomePage() {
  return (
    <div>
      <header>
        <h1>Seller Homepage</h1>
        <nav>
          <ul>
            <li><Link to="/all-products">All Products</Link></li>
            <li><Link to="/add-product">Add Product</Link></li>
            <li><Link to="/seller/orders">View My Orders</Link></li> 
            <li><Link to="/">Logout</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <h2>Categories</h2>
        <ul>
          <li><Link to="/category/tops">Tops</Link></li>
          <li><Link to="/category/bottoms">Bottoms</Link></li>
          <li><Link to="/category/outerwear">Outerwear</Link></li>
          <li><Link to="/category/shoes">Shoes</Link></li>
          <li><Link to="/category/bags">Bags</Link></li>
        </ul>
      </main>
    </div>
  );
}

export default SellerHomePage;
