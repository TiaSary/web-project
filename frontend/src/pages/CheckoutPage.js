import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState({
    name: '',
    address: '',
    paymentMethod: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckoutInfo({ ...checkoutInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Loop through cart items and create orders
      for (const item of cartItems) {
        await axios.post(
          'http://localhost:5001/orders',
          { productId: item.id, quantity: 1 }, // Replace with actual quantity if available
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      alert('Order placed successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={checkoutInfo.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={checkoutInfo.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={checkoutInfo.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select a payment method</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CheckoutPage;
