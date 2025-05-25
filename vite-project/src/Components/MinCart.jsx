import React from 'react';
import { useSelector } from 'react-redux';

const MiniCart = () => {
  const cartItems = useSelector((store) => store.cart.items);



  if (cartItems.length === 0) {
    return <p className="text-gray-500">Cart is empty.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {cartItems.map((item, index) => (
        <div key={index} className="flex items-center gap-4 border p-3 rounded-md bg-white">
          <img
            src={item?.data?.images?.[0]?.imageUrl}
            alt={item?.data?.shoe?.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div>
            <h3 className="text-sm font-semibold">
              {item?.data?.shoe?.brand} {item?.data?.shoe?.name}
            </h3>
            <div className="flex items-center  rounded mt-1">
              <span className="px-2 text-sm">$ {item?.data?.shoe?.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MiniCart;
