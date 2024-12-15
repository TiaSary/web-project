import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CategoryPage() {
  const { category } = useParams(); // Retrieve category from URL
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/products/category/${category}`);
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products.');
      }
    };

    fetchProductsByCategory();
  }, [category]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Products in {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CategoryPage;
