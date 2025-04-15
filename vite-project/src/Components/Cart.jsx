import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateItemQuantity, clearCart } from '../utils/cartSlice';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.items);
  const { getAccessTokenSilently } = useAuth0();

  const [cartFetched, setCartFetched] = useState(false);
  useEffect(()=> {
    dispatch(clearCart())
  },[])
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get('http://localhost:3010/cartService/api/v1/cartItems', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (Array.isArray(response.data?.data?.[0])) {
          response.data.data[0].forEach(item => {
            const isValidItem =
              item &&
              item.id &&
              item.data?.shoe?.price &&
              item.data &&
              item?.data?.shoe &&
              Array.isArray(item.data.sizes) &&
              item.data.sizes.length > 0;
  
            const existsInCart = cartItems.some(cartItem => cartItem.id === item.id);
  
            if (isValidItem && !existsInCart) {
              dispatch(addItem({ ...item, quantity: item.quantity || 1 }));
            }
          });
        }
  
        setCartFetched(true);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };
  
    if (!cartFetched) {
      fetchCartItems();
    }
  }, [dispatch, getAccessTokenSilently, cartFetched, cartItems]);
  
  const handleIncrease = async (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    const token = await getAccessTokenSilently();
  
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
  
    try {
      // Send API request to update quantity
      await axios.patch(
        `http://localhost:3010/cartService/api/v1/updateCartItem`,
        { id: item.shoevariantsId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update Redux store
      if (existingItem) {
        dispatch(updateItemQuantity({ id: item.id, quantity: newQuantity }));
      } else {
        dispatch(addItem({ ...item, quantity: 1 }));
      }
  
      toast.success("Quantity updated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update quantity."
      );
      console.error("Quantity update error:", error);
    }
  };
  

  const handleDecrease = async (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    const token = await getAccessTokenSilently();
  
    if (!existingItem) return;
  
    const newQuantity = existingItem.quantity - 1;
  
    try {
      if (newQuantity > 0) {
        await axios.patch(
          `http://localhost:3010/cartService/api/v1/updateCartItem`,
          { id: item.shoevariantsId, quantity: newQuantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        dispatch(updateItemQuantity({ id: item.id, quantity: newQuantity }));
      } else {
        // If quantity becomes 0, remove the item from cart
        await axios.delete(
          `http://localhost:3010/cartService/api/v1/deleteCartItem/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        dispatch(removeItem(item));
      }
  
      toast.success("Item removed!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update quantity."
      );
      console.error("Quantity update error:", error);
    }
  };
  

  const handleClearCart = async () => {
    try {
      
      const token = await getAccessTokenSilently();
      const res = await axios.delete(`http://localhost:3010/cartService/api/v1/clearCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data.success) {
        dispatch(clearCart());
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to clear cart."
      );
      console.error("Clear cart error:", error);
    }
  };
  

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.data?.shoe?.price * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.1;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6 justify-between w-full">
      <div className="flex flex-col gap-4 w-full md:w-2/3">
        {cartItems.length === 0 ? (
          <h1 className="flex justify-center items-center text-center text-gray-500">
            Cart is empty. Add some items to the cart.
          </h1>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="flex justify-between border p-4 rounded-md gap-4">
              <div className="flex items-center gap-4 w-2/3">
                <img
                  src={item?.data?.images?.[0]?.imageUrl}
                  alt={item?.data?.shoe?.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {item?.data?.shoe?.brand} {item?.data?.shoe?.name}
                  </h2>
                  <p className="text-sm text-gray-500">Color: {item.data?.color}</p>
                  <div className="flex items-center border rounded px-2 mt-2 w-fit">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="px-2 text-lg font-bold"
                    >
                      −
                    </button>
                    <span className="px-2">{item.quantity || 1}</span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="px-2 text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-1/3 border-l pl-4">
                <label className="text-sm font-semibold mb-1 block">Select Size:</label>
                <select className="w-full p-2 border rounded-md text-sm">
                  {item.data?.sizes
                    ?.filter((size) => size.stock > 0)
                    .map((sizeObj, idx) => (
                      <option key={idx} value={sizeObj.size}>
                        Size {sizeObj.size} — {sizeObj.stock} in stock
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full md:w-1/3">
        <div className="w-full flex justify-center pb-2">
          <button
            className="w-1/2 border p-6 bg-gray-50 hover:bg-gray-200 py-2 rounded-md font-semibold text-black"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        </div>

        <div className="border p-6 rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg my-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
  