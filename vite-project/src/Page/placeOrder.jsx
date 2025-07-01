import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { X } from 'lucide-react';
import { updateItemSize } from '../utils/cartSlice'; // Adjust path as per your project

const PlaceOrder = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [showPromo, setShowPromo] = useState(true);

  useEffect(() => {
    const fetchPromoMessage = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orderService/api/v1/promoMessage`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.message) {
          setPromoMessage(res.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch promo message:", err);
      }
    };
    fetchPromoMessage();
  }, [getAccessTokenSilently]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.data?.shoe?.price * (item.quantity || 1),
    0
  );
  const discount = (discountPercent / 100) * subtotal;
  const tax = (subtotal - discount) * 0.1;
  const shipping = 0;
  const total = subtotal - discount + tax + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning("Enter a coupon code.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/orderService/api/v1/applyCoupon/${couponCode}`, {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { value } = res.data;
      if (value && value > 0) {
        setDiscountPercent(value);
        setCouponApplied(true);
        toast.success(`Coupon applied! You got ${value}% off.`);
      } else {
        toast.error("Invalid or expired coupon.");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong.");
      console.log(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.warning("Cart is empty. Add items before placing an order.");
      return;
    }

    const missingSizes = cartItems.filter(item => !item.size);
    if (missingSizes.length > 0) {
      toast.error("Please select a size for all items before placing an order.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      console.log(cartItems)
      const orderPayload = {
        items: cartItems.map(item => ({
          shoeId: item.data.shoeId,
          variantId: item.shoevariantsId,
          quantity: item.quantity,
          size: item.size,
          pricePerUnit: item.data?.shoe?.price,
        })),
        price: total,
        discountPercentage: discountPercent,
        couponCode: couponApplied ? couponCode : undefined
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/orderService/api/v1/placeOrder`,
        orderPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Order placed successfully!");
      navigate('/orders');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error.message);
    }
  };

  const handleSizeChange = (id, selectedSize) => {
    dispatch(updateItemSize({ id, size: selectedSize }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Review Your Order</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">No items in cart to place an order.</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-md p-4 mb-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.data?.images?.[0]?.imageUrl}
                    alt={item.data?.shoe?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold">
                      {item.data?.shoe?.brand} {item.data?.shoe?.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ${item.data?.shoe?.price}
                    </p>
                    <div className="mt-1">
                      <select
                        value={item.size || ''}
                        onChange={(e) => handleSizeChange(item.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Select size</option>
                        {item.data?.sizes?.map((sizeObj, idx) => (
                          <option key={idx} value={sizeObj.size}>
                            {sizeObj.size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  ${(item.quantity * item.data?.shoe?.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="flex items-center mb-4 gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="border border-gray-300 rounded px-3 py-2 flex-1"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={couponApplied}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {couponApplied ? "Applied" : "Apply"}
              </button>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-sm mb-2 text-green-600">
                <span>Discount ({discountPercent}%)</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm mb-2">
              <span>Estimated Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Place Order
            </button>
          </div>
        </>
      )}

      {promoMessage && showPromo && (
        <div className="fixed bottom-4 left-4 bg-blue-100 text-blue-800 px-4 py-3 rounded-lg shadow-lg max-w-sm flex items-start gap-3 z-50">
          <span className="flex-1 text-sm">{promoMessage}</span>
          <button onClick={() => setShowPromo(false)} className="text-blue-500 hover:text-blue-700">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
