import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, CardMedia, Typography, Button, Container, Grid,
    Breadcrumbs, Link, Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import { supabase } from '../Supabase/supabaseClient';

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const VisaCardsSection = () => {
    const [visaCards, setVisaCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchVisaData = async () => {
            const { data, error } = await supabase.from('Visa').select('*');
            if (error) console.error('Failed to fetch visa data:', error.message);
            else setVisaCards(data);
            setLoading(false);
        };

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };

        fetchVisaData();
        getUser();
    }, []);

    const handleAddToCart = async (visa) => {
        if (!userId) {
            alert('Please log in to add items to your cart.');
            return;
        }

        // Check if item already exists in cart
        const { data: existingItem, error: fetchError } = await supabase
            .from('Visa Cart')
            .select('*')
            .eq('user_id', userId)
            .eq('id', visa.id)
            .single();

        if (existingItem) {
            alert(`${visa.name} is already in your cart.`);
            return;
        }

        const { error: insertError } = await supabase.from('Visa Cart').insert([
            {
                id: visa.id,
                name: visa.name,
                description: visa.description,
                image_url: visa.image_url,
                price: visa.price,
                user_id: userId
            }
        ]);

        if (insertError) {
            console.error('Error adding to cart:', insertError.message);
            alert('Failed to add to cart. Try again.');
        } else {
            alert(`${visa.name} added to cart successfully!`);
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
        hover: {
            scale: 1.05,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            transition: { duration: 0.3 }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95 }
    };

    const bannerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    const ArrowIcon = () => (
        <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{ fontSize: '16px', marginLeft: '8px' }}
        >
            →
        </motion.span>
    );

   const renderSkeletons = () =>
         Array.from({ length: 4 }).map((_, index) => (
           <Grid item xs={12} sm={6} key={index} display="flex" justifyContent="center">
             <Card sx={{ borderRadius: 2, width:450, height: 400 }}>
               <Skeleton variant="rectangular" height={200} />
               <CardContent>
                 <Skeleton width="60%" height={32} />
                 <Skeleton width="100%" />
                 <Skeleton width="80%" />
                 <Skeleton width="40%" sx={{ mt: 2 }} />
               </CardContent>
             </Card>
           </Grid>
        ));

    return (
        <>
            {/* Banner */}
            <motion.div initial="hidden" animate="visible" variants={bannerVariants}>
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
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                            >
                                Visa Services
                            </Typography>

                            <Breadcrumbs sx={{ color: '#FF5252', mt: 1 }} separator="›">
                                <Link underline="hover" href="/" sx={{ color: '#FF5252', '&:hover': { color: '#fff' } }}>
                                    Home
                                </Link>
                                <Typography sx={{ color: '#FF5252' }}>Apply Visa</Typography>
                            </Breadcrumbs>
                        </motion.div>
                    </Container>
                </Box>
            </motion.div>

            {/* Cards Section */}
            <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        {loading ? renderSkeletons() : visaCards.map((visa) => (
                            <Grid item xs={12} sm={6} md={4} key={visa.id} sx={{ display: 'flex' }}>
                                <MotionCard
                                    variants={cardVariants}
                                    initial="hidden"
                                   
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    whileHover="hover"
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease-in-out',
                                    }}
                                >
                                    {/* Price Tag */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        backgroundColor: '#FF5252',
                                        color: 'white',
                                        borderRadius: '20px',
                                        px: 2,
                                        py: 0.5,
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        zIndex: 1
                                    }}>
                                        Rs. {visa.price}
                                    </Box>

                                    {/* Image */}
                                    <Box sx={{ height: '240px', overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            image={visa.image_url}
                                            alt={visa.name}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                filter: 'brightness(0.9)',
                                            }}
                                        />
                                    </Box>

                                    {/* Content */}
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            p: 3,
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            component="h3"
                                            align='center'
                                            gutterBottom
                                            sx={{ fontWeight: 600, color: '#2C3E50' }}
                                        >
                                            {visa.name}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            align='center'
                                            sx={{ color: '#7f8c8d', mb: 2 }}
                                        >
                                            {visa.description}
                                        </Typography>

                                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
                                            <MotionButton
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                variant="outlined"
                                                endIcon={<ArrowIcon />}
                                                onClick={() => handleAddToCart(visa)}
                                                sx={{
                                                    borderColor: '#E0E0E0',
                                                    color: '#666',
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                    px: 3,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        borderColor: '#FF5252',
                                                        color: '#FF5252',
                                                        backgroundColor: 'rgba(255,82,82,0.04)',
                                                    },
                                                }}
                                            >
                                                Add to Cart
                                            </MotionButton>
                                        </Box>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default VisaCardsSection;
