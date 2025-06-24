import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const Orders = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ visible: false, orderId: null });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orderService/api/v1/myOrders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orderData = res.data?.data || [];
      const enrichedOrders = await Promise.all(
        orderData.map(async (order) => {
          const enrichedItems = await Promise.all(
            order.items.map(async (item) => {
              try {
                const shoeRes = await axios.get(
                  `${import.meta.env.VITE_API_BASE_URL}/productService/api/user/get-by-variantId/${item.variantId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                return {
                  ...item,
                  shoe: shoeRes.data.data,
                };
              } catch (err) {
                console.error(`Failed to fetch shoe ${item.shoeId}`, err);
                return item;
              }
            })
          );
          return { ...order, items: enrichedItems };
        })
      );

      setOrders(enrichedOrders);
    } catch (error) {
      toast.error('Failed to fetch orders.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [getAccessTokenSilently]);

  const confirmDelete = (orderId) => {
    setDeleteModal({ visible: true, orderId });
  };

  const handleDelete = async () => {
    const { orderId } = deleteModal;
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/orderService/api/v1/deleteOrder`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          orderId,
        },
      });
      toast.success('Order deleted successfully!');
      setDeleteModal({ visible: false, orderId: null });
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order.');
      console.error(error);
    }
  };

  const deliveredOrders = orders.filter(order => order.deliveryStatus);
  const pendingOrders = orders.filter(order => !order.deliveryStatus);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 max-w-7xl mx-auto relative">
      {deleteModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Order</h2>
            <p className="mb-6">Are you sure you want to delete order #{deleteModal.orderId}?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModal({ visible: false, orderId: null })}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT: Delivered Orders */}
      <div className="w-1/4">
        <h2 className="text-lg font-bold mb-4">Delivered Orders</h2>
        {deliveredOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No delivered orders yet.</p>
        ) : (
          deliveredOrders.map(order => (
            <div key={order.id} className="mb-4 p-3 bg-green-50 border rounded shadow">
              <h3 className="font-semibold text-sm">Order #{order.id}</h3>
              <p className="text-xs text-gray-600 mb-2">
                Delivered on: {new Date(order.updatedAt).toLocaleDateString()}
              </p>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <img
                    src={item.shoe?.images?.[0]?.imageUrl}
                    alt={item.shoe?.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="text-xs">
                    <p className="font-medium">{item.shoe?.brand} {item.shoe?.name}</p>
                    <p className="text-gray-500">{item.shoe?.subtitle}</p>
                  </div>
                </div>
              ))}
              <p className="text-xs font-semibold">Total: ${parseFloat(order.price).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>

      {/* RIGHT: Pending Orders */}
      <div className="w-3/4">
        <h2 className="text-2xl font-bold mb-6">Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <p className="text-gray-500">You don't have any pending orders.</p>
        ) : (
          pendingOrders.map(order => (
            <div key={order.id} className="mb-8 border p-4 rounded-md bg-white shadow-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                onClick={() => confirmDelete(order.id)}
                title="Delete Order"
              >
                <X size={20} />
              </button>

              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-right">
                  <p>Total: <strong>${parseFloat(order.price).toFixed(2)}</strong></p>
                  <p>Status: Pending</p>
                </div>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 border-t pt-4 mt-4">
                  <img
                    src={item.shoe?.images?.[0]?.imageUrl}
                    alt={item.shoe?.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.shoe?.brand} {item.shoe?.name}</h3>
                    <p className="text-sm text-gray-600">{item.shoe?.subtitle}</p>
                    <p className="text-sm">Size: {item.size}</p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold">
                    ${(item.pricePerUnit * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
