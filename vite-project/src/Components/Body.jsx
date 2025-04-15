import React, { useEffect, useState } from 'react';
import BasicCard from './BasicCard';
import Shimmer from './Shimmer';
import { Link } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import { useAuth0 } from '@auth0/auth0-react';
import { addItem, clearCart } from '../utils/cartSlice'; // include clearCart
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Footer from './Footer';

const Body = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((store) => store.cart.items);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
    const onlineStatus = useOnlineStatus();

    useEffect(() => {
        let intervalId;

        const init = async () => {
            if (isAuthenticated && !isLoading) {
                await fetchData();
                await fetchCart();

                // Re-fetch cart every 10 seconds
                intervalId = setInterval(() => {
                    fetchCart();
                }, 10000);
            }
        };

        init();

        return () => clearInterval(intervalId); // Clean up on unmount
    }, [isAuthenticated, isLoading]);

    const fetchCart = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get('http://localhost:3010/cartService/api/v1/cartItems', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newItems = response.data?.data?.[0] || [];

            // Clear if no items left in DB
            if (newItems.length === 0 && cartItems.length > 0) {
                dispatch(clearCart());
            }

            // Add new items if not already in Redux
            dispatch(clearCart()); // always clear old cart
            newItems.forEach(item => {
                dispatch(addItem({ ...item, quantity: 1 }));
            });


        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        }
    };

    const fetchData = async () => {
        try {
            setIsFetching(true);
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const response = await fetch("http://localhost:3010/productService/api/user/get-all-products", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                setProducts(data?.data || []);
                setFilteredProducts(data?.data || []);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setIsFetching(false);
        }
    };

    const handleSearch = (e) => {
        const text = e.target.value.toLowerCase();
        setSearchText(text);
        setFilteredProducts(
            text ? products.filter(product => product.name.toLowerCase().includes(text)) : products
        );
    };

    if (isLoading) return <Shimmer />;

    if (!onlineStatus) {
        return (
            <div className='flex items-center justify-center h-[50vh]'>
                <h1 className='text-gray-500'>
                    Looks like you're offline. Please check your internet connection.
                </h1>
            </div>
        );
    }

    return (
        <div className='pl-5'>
            <div className="w-full max-w-sm min-w-[200px] pt-4">
                <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
                        viewBox="0 0 24 24">
                        <path d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" />
                    </svg>
                    <input
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="Nike, Adidas..."
                        value={searchText}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className='flex flex-wrap p-15'>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : isFetching ? (
                    <Shimmer />
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <Link to={`/shoes/${product.id}`} key={product.id}>
                            <BasicCard
                                name={product.name || "N/A"}
                                brand={product.brand || "Unknown"}
                                category={product.category || "Uncategorized"}
                                price={product.price || "Unavailable"}
                                color={product.variants?.length || 0}
                                imageUrl={product?.variants?.[0]?.images[0]?.imageUrl || 'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg'}
                            />
                        </Link>
                    ))
                ) : (
                    <div className='flex justify-center items-center w-full h-[50vh]'>
                        <p className='text-xl text-gray-500 font-serif'>No products found.</p>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
        
    );
};

export default Body;
