import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  Grid,
  Breadcrumbs,
  Link,
  Skeleton,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { supabase } from '../Supabase/supabaseClient';
import { School, Balance, Language, FrontHand } from '@mui/icons-material';

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const iconMap = {
  School: <School sx={{ fontSize: 40, color: '#FF5252' }} />,
  Language: <Language sx={{ fontSize: 40, color: '#FF5252' }} />,
  Balance: <Balance sx={{ fontSize: 40, color: '#FF5252' }} />,
  FrontHand: <FrontHand sx={{ fontSize: 40, color: '#FF5252' }} />,
};

const CoachingCards = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('Visa Courses').select('*');
      if (!error) setCourses(data);
      else console.error('Error:', error.message);
      setLoading(false);
    };

    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) setUserId(user.id);
    };

    fetchCourses();
    getUser();
  }, []);

  const handleAddToCart = async (course) => {
    if (!userId) {
      alert('Please log in to add items to your cart.');
      return;
    }

    const { data: existingItems, error: selectError } = await supabase
      .from('Course Cart')
      .select('*')
      .eq('user_id', userId)
      .eq('name', course.course_name);

    if (selectError) return console.error(selectError.message);

    if (existingItems.length > 0) {
      alert(`${course.course_name} is already in your cart.`);
      return;
    }

    const { error: insertError } = await supabase.from('Course Cart').insert([{
      name: course.course_name,
      description: course.description,
      img_url: course.img_url,
      price: course.price,
      user_id: userId,
    }]);

    if (insertError) {
      console.error(insertError.message);
      alert('Failed to add to cart.');
    } else {
      alert(`${course.course_name} added to cart.`);
    }
  };

  const ArrowIcon = () => (
    <motion.span
      animate={{ x: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      style={{ fontSize: '16px', marginLeft: '8px' }}
    >
      →
    </motion.span>
  );

  const renderSkeletons = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i} display="flex" justifyContent="center">
        <Card sx={{ borderRadius: 2, width: 350, height: 470 }}>
          <Skeleton variant="rectangular" height={200} animation="wave" />
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
      {/* Top Banner */}
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Box
          sx={{
            height: '300px',
            backgroundImage: 'url(/PageBanner.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            color: '#fff',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.7)' }} />
          <Container sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Immigration Courses
            </Typography>
            <Breadcrumbs sx={{ color: '#FF5252', mt: 1 }} separator="›">
              <Link underline="hover" href="/" sx={{ color: '#FF5252', '&:hover': { color: '#fff' } }}>
                Home
              </Link>
              <Typography sx={{ color: '#FF5252' }}>Courses</Typography>
            </Breadcrumbs>
          </Container>
        </Box>
      </motion.div>

      {/* Course Cards */}
      <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {loading
              ? renderSkeletons()
              : courses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id} display="flex" justifyContent="center">
                    <MotionCard
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      }}
                      sx={{
                        width: 350,
                        height: 470,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {/* Price Tag */}
                      <Box
                        sx={{
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
                          zIndex: 1,
                        }}
                      >
                        Rs. {course.price}
                      </Box>

                      {/* Image */}
                      <CardMedia
                        component="img"
                        image={course.img_url}
                        alt={course.course_name}
                        sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                      />

                      {/* Content */}
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', px: 2, pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                          {iconMap[course.icon] || <Avatar sx={{ bgcolor: '#eee' }}>i</Avatar>}
                        </Box>
                        <Typography variant="h6" align="center" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                          {course.course_name}
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: '#7f8c8d', mb: 2 }}>
                          {course.description}
                        </Typography>

                        {/* Button */}
                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
                          <MotionButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variant="outlined"
                            endIcon={<ArrowIcon />}
                            onClick={() => handleAddToCart(course)}
                            sx={{
                              textTransform: 'none',
                              borderColor: '#E0E0E0',
                              color: '#666',
                              px: 3,
                              py: 1,
                              fontWeight: 500,
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: '#FF5252',
                                color: '#FF5252',
                                backgroundColor: 'rgba(255,82,82,0.04)',
                              },
                            }}
                          >
                            Enroll to Cart
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

export default CoachingCards;
