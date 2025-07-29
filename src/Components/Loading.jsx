import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FlightIcon from '@mui/icons-material/Flight';
import { useSelector } from 'react-redux';

const LoadingAnimation = () => {
  const { isLoading, loadingMessage } = useSelector((state) => state.loading);

  // Container animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4 }
    }
  };


  const planeVariants = {
    initial: { 
      x: -100,
      opacity: 0,
      rotate: -10
    },
    animate: { 
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    },
    float: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    takeoff: {
      y: -500,
      x: 100,
      rotate: -15,
      scale: 0.5,
      opacity: 0,
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  // Text animation variants
  const textVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: 0.8,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            background: 'hsla(208, 41%, 15%, 1.00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Background animated shapes */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              
            }}
          >
            {/* Floating circles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
                style={{
                  position: 'absolute',
                  width: 80 + i * 20,
                  height: 80 + i * 20,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  left: `${10 + i * 15}%`,
                  top: `${10 + i * 10}%`,
                }}
              />
            ))}
          </Box>

          {/* Main content container */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              zIndex: 1,
              textAlign: 'center',
              px: 4
            }}
          >
            {/* Animated plane icon */}
            <Box sx={{ position: 'relative' }}>
              <motion.div
                variants={planeVariants}
                initial="initial"
                animate={!isLoading ? ["takeoff"] : ["animate", "float"]}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <FlightIcon
                    sx={{
                      fontSize: 50,
                      color: 'white',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))'
                    }}
                  />
                </Box>
              </motion.div>

              {/* Rotating ring around plane */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  border: '2px solid transparent',
                  borderTop: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRight: '2px solid rgba(255, 255, 255, 0.1)'
                }}
              />
            </Box>

            {/* Loading text */}
            <motion.div
              variants={textVariants}
              initial="initial"
              animate="animate"
            >
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                Welcome to Global Gateway
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Crafting Comfort Across Continents over a Decade
              </Typography>
            </motion.div>

            {/* Modern progress bar - RED */}
            <Box sx={{ width: '300px', maxWidth: '80vw', position: 'relative' }}>
              <LinearProgress
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
                    boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)'
                  }
                }}
              />
            </Box>

            {/* Animated dots */}
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: "easeInOut"
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.6)',
                      boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)'
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingAnimation;