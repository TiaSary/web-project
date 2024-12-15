import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/seller/orders', {
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
    <div>
      <h1>My Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.orderId}>
              <h2>Order #{order.orderId}</h2>
              <p><strong>Product:</strong> {order.productName}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Status:</strong> {order.status}</p>
              
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
}

export default SellerOrdersPage;
