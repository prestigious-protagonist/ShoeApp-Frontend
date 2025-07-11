import React, { useRef, useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import { Navigate, useNavigate } from 'react-router-dom';
//import axios from 'axios';

//import { useAuth0 } from '@auth0/auth0-react';
//import { toast } from 'react-toastify';

const AdminUploadsCard = ({ name, brand, category, price, color, imageUrl, productId, isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  //const { getAccessTokenSilently} = useAuth0();
    const navigate = useNavigate();
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
//   async function handleDelete(productId) {
//   try {
//     const token = await getAccessTokenSilently();
//     console.log("DEEEEEEEEEEEEEEEKHHHHH "+ token)
//     const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/productService/api/v1/removeProduct`, {
//     data: { shoeId: productId },
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//     setTimeout(() => {
//       window.location.reload(); // Hard refresh
//     }, 1000);
//     toast.success("Product deleted successfully!");
//     console.log("Delete response:", response.data);
//   } catch (error) {
//     console.error("Delete error:", error);
//     toast.error(error.response?.data?.message || "Failed to delete the product.");
//   }
// }
  const handleOptionClick = async (option) => {
    setMenuOpen(false);
    switch (option) {
      case "add-Variant":
        // navigate or modal
        navigate(`addVariant/${productId}`)
        break;
      case "add-image":
        navigate(`variants/${productId}`)
        break;
      // case "edit":
      //   alert(`Edit Product ${productId}`);
      //   break;
      // case "delete":
      //   await handleDelete(productId);
      //   break;
      default:
        break;
    }
  };

  return (
    <Card
    onClick={() => {
    if (!menuOpen) {
      navigate(`/shoes/${productId}`);
    }
  }}
      sx={{
        width: 300,
        position: 'relative',
        p: 2,
        backgroundColor: 'white',
        cursor: 'pointer',
        boxShadow: 'none',
        border: '1px solid #e5e7eb'
      }}
    >
      {/* Admin Settings Icon */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-20" ref={menuRef}>
          <IconButton
           onClick={(e) => {
                e.stopPropagation(); // <== THIS LINE IS IMPORTANT
                setMenuOpen((prev) => !prev);
            }}
            size="sm"
            sx={{
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          >
            <MoreVertical size={20} />
          </IconButton>

          {/* Options Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-30">
              <ul className="text-sm text-gray-700" onClick={(e) => e.stopPropagation()}>
                <li
                  onClick={() => handleOptionClick('add-Variant')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  ➕ Add Variant
                </li>
                <li
                  onClick={() => handleOptionClick('add-image')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  🖼️ Add Image
                </li>
                
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Product Image */}
      <AspectRatio ratio="1" sx={{ width: '100%' }}>
        <img src={imageUrl} loading="lazy" alt="Product" style={{ objectFit: 'cover' }} />
      </AspectRatio>

      {/* Product Details */}
      <CardContent sx={{ p: 2 }}>
        <Typography level="title-md" sx={{ fontWeight: 600 }}>
          {brand} {name}
        </Typography>
        <Typography level="body-sm" sx={{ color: 'gray' }}>
          {category}
        </Typography>
        <Typography level="body-sm" sx={{ color: 'gray', mb: 1 }}>
          {color} {color > 1 ? 'Colours' : 'Colour'}
        </Typography>

        <Typography sx={{ fontWeight: 'bold', fontSize: 'lg' }}>
          ₹ {price}
        </Typography>
        <Typography sx={{ fontSize: 'sm', color: 'gray' }}>
          MRP: ₹ {(price * 1.2).toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AdminUploadsCard;
