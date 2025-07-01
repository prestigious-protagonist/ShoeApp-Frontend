import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminUploadsCard from './AdminUploadsCard';
import Shimmer from '../Components/Shimmer';
import Footer from '../Components/Footer';

const MyUploads = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [myProducts, setMyProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyUploads = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/productService/api/user/get-all-products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = res.data?.data || [];
        setMyProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch uploads.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchMyUploads();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    setFilteredProducts(
      text
        ? myProducts.filter((item) =>
            item.name.toLowerCase().includes(text)
          )
        : myProducts
    );
  };

  return (
    <div className="pl-5">
      <div className="w-full max-w-sm min-w-[200px] pt-4">
        <div className="relative flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
            viewBox="0 0 24 24">
            <path d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" />
          </svg>
          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Search your uploads..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="my-4">
        <button
          onClick={() => navigate('/admin/addProduct')}
          className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90"
        >
          + Add New Product
        </button>
      </div>

      <div className="flex flex-wrap p-15">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : loading ? (
          <Shimmer />
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <AdminUploadsCard
  key={product.id}
  name={product.name || 'N/A'}
  brand={product.brand || 'Unknown'}
  category={product.category || 'Uncategorized'}
  price={product.price || 'Unavailable'}
  color={product.variants?.length || 0}
  imageUrl={
    product?.variants?.[0]?.images?.[0]?.imageUrl ||
    'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg'
  }
  productId={product.id}
  isAdmin={true}
/>

          ))
        ) : (
          <div className="flex justify-center items-center w-full h-[50vh]">
            <p className="text-xl text-gray-500 font-serif">No uploads found.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyUploads;
