import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewAllProductsPage() {
  const [products, setProducts] = useState([]);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/products');
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch products!');
      }
    };

    const fetchUserType = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      setUserType(decodedToken.userType);
    };

    fetchProducts();
    fetchUserType();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/cart',
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product to cart!');
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/wishlist',
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Product added to wishlist successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product to wishlist!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">All Products</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-2">
                  <strong>Category:</strong> {product.category}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Price:</strong> ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Description:</strong> {product.description}
                </p>

                {/* Display Add to Cart and Add to Wishlist buttons for buyers */}
                {userType === 'buyer' && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      Add to Wishlist
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewAllProductsPage;
