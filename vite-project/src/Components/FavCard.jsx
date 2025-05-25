import * as React from 'react';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { X } from 'lucide-react';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import AspectRatio from '@mui/joy/AspectRatio';
import { useNavigate } from 'react-router-dom';
export default function ProductCard({ name, description, price, inStock, imageUrl, onRemove, shoeId }) {
  const navigate = useNavigate()
  return (
    <div className='cursor-pointer' onClick={()=> navigate(`/shoes/${shoeId}`)}>
    <Card
      variant="outlined"
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        '&:hover': {
          boxShadow: 'sm',
          borderColor: 'neutral.outlinedHoverBorder',
        },
      }}
    >
      {/* Product Image (Left-aligned) */}
      <AspectRatio
        ratio="1"
        variant="outlined"
        sx={{
          width: 60,
          borderRadius: 'sm',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AspectRatio>

      {/* Product Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography level="title-md" noWrap>
          {name}
        </Typography>
        <Typography level="body-sm" textColor="text.secondary" noWrap>
          {description}
        </Typography>
      </Box>

      {/* Price */}
      <Typography level="body-lg" fontWeight="lg" sx={{ minWidth: 80, textAlign: 'right' }}>
        ${price}
      </Typography>

      {/* Stock Status */}
      <Chip
        variant="soft"
        color={inStock ? 'success' : 'danger'}
        size="sm"
        sx={{ minWidth: 80, borderRadius: 'sm' }}
      >
        {inStock ? 'In Stock' : 'Stock Out'}
      </Chip>

      {/* Action Button */}
      <Box sx={{ minWidth: 120 }}>
        {inStock ? (
          <Button
            variant="solid"
            color="primary"
            size="sm"
            sx={{ '--Button-radius': '20px', width: '100%' }}
            
          >
            Add to Cart
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{ '--Button-radius': '20px', width: '100%' }}
          >
            Add to Cart
          </Button>
        )}
      </Box>

      {/* Remove Button */}
  <Button
    variant="plain"
    color="danger"
    size="sm"
    onClick={(e)=>{
      e.stopPropagation()
      onRemove()
    }}
    sx={{
      '--Button-radius': '50%',
      position: 'absolute', // position the button absolutely
      top: 0,               // align to the top of the parent container
      right: 0,             // align to the right of the parent container
      
    }}
  >
    <X />
  </Button>
      
    </Card>
    </div>
  );
}