import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch orders.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
                <h2 className="text-xl font-semibold text-gray-800">Order #{order.orderId}</h2>
                <p className="text-gray-600 mt-2">
                  <strong>Product:</strong> {order.productName}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">You have no orders.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrdersPage;
