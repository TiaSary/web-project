import React from 'react';
import { Link } from 'react-router-dom';

function BuyerHomePage() {
  const categories = ['Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Bags'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Buyer Homepage</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/all-products" className="hover:text-blue-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-200">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-blue-200">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-blue-200">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-200">
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <li key={category} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
                <Link
                  to={`/category/${category.toLowerCase()}`}
                  className="block text-center text-lg font-semibold text-blue-600 hover:text-blue-800"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="bg-blue-600 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Your E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default BuyerHomePage;
