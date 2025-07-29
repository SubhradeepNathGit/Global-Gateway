import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { useNavigate } from 'react-router-dom';

const bannerData = [
  {
    image: '/Slider1.jpg',
    title: 'APPLY FOR VISA',
    subtitle: 'IMMIGRATION',
  },
  {
    image: '/Slider2.jpg',
    title: 'EXPLORE THE WORLD',
    subtitle: 'WITH EASE',
  },
  {
    image: '/Slider3.jpg',
    title: 'YOUR JOURNEY',
    subtitle: 'STARTS HERE',
  },
];

const Banner = () => {
  // Move useNavigate to the top level of the component
  const navigate = useNavigate();

  const handleDiscoverMore = () => {
    navigate('/signup');
  };

  return (
    <Box sx={{ width: '100vw', overflowX: 'hidden' }}>
      <Swiper
        modules={[Autoplay, EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        style={{ width: '100vw', height: '100vh' }}
      >
        {bannerData.map((item, index) => (
          <SwiperSlide key={index} style={{ width: '100vw' }}>
            <Box
              sx={{
                height: '100vh',
                width: '100vw',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                color: '#fff',
                textAlign: 'center',
                px: 2,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  zIndex: 0,
                },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 2,
                  zIndex: 1,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '1.8rem', md: '3rem' },
                  mb: 4,
                  zIndex: 1,
                }}
              >
                {item.subtitle}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ff3c3c',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '16px',
                  zIndex: 1,
                  '&:hover': {
                    backgroundColor: '#d83434',
                  },
                }}
                onClick={handleDiscoverMore}
              >
                Discover More
              </Button>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Banner;