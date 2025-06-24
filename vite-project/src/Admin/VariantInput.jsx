import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

const VariantInputPage = () => {
  const { shoeId } = useParams(); // get shoeId from URL
  const { getAccessTokenSilently } = useAuth0();

  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!color || !size || !stock) {
        
        return toast.error('Please fill all fields');}

    try {
      setLoading(true);
      const token = await getAccessTokenSilently();

      const payload = {
        shoeId,
        color,
        size,
        stock,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/productService/api/v1/addColor`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success('Variant added successfully!');
        
        navigate('/admin/uploads')
        setColor('');
        setSize('');
        setStock('');
      } else {
        toast.error('Failed to add variant');
      }

    } catch (err) {
      console.error('Error adding variant:', err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-6 border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Add Variant</h2>

        <div className="flex flex-col">
          <label htmlFor="shoeId" className="mb-1 text-sm font-medium text-gray-700">
            Product ID
          </label>
          <input
            type="text"
            id="shoeId"
            value={shoeId}
            disabled
            className="border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="color" className="mb-1 text-sm font-medium text-gray-700">Color</label>
          <input
            type="text"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g., Gray"
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="size" className="mb-1 text-sm font-medium text-gray-700">Size</label>
          <input
            type="text"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g., 7 or L"
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="stock" className="mb-1 text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="e.g., 50"
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-200 text-lg"
        >
          {loading ? 'Submitting...' : '➕ Add Variant'}
        </button>
      </form>
    </div>
  );
};

export default VariantInputPage;
