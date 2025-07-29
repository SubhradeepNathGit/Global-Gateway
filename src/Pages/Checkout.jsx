import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
  Button,
  Container,
  Breadcrumbs,
  Link,
  Stack,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { ShoppingCart, Receipt, Download, CheckCircle } from '@mui/icons-material';

const CheckoutPage = () => {
  const [visaCart, setVisaCart] = useState([]);
  const [courseCart, setCourseCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Charges and rates
  const visaCharges = {
    immigrationHealthSurcharge: 85000,
    tbTest: 3000,
    biometricVfsCharges: 1000
  };

  const gstRates = { cgst: 0.09, sgst: 0.09 };

  // Fetch cart data
  const fetchCartData = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        toast.error('Please login to view checkout');
        navigate('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      setUserData({ ...userData.user, profile: profileData });

      const { data: visaItems } = await supabase
        .from('Visa Cart')
        .select('*')
        .eq('user_id', userId);
      
      const { data: courseItems } = await supabase
        .from('Course Cart')
        .select('*')
        .eq('user_id', userId);

      setVisaCart(visaItems?.map((v) => ({ ...v, quantity: v.quantity ?? 1 })) || []);
      setCourseCart(courseItems?.map((c) => ({ ...c, quantity: c.quantity ?? 1 })) || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      toast.error('Error loading cart data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Calculate totals
  const allCartItems = [
    ...visaCart.map((i) => ({ ...i, type: 'visa', displayName: i.name })),
    ...courseCart.map((i) => ({ ...i, type: 'course', displayName: i.course_name })),
  ];

  const subtotal = allCartItems.reduce((acc, item) => {
    const price = item.type === 'visa' ? item.price : parseInt(item.price || '0');
    return acc + price * (item.quantity || 1);
  }, 0);

  const hasVisa = visaCart.length > 0;
  const hasCourse = courseCart.length > 0;

  let additionalCharges = 0;
  let chargeBreakdown = [];

  if (hasVisa) {
    additionalCharges += visaCharges.immigrationHealthSurcharge + visaCharges.tbTest + visaCharges.biometricVfsCharges;
    chargeBreakdown.push(
      { label: 'Immigration Health Surcharge', amount: visaCharges.immigrationHealthSurcharge },
      { label: 'TB Test', amount: visaCharges.tbTest },
      { label: 'Biometric + VFS Charges', amount: visaCharges.biometricVfsCharges }
    );
  }

  if (hasCourse) {
    const courseSubtotal = courseCart.reduce((acc, item) => {
      const price = parseInt(item.price || '0');
      return acc + price * (item.quantity || 1);
    }, 0);
    
    const cgstAmount = courseSubtotal * gstRates.cgst;
    const sgstAmount = courseSubtotal * gstRates.sgst;
    
    additionalCharges += cgstAmount + sgstAmount;
    chargeBreakdown.push(
      { label: 'CGST (Central GST) 9%', amount: cgstAmount },
      { label: 'SGST (State GST) 9%', amount: sgstAmount }
    );
  }

  const orderTotal = subtotal + additionalCharges;
  const totalItems = allCartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Auto-download PDF with single page optimization
  const handleDownloadBill = async () => {
    if (!userData || allCartItems.length === 0) {
      toast.error('No data available to generate bill');
      return;
    }

    try {
      const bookingId = uuidv4();
      const customerName = userData.profile?.full_name || userData.user_metadata?.full_name || 'N/A';
      const customerEmail = userData.email || 'N/A';
      const customerPhone = userData.profile?.phone || userData.user_metadata?.phone || 'N/A';
      
      // Compact single-page invoice HTML
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice</title>
          <style>
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            @media print {
              body { margin: 0; font-size: 12px; }
              .no-print { display: none !important; }
              .page-break { page-break-before: always; }
            }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px;
              line-height: 1.3;
              color: #333; 
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 100%; 
              margin: 0 auto; 
            }
            .header { 
              background: #ff5252; 
              color: white; 
              padding: 12px; 
              text-align: center; 
              margin-bottom: 15px;
            }
            .header h1 { 
              margin: 0; 
              font-size: 20px; 
              font-weight: bold;
            }
            .header p { 
              margin: 3px 0 0 0; 
              font-size: 11px;
            }
            .row { 
              display: flex; 
              margin-bottom: 12px;
            }
            .col-half { 
              flex: 1; 
              padding-right: 10px;
            }
            .col-half:last-child { 
              padding-right: 0; 
              padding-left: 10px;
            }
            .info-box {
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 3px;
              background: #f9f9f9;
            }
            .info-box h3 {
              margin: 0 0 8px 0;
              font-size: 13px;
              color: #ff5252;
            }
            .info-box p {
              margin: 3px 0;
              font-size: 11px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 12px 0;
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 6px 8px; 
              text-align: left; 
            }
            th { 
              background: #f5f5f5; 
              font-weight: bold;
              font-size: 10px;
            }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-section {
              margin-top: 15px;
              border-top: 2px solid #ff5252;
              padding-top: 10px;
            }
            .total-row { 
              background: #ff5252; 
              color: white; 
              font-weight: bold; 
            }
            .footer { 
              margin-top: 20px; 
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
            .compact-table td {
              padding: 4px 6px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Global Gateway</h1>
              <p>International Visa & Immigration Services</p>
            </div>
            
            <div class="row">
              <div class="col-half">
                <div class="info-box">
                  <h3>INVOICE DETAILS</h3>
                  <p><strong>Invoice ID:</strong> INV-${bookingId.slice(0, 8).toUpperCase()}</p>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                  <p><strong>Time:</strong> ${new Date().toLocaleTimeString('en-IN')}</p>
                </div>
              </div>
              <div class="col-half">
                <div class="info-box">
                  <h3>CUSTOMER INFORMATION</h3>
                  <p><strong>Name:</strong> ${customerName}</p>
                  <p><strong>Email:</strong> ${customerEmail}</p>
                  <p><strong>Phone:</strong> ${customerPhone}</p>
                </div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th width="15%">Type</th>
                  <th width="45%">Service/Course Name</th>
                  <th width="10%" class="text-center">Qty</th>
                  <th width="15%" class="text-right">Price</th>
                  <th width="15%" class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${allCartItems.map(item => {
                  const price = item.type === 'visa' ? item.price : parseInt(item.price || '0');
                  const total = price * item.quantity;
                  return `
                    <tr>
                      <td>${item.type === 'visa' ? 'Visa' : 'Course'}</td>
                      <td>${item.displayName || 'N/A'}</td>
                      <td class="text-center">${item.quantity}</td>
                      <td class="text-right">₹${price.toLocaleString('en-IN')}</td>
                      <td class="text-right">₹${total.toLocaleString('en-IN')}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <div class="total-section">
              <table class="compact-table">
                <tbody>
                  <tr>
                    <td width="70%"><strong>Subtotal</strong></td>
                    <td width="30%" class="text-right"><strong>₹${subtotal.toLocaleString('en-IN')}</strong></td>
                  </tr>
                  ${chargeBreakdown.map(charge => `
                    <tr>
                      <td>${charge.label}</td>
                      <td class="text-right">₹${Math.round(charge.amount).toLocaleString('en-IN')}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td><strong>TOTAL AMOUNT</strong></td>
                    <td class="text-right"><strong>₹${orderTotal.toLocaleString('en-IN')}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="footer">
              <p><strong>Thank you for choosing our services!</strong></p>
              <p>This is a computer-generated invoice. For queries, contact our support team.</p>
            </div>
          </div>
          
          <script>
            // Auto-download PDF
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              }, 100);
            };
          </script>
        </body>
        </html>
      `;
      
      // Create and auto-download
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        toast.success('PDF download started automatically!');
      } else {
        // Fallback for popup blockers
        const blob = new Blob([invoiceHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${bookingId.slice(0, 8)}_${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Invoice downloaded! Open the file and print to PDF.');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Error generating invoice. Please try again.');
    }
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (allCartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setProcessing(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (!user) {
        toast.error('Please login to complete booking');
        navigate('/login');
        return;
      }

      const order = {
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email,
        visas: visaCart,
        courses: courseCart,
        subtotal: subtotal,
        additionalCharges: additionalCharges,
        total: orderTotal,
        bookingId: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      // Clear cart after successful order
      await supabase.from('Visa Cart').delete().eq('user_id', user.id);
      await supabase.from('Course Cart').delete().eq('user_id', user.id);
      
      setConfirmedOrder(order);
      setOrderConfirmed(true);
      toast.success('Order confirmed successfully!');
      
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Error confirming booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh', 
        flexDirection: 'column', 
        gap: 2,
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <CircularProgress size={60} sx={{ color: '#ff5252' }} />
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Loading checkout...
        </Typography>
      </Box>
    );
  }

  // Order Confirmation Screen
  if (orderConfirmed && confirmedOrder) {
    return (
      <Container 
        maxWidth="md" 
        sx={{ 
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Box sx={{ 
          textAlign: 'center', 
          bgcolor: 'background.paper', 
          borderRadius: 3, 
          p: { xs: 3, sm: 4, md: 6 }, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          mx: 'auto',
          maxWidth: '100%'
        }}>
          <CheckCircle sx={{ 
            fontSize: { xs: 60, sm: 80, md: 100 }, 
            color: '#4caf50', 
            mb: 3 
          }} />
          
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            fontWeight="bold" 
            color="success.main" 
            sx={{ mb: 2 }}
          >
            Booking Confirmed!
          </Typography>
          
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            color="text.secondary" 
            sx={{ mb: 4, px: { xs: 1, sm: 2 } }}
          >
            Thank you for your order! Your booking has been successfully confirmed.
          </Typography>
          
          <Paper elevation={2} sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 4, 
            bgcolor: '#f8f9fa', 
            textAlign: 'left' 
          }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              fontWeight="bold" 
              mb={2} 
              color="primary"
            >
              Order Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Booking ID:</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {confirmedOrder.bookingId?.slice(0, 8).toUpperCase()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                <Typography 
                  variant={isMobile ? "h6" : "h6"} 
                  fontWeight="bold" 
                  color="success.main"
                >
                  ₹{confirmedOrder.total?.toLocaleString('en-IN')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Items:</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {confirmedOrder.visas?.length + confirmedOrder.courses?.length} item(s)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Date:</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date().toLocaleDateString('en-IN')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={2} 
            justifyContent="center"
            alignItems="center"
          >
            <Button 
              variant="outlined" 
              size="large" 
              onClick={handleDownloadBill} 
              startIcon={<Download />} 
              sx={{ 
                borderColor: '#ff5252', 
                color: '#ff5252', 
                px: 4,
                width: isMobile ? '100%' : 'auto',
                maxWidth: { xs: '100%', sm: 'none' }
              }}
            >
              Download Invoice
            </Button>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/')} 
              sx={{ 
                backgroundColor: '#ff5252', 
                px: 4, 
                fontWeight: 'bold',
                width: isMobile ? '100%' : 'auto',
                maxWidth: { xs: '100%', sm: 'none' }
              }}
            >
              Back to Home
            </Button>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Banner */}
      <Box sx={{ 
        height: { xs: 200, sm: 250, md: 300 }, 
        backgroundImage: 'url(/PageBanner.jpg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        display: 'flex', 
        alignItems: 'center', 
        color: '#fff', 
        position: 'relative' 
      }}>
        <Box sx={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          bgcolor: 'rgba(0,0,0,0.6)' 
        }} />
        <Box sx={{ 
          position: 'relative', 
          zIndex: 1, 
          px: { xs: 2, sm: 4, md: 6, lg: 10 }, 
          width: '100%' 
        }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            fontWeight="bold" 
            sx={{ mb: 2 }}
          >
            Checkout
          </Typography>
          <Breadcrumbs 
            sx={{ color: '#FF5252' }} 
            separator="›"
            fontSize={isMobile ? "small" : "medium"}
          >
            <Link 
              underline="hover" 
              href="/" 
              sx={{ color: '#FF5252', '&:hover': { color: '#fff' } }}
            >
              Home
            </Link>
            <Link 
              underline="hover" 
              href="/cart" 
              sx={{ color: '#FF5252', '&:hover': { color: '#fff' } }}
            >
              Cart
            </Link>
            <Typography sx={{ color: '#FF5252' }}>Checkout</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Main Content */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {allCartItems.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mx: 'auto',
            maxWidth: '600px'
          }}>
            <Paper elevation={3} sx={{ 
              p: { xs: 4, sm: 6 }, 
              textAlign: 'center', 
              borderRadius: 2,
              width: '100%'
            }}>
              <ShoppingCart sx={{ 
                fontSize: { xs: 48, sm: 64 }, 
                color: 'text.secondary', 
                mb: 2 
              }} />
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold" 
                mb={2}
              >
                Your Cart is Empty
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                mb={3}
                sx={{ px: { xs: 1, sm: 2 } }}
              >
                Add some items to your cart before proceeding to checkout.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/')} 
                sx={{ 
                  backgroundColor: '#ff5252', 
                  px: 4,
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
            {/* Order Summary */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={3} sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2 
              }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  fontWeight="bold" 
                  mb={3} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    flexWrap: 'wrap'
                  }}
                >
                  <Receipt /> 
                  <Box component="span">
                    Order Summary ({totalItems} item{totalItems > 1 ? 's' : ''})
                  </Box>
                </Typography>
                
                <Stack spacing={2}>
                  {allCartItems.map((item) => {
                    const price = item.type === 'visa' ? item.price : parseInt(item.price || '0');
                    const itemTotal = price * item.quantity;
                    
                    return (
                      <Card key={item.id} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2 
                          }}>
                            <Avatar 
                              src={item.image_url || item.img_url} 
                              variant="rounded" 
                              sx={{ 
                                width: { xs: 60, sm: 80 }, 
                                height: { xs: 60, sm: 80 },
                                alignSelf: { xs: 'center', sm: 'flex-start' }
                              }} 
                            />
                            <Box sx={{ flex: 1, width: '100%' }}>
                              <Typography 
                                variant="subtitle1" 
                                fontWeight="bold" 
                                sx={{ mb: 1 }}
                                textAlign={{ xs: 'center', sm: 'left' }}
                              >
                                {item.type === 'visa' ? 'Visa Service' : 'Course'}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ mb: 1 }}
                                textAlign={{ xs: 'center', sm: 'left' }}
                              >
                                {item.displayName}
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 1, sm: 0 }
                              }}>
                                <Typography variant="body2" color="text.secondary">
                                  Quantity: {item.quantity}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  fontWeight="medium"
                                  textAlign={{ xs: 'center', sm: 'right' }}
                                >
                                  ₹{price.toLocaleString()} × {item.quantity} = ₹{itemTotal.toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </Paper>
            </Grid>

            {/* Payment Summary */}
            <Grid item xs={12} lg={4}>
              <Paper elevation={3} sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2, 
                position: { lg: 'sticky' }, 
                top: 20,
                height: 'fit-content'
              }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  fontWeight="bold" 
                  mb={3}
                >
                  Payment Summary
                </Typography>
                
                <Stack spacing={1} mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ₹{subtotal.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  {chargeBreakdown.map((charge, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          lineHeight: 1.2
                        }}
                      >
                        {charge.label}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        ₹{Math.round(charge.amount).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    fontWeight="bold"
                  >
                    Total Amount
                  </Typography>
                  <Typography 
                    variant={isMobile ? "h6" : "h6"} 
                    fontWeight="bold" 
                    color="success.main"
                  >
                    ₹{orderTotal.toLocaleString()}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  onClick={handleConfirmBooking} 
                  disabled={processing} 
                  sx={{ 
                    backgroundColor: '#ff5252', 
                    py: { xs: 1.2, sm: 1.5 }, 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:hover': {
                      backgroundColor: '#e53935'
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc'
                    }
                  }}
                >
                  {processing ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Processing...
                    </>
                  ) : (
                    'Confirm Order'
                  )}
                </Button>
                
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 2, 
                    display: 'block', 
                    textAlign: 'center',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  By confirming, you agree to our terms and conditions
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default CheckoutPage;