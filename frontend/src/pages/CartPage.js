import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch cart items!');
      }
    };

    fetchCartItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">My Cart</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {cartItems.length > 0 ? (
          <div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((item) => (
                <li key={item.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
                  <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600 mt-2">
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Price:</strong> ${item.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Description:</strong> {item.description}
                  </p>
                </li>
              ))}
            </ul>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/checkout')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">Your cart is empty.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CartPage;
