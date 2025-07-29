import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Skeleton,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../Supabase/supabaseClient';

const MotionCard = motion(Card);
const MotionAvatar = motion(Avatar);
const MotionGridItem = motion(Grid);

const CountryGrid = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from('Countries')
        .select('*')
       
        .order('name', { ascending: true });

      if (error) console.error('Supabase error:', error.message);
      else setCountries(data);

      setLoading(false);
    };

    fetchCountries();
  }, []);

  const renderSkeletons = () =>
      Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} key={index} display="flex" justifyContent="center">
          <Card sx={{ borderRadius: 2, width: 500, height: 300 }}>
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
    <Box>
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
            Countries to Immigrate
          </Typography>
          <Breadcrumbs sx={{ color: '#FF5252', mt: 1 }} separator="›">
            <Link underline="hover" href="/" sx={{ color: '#FF5252', '&:hover': { color: '#fff' } }}>
              Home
            </Link>
            <Typography sx={{ color: '#FF5252' }}>Countries</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Country Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {loading
            ? renderSkeletons()
            : countries.map((country, index) => (
                <MotionGridItem
                  item
                  key={country.id || index}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <MotionCard
                    sx={{
                      height: 380,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      textAlign: 'center',
                      justifyContent: 'flex-start',
                    }}
                    whileHover={{ boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}
                  >
                    {/* Image */}
                    <Box
                      component="img"
                      src={country.image_url}
                      alt={country.name}
                      sx={{
                        width: '100%',
                        height: 160,
                        objectFit: 'cover',
                      }}
                    />

                    {/* Content */}
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        px: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: -6, mb: 2 }}>
                        <MotionAvatar
                          src={country.flag_url}
                          alt={`${country.name} flag`}
                          sx={{
                            width: 80,
                            height: 80,
                            border: '3px solid white',
                            backgroundColor: '#fff',
                          }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6, ease: 'linear' }}
                        />
                      </Box>

                      <Typography variant="h6" fontWeight="bold" color="#2C3E50" gutterBottom>
                        {country.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'gray',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.4em',
                          height: '2.8em',
                        }}
                      >
                        {country.description || 'No description available.'}
                      </Typography>

                      {/* Visit Button */}
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/visacards')}
                        sx={{
                          mt: 'auto',
                          textTransform: 'none',
                          borderColor: '#FF5252',
                          color: '#FF5252',
                          '&:hover': {
                            backgroundColor: '#ffe6e6',
                            borderColor: '#e04848',
                            color: '#e04848',
                          },
                        }}
                      >
                        Visit {country.name}
                      </Button>
                    </CardContent>
                  </MotionCard>
                </MotionGridItem>
              ))}
        </Grid>

        {/* CTA Buttons */}
        <Box textAlign="center" mt={6}>
          <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                color: '#FF5252',
                borderColor: '#FF5252',
                '&:hover': {
                  backgroundColor: '#ffe6e6',
                  borderColor: '#e04848',
                },
              }}
              onClick={() => navigate('/visacards')}
            >
              Apply for Visa
            </Button>

            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                backgroundColor: '#FF5252',
                '&:hover': {
                  backgroundColor: '#e04848',
                },
              }}
              onClick={() => navigate('/immigration-policies')}
            >
              Immigration Policies
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CountryGrid;
