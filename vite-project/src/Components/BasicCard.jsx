import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import { Category } from '@mui/icons-material';
//import { useDispatch } from 'react-redux';
//import { addItem } from '../utils/cartSlice';
export default function ProductCard({ name, brand, category, price, color, imageUrl }) {
  //const dispatch = useDispatch()
  // function handleAddItem(item) {
  //     console.log("Structure"+JSON.stringify(item, null ,2))
  //     dispatch(addItem(item))
  // }
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
       // Makes the entire card clickable
    >
      {/* Cart Icon (Top Right) */}
      <IconButton
  variant="soft"
  color="neutral"
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
  aria-label="Add to cart"
  onClick={(e) => {
    e.preventDefault()
    //handleAddItem({ name, brand, category, price, color, imageUrl })
  }}
>
  <ShoppingCartOutlined />
</IconButton>


      {/* Image Section */}
      <AspectRatio ratio="1" sx={{ width: '100%' }}>
        <img
          src={imageUrl}
          loading="lazy"
          alt="Shoe Image"
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
          {color} {color>1?" Colours":" Colour"}
        </Typography>

        {/* Pricing */}
        <Typography sx={{ fontWeight: 'bold', fontSize: 'lg' }}>
          {"₹ "+price}
        </Typography>
        <Typography sx={{ fontSize: 'sm', color: 'gray' }}>
          MRP: ₹ {price+ 0.2*price}.00
        </Typography>
      </CardContent>
    </Card>
  );
}
