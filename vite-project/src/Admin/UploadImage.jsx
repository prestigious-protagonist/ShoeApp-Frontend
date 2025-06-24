import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const UploadImage = () => {
  const { shoeId } = useParams();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(
          `http://localhost:3010/productService/api/v1/get-variants-by-shoeId/${shoeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVariants(res.data?.data?.[0] || []);
      } catch (err) {
        console.error('Error fetching variants:', err);
        setError('Failed to load variants');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchVariants();
    }
  }, [shoeId, getAccessTokenSilently, isAuthenticated, isLoading]);

  const handleUpload = async (variantId) => {
    const imageUrl = imageUrls[variantId];
    if (!imageUrl) return toast.warn('Please enter an image URL.');

    try {
      setUploadingId(variantId);
      const token = await getAccessTokenSilently();

      const body = {
        imageUrl,
        shoeId,
        variantsId: variantId,
      };

      const res = await axios.post(
        'http://localhost:3010/productService/api/v1/uploadImage',
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success('✅ Image uploaded!');
        setImageUrls((prev) => ({ ...prev, [variantId]: '' }));
      } else {
        toast.error('❌ Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Something went wrong.');
    } finally {
      setUploadingId(null);
    }
  };

  const handleChange = (variantId, value) => {
    setImageUrls((prev) => ({ ...prev, [variantId]: value }));
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Upload Image URLs for Shoe</h1>
      <input
        type="text"
        value={shoeId}
        disabled
        className="bg-gray-200 px-4 py-2 rounded mb-6 w-full max-w-lg text-center font-mono"
      />

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="bg-white shadow-md p-4 rounded-lg border border-gray-200 flex flex-col justify-between"
            >
              <p className="text-gray-800 font-medium">Color: {variant.color}</p>
              <p className="text-xs text-gray-600 mb-3 break-words">{variant.id}</p>

              <input
                type="text"
                placeholder="Enter image URL"
                value={imageUrls[variant.id] || ''}
                onChange={(e) => handleChange(variant.id, e.target.value)}
                className="border px-2 py-1 rounded text-sm mb-2"
              />

              <button
                onClick={() => handleUpload(variant.id)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
              >
                {uploadingId === variant.id ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadImage;
