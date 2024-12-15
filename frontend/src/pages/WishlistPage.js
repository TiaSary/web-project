import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch wishlist items!');
      }
    };

    fetchWishlistItems();
  }, []);

  return (
    <div>
      <h1>My Wishlist</h1>
      {wishlistItems.length > 0 ? (
        <ul>
          {wishlistItems.map((item) => (
            <li key={item.id}>
              <h2>{item.name}</h2>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
              <p><strong>Description:</strong> {item.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
}

export default WishlistPage;
