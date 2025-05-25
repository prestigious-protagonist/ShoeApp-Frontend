import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import { Star } from 'lucide-react';
import { useEffect } from 'react';
import Typography from '@mui/joy/Typography';
import { useState } from 'react';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
// Import Axios or your API call method
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
export default function ProductCard({ name, brand, category, price, color, imageUrl, productId }) {
  
  const [isFavorite, setIsFavorite] = useState(false);
  console.log(isFavorite);
  const { getAccessTokenSilently } = useAuth0();


  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/productService/api/user/checkFavourite/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          setIsFavorite(true);
        }
      } catch (err) {
        console.error('Error checking favorite status:', err);
      }
    };
  
    checkIfFavorite();
  }, [getAccessTokenSilently, productId]);
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
  
    try {
      const token = await getAccessTokenSilently();
  
      if (isFavorite) {
        // Remove from favorites
        const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/productService/api/user/removeFavourite/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.data.success) {
          setIsFavorite(false);
          toast('Removed from Favorites!');
        } else {
          toast('Failed to remove from favorites');
        }
  
      } else {
        // Add to favorites
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/productService/api/user/addToFavourites/${productId}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.status === 201) {
          setIsFavorite(true);
          toast.success('Added to Favorites!');
        } else {
          toast.error('Failed to add to favorites');
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Something went wrong.');
    }
  };
  

  return (
    <Card
      sx={{
        width: 300,
        boxShadow: 'none',
        border: 'none',
        position: 'relative',
        p: 2,
        backgroundColor: 'white',
        cursor: 'pointer',
      }}
    >
      {/* Cart Icon (Top Right) */}
      <IconButton
  variant="soft"
  color={isFavorite ? 'warning' : 'neutral'}
  size="md"
  sx={{
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: '50%',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }}
  aria-label="Toggle Favorite"
  onClick={handleToggleFavorite}
>
  <Star fill={isFavorite ? 'orange' : 'none'} />
</IconButton>



      {/* Image Section */}
      <AspectRatio ratio="1" sx={{ width: '100%' }}>
        <img
          src={imageUrl}
          loading="lazy"
          alt="Product Image"
          style={{ objectFit: 'cover' }}
        />
      </AspectRatio>

      {/* Content Section */}
      <CardContent sx={{ backgroundColor: 'white', p: 2 }}>
        <Typography level="title-md" sx={{ fontWeight: 600 }}>
          {`${brand} ${name}`}
        </Typography>
        <Typography level="body-sm" sx={{ color: 'gray' }}>
          {category}
        </Typography>
        <Typography level="body-sm" sx={{ color: 'gray', mb: 1 }}>
          {color} {color > 1 ? 'Colours' : 'Colour'}
        </Typography>

        {/* Pricing */}
        <Typography sx={{ fontWeight: 'bold', fontSize: 'lg' }}>
          {'₹ ' + price}
        </Typography>
        <Typography sx={{ fontSize: 'sm', color: 'gray' }}>
          MRP: ₹ {price + 0.2 * price}.00
        </Typography>
      </CardContent>
    </Card>
  );
}
