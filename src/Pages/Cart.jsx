import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  Avatar,
  Paper,
  Container,
  Breadcrumbs,
  Link,
  Stack,
} from "@mui/material";
import { Add, Remove, Close, ShoppingCart } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../Supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const MotionBox = motion(Box);

const Cart = () => {
  const [visaCart, setVisaCart] = useState([]);
  const [courseCart, setCourseCart] = useState([]);
  // Visa-related charges
  const visaCharges = {
    immigrationHealthSurcharge: 85000,
    tbTest: 3000,
    biometricVfsCharges: 1000
  };

  // Course-related charges (GST rates)
  const gstRates = {
    cgst: 0.09, // 9%
    sgst: 0.09  // 9%
  };

  const navigate = useNavigate();

  const fetchCartData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const { data: visaItems } = await supabase.from("Visa Cart").select("*").eq("user_id", userId);
    const { data: courseItems } = await supabase.from("Course Cart").select("*").eq("user_id", userId);

    setVisaCart(visaItems?.map((v) => ({ ...v, quantity: v.quantity ?? 1 })) || []);
    setCourseCart(courseItems?.map((c) => ({ ...c, quantity: c.quantity ?? 1 })) || []);
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleQuantityChange = (type, id, op) => {
    const update = (list) =>
      list.map((item) =>
        item.id === id
          ? { ...item, quantity: op === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item
      );
    if (type === "visa") setVisaCart(update);
    else setCourseCart(update);
  };

  const handleDelete = async (type, id) => {
    const table = type === "visa" ? "Visa Cart" : "Course Cart";
    try {
      await supabase.from(table).delete().eq("id", id);
      toast.success(`${type === "visa" ? "Visa" : "Course"} removed`);
      if (type === "visa") setVisaCart((prev) => prev.filter((i) => i.id !== id));
      else setCourseCart((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast.error("Error removing item");
    }
  };

  const allCartItems = [
    ...visaCart.map((i) => ({ ...i, type: "visa", displayName: i.name })),
    ...courseCart.map((i) => ({ ...i, type: "course", displayName: i.course_name })),
  ];

  const subtotal = allCartItems.reduce((acc, item) => {
    const price = item.type === "visa" ? item.price : parseInt(item.price || "0");
    return acc + price * (item.quantity || 1);
  }, 0);

  // Calculate additional charges based on cart contents
  const hasVisa = visaCart.length > 0;
  const hasCourse = courseCart.length > 0;

  let additionalCharges = 0;
  let chargeBreakdown = [];

  if (hasVisa) {
    additionalCharges += visaCharges.immigrationHealthSurcharge + visaCharges.tbTest + visaCharges.biometricVfsCharges;
    chargeBreakdown.push(
      { label: "Immigration Health Surcharge", amount: visaCharges.immigrationHealthSurcharge },
      { label: "TB Test", amount: visaCharges.tbTest },
      { label: "Biometric + VFS Charges", amount: visaCharges.biometricVfsCharges }
    );
  }

  if (hasCourse) {
    const courseSubtotal = courseCart.reduce((acc, item) => {
      const price = parseInt(item.price || "0");
      return acc + price * (item.quantity || 1);
    }, 0);
    
    const cgstAmount = courseSubtotal * gstRates.cgst;
    const sgstAmount = courseSubtotal * gstRates.sgst;
    
    additionalCharges += cgstAmount + sgstAmount;
    chargeBreakdown.push(
      { label: "CGST (Central GST) 9%", amount: cgstAmount },
      { label: "SGST (State GST) 9%", amount: sgstAmount }
    );
  }

  const orderTotal = subtotal + additionalCharges;

  const handleCheckout = () => {
    if (!allCartItems.length) {
      toast.error("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  // Desktop Cart Item Component
  const DesktopCartItem = ({ item, index }) => {
    const price = item.type === "visa" ? item.price : parseInt(item.price);
    const total = price * item.quantity;

    return (
      <MotionBox
        key={item.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        sx={{
          display: { xs: "flex", md: "grid" },
          gridTemplateColumns: { md: "60px 3fr 1fr 1fr 1fr 1fr 40px" },
          flexDirection: { xs: "column", md: "row" },
          px: 2,
          py: 2,
          alignItems: "center",
          borderBottom: "1px solid #eee",
          gap: 2,
        }}
      >
        {/* Mobile Layout */}
        <Box sx={{ display: { xs: "flex", md: "contents" }, width: "100%", gap: 2 }}>
          <Avatar 
            src={item.image_url || item.img_url} 
            variant="rounded" 
            sx={{ 
              width: { xs: 80, md: 60 }, 
              height: { xs: 80, md: 60 },
              flexShrink: 0
            }} 
          />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight="bold" sx={{ fontSize: { xs: "1rem", md: "0.875rem" } }}>
              {item.type === "visa" ? "Visa Service" : "Course"}
            </Typography>
            <Typography fontSize={{ xs: 14, md: 14 }} color="text.secondary" sx={{ mb: { xs: 1, md: 0 } }}>
              {item.displayName}
            </Typography>
            
            {/* Mobile: Price, Quantity, Total in a row */}
            <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "space-between", alignItems: "center", mt: 1 }}>
              <Typography fontWeight="medium" sx={{ fontSize: "0.875rem" }}>₹{price}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: 1 }}>
                <IconButton size="small" onClick={() => handleQuantityChange(item.type, item.id, "dec")}>
                  <Remove fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 1, minWidth: "30px", textAlign: "center", fontSize: "0.875rem" }}>
                  {item.quantity}
                </Typography>
                <IconButton size="small" onClick={() => handleQuantityChange(item.type, item.id, "inc")}>
                  <Add fontSize="small" />
                </IconButton>
              </Box>
              <Typography fontWeight="bold" color="success.main" sx={{ fontSize: "0.875rem" }}>₹{total}</Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={() => handleDelete(item.type, item.id)}
            sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Desktop Layout - Hidden on mobile */}
        <Typography fontWeight="medium" sx={{ display: { xs: "none", md: "block" } }}>₹{price}</Typography>
        <Box sx={{ 
          display: { xs: "none", md: "flex" }, 
          alignItems: "center", 
          border: "1px solid #ccc", 
          borderRadius: 1 
        }}>
          <IconButton size="small" onClick={() => handleQuantityChange(item.type, item.id, "dec")}>
            <Remove fontSize="small" />
          </IconButton>
          <Typography sx={{ px: 1, minWidth: "30px", textAlign: "center" }}>
            {item.quantity}
          </Typography>
          <IconButton size="small" onClick={() => handleQuantityChange(item.type, item.id, "inc")}>
            <Add fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }} />
        <Typography fontWeight="bold" color="success.main" sx={{ display: { xs: "none", md: "block" } }}>₹{total}</Typography>
      </MotionBox>
    );
  };

  return (
    <>
      
            {/* Top Banner */}
            <Box
              sx={{
                height: '300px',
                backgroundImage: 'url(/PageBanner.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  px: { xs: 2, md: 10 },
                }}
              >
                <Typography variant="h3" fontWeight="bold">
                  Your Cart
                </Typography>
                <Breadcrumbs sx={{ color: '#FF5252', mt: 1 }} separator="›">
                  <Link underline="hover" href="/" sx={{ color: '#FF5252', '&:hover': { color: '#fff' } }}>
                    Home
                  </Link>
                  <Typography sx={{ color: '#FF5252' }}>Cart</Typography>
                </Breadcrumbs>
              </Box>
            </Box>

      {/* Main Cart */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {allCartItems.length === 0 ? (
          <Paper elevation={3} sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
            <ShoppingCart sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Looks like you haven't added any items to your cart yet.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: "#ff5252",
                "&:hover": { backgroundColor: "#f44336" },
                px: 4,
                py: 1.5,
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Stack spacing={4}>
            {/* Cart Items */}
            <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                Order Details ({allCartItems.length} item{allCartItems.length > 1 ? 's' : ''})
              </Typography>

              {/* Desktop Header - Hidden on mobile */}
              <Box
                sx={{
                  display: { xs: "none", md: "grid" },
                  gridTemplateColumns: "60px 3fr 1fr 1fr 1fr 1fr 40px",
                  px: 2,
                  py: 1,
                  backgroundColor: "#f5f5f5",
                  borderBottom: "1px solid #ddd",
                  gap: 2,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">Photo</Typography>
                <Typography variant="subtitle2" fontWeight="bold">Product</Typography>
                <Typography variant="subtitle2" fontWeight="bold">Price</Typography>
                <Typography variant="subtitle2" fontWeight="bold">Qty</Typography>
                <Box />
                <Typography variant="subtitle2" fontWeight="bold">Total</Typography>
                <Box />
              </Box>

              {/* Cart Items */}
              {allCartItems.map((item, index) => (
                <DesktopCartItem key={item.id} item={item} index={index} />
              ))}
            </Paper>

            {/* Cart Totals - Full Width */}
            <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Cart Totals
              </Typography>
              <Stack spacing={1} mb={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Subtotal</Typography>
                  <Typography fontWeight="medium">₹{subtotal.toLocaleString()}</Typography>
                </Box>
                
                {/* Dynamic Additional Charges */}
                {chargeBreakdown.map((charge, index) => (
                  <Box key={index} display="flex" justifyContent="space-between">
                    <Typography>{charge.label}</Typography>
                    <Typography fontWeight="medium">₹{charge.amount.toLocaleString()}</Typography>
                  </Box>
                ))}
                
                {chargeBreakdown.length === 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Additional Charges</Typography>
                    <Typography fontWeight="medium">₹0</Typography>
                  </Box>
                )}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  ₹{orderTotal.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: { xs: "stretch", md: "flex-end" } }}>
                <Button
                  variant="contained"
                  onClick={handleCheckout}
                  disabled={allCartItems.length === 0}
                  sx={{
                    backgroundColor: "#ff5252",
                    py: 1.5,
                    px: { xs: 4, md: 6 },
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    width: { xs: "100%", md: "auto" },
                    minWidth: { md: "200px" },
                    "&:hover": { backgroundColor: "#f44336" },
                    "&:disabled": { backgroundColor: "#ccc" },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </Paper>
          </Stack>
        )}
      </Container>
    </>
  );
};

export default Cart;