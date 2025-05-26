import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import FavCard from './FavCard';  
import {  useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { removeItem } from '../utils/cartSlice';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/productService/api/user/getFavourites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFavourites(res.data.data); // adapt if your API shape is different
        res.data.data?.length == 0? toast.warn("No favourites exist."):toast.success("Fetched favourites successfully.")
      } catch (error) {
        toast.error("Error fetching favourites"); 
        console.error(error);
      }
    };

    fetchFavourites();
  }, [getAccessTokenSilently]);
  const handleStockCount = (item) => {
    const totalStock = item.shoeInfo.variants.reduce((variantAcc, variant) => {
      const stock = variant.sizes.reduce((sizeAcc, size) => sizeAcc + size.stock, 0);
      return variantAcc + stock;
    }, 0);
    return totalStock > 0;
  };

  const handleRemove = async (item) => {
    //remoive from redux store and fav db inside db
    console.log(item)
    try{
      const token = await getAccessTokenSilently();
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/productService/api/user/removeFavourite/${item.shoeId}`, {
        headers:{
          Authorization:  `Bearer ${token}`,
        }
      }) 
      if(response.data.success) {
        
        dispatch(removeItem(item));
        setFavourites((prev) =>
          prev.filter((fav) => fav.shoeId !== item.shoeId)
        );
  
        toast.success(`Removed ${item.shoeInfo.name} from favourites.`)
      }
      
    }catch(error) {
      toast.error("Failed to remove product from favourites."); 
      console.log(error)
    }
  }
  return (
    <div className="flex flex-wrap gap-6 p-4 ">
      {favourites.length === 0 ? (
        <p className="text-gray-600">No favourites yet.</p>
      ) : (
        favourites.map((item) => (
          <FavCard
          key={item.id}
          name={item.shoeInfo.name}
          brand={item.shoeInfo.brand}
          price={item.shoeInfo.price}
          imageUrl={item.shoeInfo.images[0].imageUrl}
          inStock={handleStockCount(item)}
          onRemove={() => handleRemove(item)}
          shoeId={item?.shoeInfo?.id} 
          />
          
        ))
      )}
    </div>
  );
};

export default Favourites;

