import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// ✅ Sample top brands (you can extend this up to 100)
const topBrands = [
  "Nike", "Adidas", "Puma", "Reebok", "Bata", "Woodland", "Skechers",
  "Converse", "Fila", "New Balance", "Under Armour", "Asics", "Lakhani",
  "Vans", "Red Tape", "Lee Cooper", "Clarks", "Hush Puppies", "HRX",
  "Campus", "Others"
];

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    customBrand: '',
    category: 'men',
    price: '',
    description: '',
    rating: 0
  });

  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fixGrammar = () => {
    if (!form.description.trim()) return;
    const fixed = form.description
      .replace(/\bi\b/g, 'I')
      .replace(/\s+/g, ' ')
      .trim();

    setForm({ ...form, description: fixed });
    toast.success('Grammar improved!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...form,
      brand: form.brand === 'Others' ? form.customBrand : form.brand
    };

    delete finalData.customBrand; // not needed in backend

    try {
      const token = await getAccessTokenSilently();
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/productService/api/v1/addProduct`,
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Product added successfully!');
      navigate('/admin/uploads')
      console.log('Response:', res.data);
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Add Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Product/ Model Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Brand</label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select a brand</option>
                {topBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              {/* Show input if "Others" is selected */}
              {form.brand === 'Others' && (
                <input
                  type="text"
                  name="customBrand"
                  placeholder="Enter your brand name"
                  value={form.customBrand}
                  onChange={handleChange}
                  className="mt-2 w-full border rounded-md p-2"
                  required
                />
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
                
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Right Side: Description & AI Grammar */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="7"
              required
              className="w-full border rounded-md p-2 mb-2"
            />
            <button
              type="button"
              onClick={fixGrammar}
              className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90"
            >
              Fix Grammar with AI
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:opacity-90"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
