import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from "react-redux";
import { addItem } from "../utils/cartSlice";
import { handleAddItem } from '../utils/addToCart';
import 'react-toastify/dist/ReactToastify.css';

const Shoemenu = () => {
    const [shoeInfo, setShoeInfo] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const params = useParams();

     const { getAccessTokenSilently} = useAuth0();
    
    useEffect(() => {
        const fetchData = async () => {
            if (!params.shoeId) return;

            try {
                const accessToken = await getAccessTokenSilently();
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/productService/api/user/get-by-Id/${params.shoeId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    setShoeInfo("Not Found");
                    return;
                }

                const data = await response.json();
                console.log("Fetched shoe data:", data);

                if (data.success) {
                    const defaultVariant = data.data.variants.find(v => v.id === data.data.images[0]?.variantsId) || data.data.variants[0];
                
                    setShoeInfo(data.data);
                    setImages(data.data.images);
                    setSelectedVariant(defaultVariant);
                    setSelectedImage(data.data.images.find(img => img.variantsId === defaultVariant.id)?.imageUrl || data.data.images[0]?.imageUrl);
                }
                
            } catch (error) {
                console.error("Error fetching shoe data:", error);
            }
        };

        fetchData();
    }, [params.shoeId]);

    if (shoeInfo === "Not Found") return <div className="flex justify-center items-center h-[50vh]"><p className="text-xl text-gray-500">Not Found</p></div>;
    if (!shoeInfo) return <div className="flex justify-center items-center h-[50vh]"><p className="text-xl text-gray-500">Loading...</p></div>;

    return (
        <ShoeProduct 
            product={shoeInfo} 
            selectedVariant={selectedVariant} 
            setSelectedVariant={setSelectedVariant} 
            images={images}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            price={shoeInfo.price}
            shoeInfo={shoeInfo}
        />
    );
};

const ShoeProduct = ({ product, selectedVariant, setSelectedVariant, selectedImage, setSelectedImage, price, shoeInfo }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const dispatch = useDispatch();

    const { getAccessTokenSilently} = useAuth0();
    
    
    

    // Extract all unique sizes across variants
    const allSizes = Array.from(
        new Set(product.variants.flatMap((variant) => variant.sizes.map((size) => size.size)))
    ).sort((a, b) => a - b);

    // Check if any size is available across all variants
    const isProductAvailable = product.variants.some(variant =>
        variant.sizes.some(size => size.stock > 0)
    );

    return (
        <div className="flex flex-col md:flex-row gap-6 px-[200px] pt-[40px]">
            {/* Left Side - Image Gallery */}
            <div className="w-full md:w-1/2 flex">
                <div className="ml-4">
                    <img 
                        src={selectedImage || selectedVariant?.images?.[0]?.imageUrl || product.images?.[0]?.imageUrl} 
                        alt={product.name} 
                        className="w-[500px] h-[600px] object-cover rounded-lg shadow-lg" 
                    />
                </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="w-full md:w-1/2">
                <h1 className="text-xl font-semibold">{product.name}</h1>
                <p className="text-gray-500">{product.brand} | {product.category}</p>
                <p className="text-lg font-bold">MRP: ₹ {product.price}</p>

                <p className="text-sm text-gray-400">Inclusive of all taxes</p>
                <p className="mt-3 text-gray-600">{product.description}</p>

                {!isProductAvailable ? (
                    <p className="text-red-500 font-semibold mt-4">Product Unavailable</p>
                ) : (
                    <div className="mt-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Select Size</span>
                            <span className="text-blue-500 text-sm cursor-pointer">Size Guide</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {allSizes.map((size) => {
                                const sizeInfo = selectedVariant?.sizes.find((s) => s.size === size);
                                const isAvailable = sizeInfo && sizeInfo.stock > 0;
                                return (
                                    <button
                                        key={size}
                                        className={`px-4 py-2 border rounded-md ${
                                            isAvailable ? "hover:border-black cursor-pointer" : "text-gray-400 cursor-not-allowed line-through"
                                        } ${selectedSize === size ? "border-black" : "border-gray-300"}`}
                                        disabled={!isAvailable}
                                        onClick={() => isAvailable && setSelectedSize(size)}
                                    >
                                        UK {size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {selectedSize !== null && isProductAvailable && (
                    <p className="mt-2 text-sm text-gray-600">
                        Stock Available: {selectedVariant?.sizes.find(s => s.size === selectedSize)?.stock || 0}{" "}
                        {selectedVariant?.sizes.find(s => s.size === selectedSize)?.stock === 1 ? "pair" : "pairs"}
                    </p>
                )}

                {/* Variant Selection with Images */}
                <div className="mt-6 flex flex-col">
                    <span className="font-medium mb-2">Select Variant</span>
                    <div className="flex gap-2">
                        {product.variants.map((variant) => {
                            const variantImage = product.images.find(img => img.variantsId === variant.id)?.imageUrl;

                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => {
                                        setSelectedVariant(variant);
                                        setSelectedImage(variantImage || product.images?.[0]?.imageUrl);
                                    }}
                                    className={`w-16 h-16 p-1 rounded-md border-2 ${
                                        selectedVariant?.id === variant.id ? "border-black" : "border-gray-300"
                                    }`}
                                >
                                    {variantImage ? (
                                        <img 
                                            src={variantImage} 
                                            alt={`Variant ${variant.color || variant.id}`} 
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6">
                    
                    <button className="w-full  inline-flex h-12 animate-shimmer items-center hover:opacity-90 justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-50" 
                    disabled={!isProductAvailable}
                    onClick={() => { handleAddItem({
                        shoeInfo,
                        selectedVariant,
                        selectedSize,
                        selectedImage,
                        price,
                        dispatch,
                        getAccessTokenSilently,
                        addItem
                    }) }}>
                            Add to cart
                    </button>

                    <button 
                        className="w-full border mt-3 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={!isProductAvailable}
                    >
                        Favourite <span>❤️</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Shoemenu;
