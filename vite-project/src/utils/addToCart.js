// utils/addToCartUtils.js
import { toast } from 'react-toastify';
export const handleAddItem = async ({
    shoeInfo,
    selectedVariant,
    selectedSize,
    selectedImage,
    price,
    dispatch,
    getAccessTokenSilently,
    addItem
}) => {
    // if (!selectedSize) {
    //     toast.warn("Please select a size before adding to cart.");
    //     return;
    // }

    const cartData = {
        shoeId: shoeInfo.id,
        variantId: selectedVariant.id,
        size: selectedSize,
        imageUrl: selectedImage,
        price,
    };

try {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cartService/api/v1/addProduct`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
    });

    const data = await response.json(); // <- You need to parse the JSON before checking its properties

    if (!response.ok || !data.success) {
        // Show server error message if available
        toast.error(data.message || "Couldn't add to cart at the moment");
        return;
    }

    console.log(data.data[0]);
    toast.success(data.message);
    dispatch(addItem(data.data[0]));

} catch (error) {
    console.error("Error adding item to cart:", error);
    toast.error(error?.message || "Something went wrong. Please try again later.");
}

};
