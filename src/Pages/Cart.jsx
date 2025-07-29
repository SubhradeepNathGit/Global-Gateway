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
  const [shipping, setShipping] = useState(70);

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

  const orderTotal = subtotal + shipping;

  const handlePayment = async () => {
    const items = [...visaCart, ...courseCart];
    if (!items.length) return toast.error("Your cart is empty!");
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return toast.error("Login required!");

    const order = {
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email,
      visas: visaCart,
      courses: courseCart,
      total: orderTotal,
      bookingId: uuidv4(),
    };

    toast.success("Order placed!");
    setTimeout(async () => {
      await supabase.from("Visa Cart").delete().eq("user_id", user.id);
      await supabase.from("Course Cart").delete().eq("user_id", user.id);
      navigate("/booking_received", { state: order });
    }, 1200);
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
          display: "grid",
          gridTemplateColumns: "60px 3fr 1fr 1fr 1fr 1fr 40px",
          px: 2,
          py: 2,
          alignItems: "center",
          borderBottom: "1px solid #eee",
          gap: 2,
        }}
      >
        <Avatar src={item.image_url || item.img_url} variant="rounded" sx={{ width: 60, height: 60 }} />
        <Box>
          <Typography fontWeight="bold">
            {item.type === "visa" ? "Visa Service" : "Course"}
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            {item.displayName}
          </Typography>
        </Box>
        <Typography fontWeight="medium">₹{price}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: 1 }}>
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
        <Box />
        <Typography fontWeight="bold" color="success.main">₹{total}</Typography>
        <IconButton onClick={() => handleDelete(item.type, item.id)}>
          <Close />
        </IconButton>
      </MotionBox>
    );
  };

  return (
    <>
      {/* Banner */}
      <Box
        sx={{
          height: 300,
          backgroundImage: "url(/PageBanner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          color: "#fff",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.6)" }} />
        <Box sx={{ position: "relative", zIndex: 1, px: 10, width: "100%" }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
            Your Cart
          </Typography>
          <Breadcrumbs sx={{ color: "#FF5252" }} separator="›">
            <Link 
              underline="hover" 
              href="/" 
              sx={{ 
                color: "#FF5252", 
                "&:hover": { color: "#fff" }
              }}
            >
              Home
            </Link>
            <Typography sx={{ color: "#FF5252" }}>
              Cart
            </Typography>
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
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                  Order Details ({allCartItems.length} item{allCartItems.length > 1 ? 's' : ''})
                </Typography>

                {/* Desktop Header */}
                <Box
                  sx={{
                    display: "grid",
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
            </Grid>

            {/* Desktop Sidebar */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                {/* Calculate Shipping */}
                <Card elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Calculate Shipping
                  </Typography>
                  <Stack spacing={2}>
                    <TextField 
                      select 
                      fullWidth 
                      SelectProps={{ native: true }} 
                      size="small"
                      variant="outlined"
                    >
                      <option value="">Select Country</option>
                      <option value="india">India</option>
                      <option value="usa">USA</option>
                    </TextField>
                    <TextField 
                      label="State/Province" 
                      size="small" 
                      fullWidth 
                      variant="outlined"
                    />
                    <TextField 
                      label="ZIP / Postcode" 
                      size="small" 
                      fullWidth 
                      variant="outlined"
                    />
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        backgroundColor: "#ff5252", 
                        "&:hover": { backgroundColor: "#f44336" },
                        py: 1.5,
                      }}
                    >
                      Update Totals
                    </Button>
                  </Stack>
                </Card>

                {/* Cart Totals */}
                <Card elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Cart Totals
                  </Typography>
                  <Stack spacing={1} mb={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Subtotal</Typography>
                      <Typography fontWeight="medium">₹{subtotal}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Shipping</Typography>
                      <Typography fontWeight="medium">₹{shipping.toFixed(2)}</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" mb={3}>
                    <Typography variant="h6" fontWeight="bold">Total</Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      ₹{orderTotal}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handlePayment}
                    disabled={allCartItems.length === 0}
                    sx={{
                      backgroundColor: "#ff5252",
                      py: 1.5,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      "&:hover": { backgroundColor: "#f44336" },
                      "&:disabled": { backgroundColor: "#ccc" },
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Cart;