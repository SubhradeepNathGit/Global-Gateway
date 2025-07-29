import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import PhoneIcon from '@mui/icons-material/Phone';

// Define Framer Motion variants
const ctaVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

const ContactBanner = () => {
  const handleCallClick = () => {
    const userConfirmed = confirm(
      '📞 Call Visa Consultation Services?\n\n' +
      '🔹 Phone: +91 8777 777 777\n' +
      '🔹 Available: Mon-Sat, 9 AM - 6 PM\n' +
      '🔹 Free consultation for first-time callers\n\n' +
      'Tap "OK" to dial now or "Cancel" to close.'
    );
    
    if (userConfirmed) {
      // Show brief loading message
      alert('📱 Opening your phone app...\nGet ready to speak with our visa experts!');
      // Small delay for better UX
      setTimeout(() => {
        window.location.href = 'tel:+918777777777';
      }, 800);
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
        py: { xs: 4, md: 6 }
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={{ xs: 3, md: 4 }}
          >
            {/* CTA Text */}
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '1.875rem' },
                textAlign: { xs: 'center', md: 'left' },
                lineHeight: 1.3
              }}
            >
              Are you Looking for Visa Applications? Just Call us!
            </Typography>

            {/* Phone Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<PhoneIcon />}
                onClick={handleCallClick}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  minWidth: '200px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                    transform: 'translateY(-2px)'
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: 1
                  }
                }}
              >
                +91 8777 777 777
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ContactBanner;