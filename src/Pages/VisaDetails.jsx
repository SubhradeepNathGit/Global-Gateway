import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Card,
  Button,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';

const visaOptions = [
  'Student Visa',
  'Family Visa',
  'Tourist Visa',
  'Business Visa',
  'Worker Visa',
  'Diplomatic Visa',
    'Resident Visa',
];

const VisaDetails = () => {
  return (
    <Box>
      {/* ===== Banner ===== */}
      <Box
        sx={{
          height: 300,
          backgroundImage: 'url(/PageBanner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.7)',
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 10 } }}>
          <Typography variant="h3" fontWeight="bold">
            Visa Details
          </Typography>
          <Breadcrumbs sx={{ mt: 1 }} separator="›">
            <Link underline="hover" href="/" sx={{ color: 'red' }}>
              Home
            </Link>
            <Typography sx={{ color: 'red' }}>Visa Details</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* ===== Main Content ===== */}
      <Box
        sx={{
          px: { xs: 2, md: 10 },
          py: 8,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        {/* ===== Left Sidebar ===== */}
        <Box sx={{ width: '40%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {visaOptions.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    p: 2,
                    backgroundColor: index === 0 ? '#1d2b40' : '#fff',
                    color: index === 0 ? '#fff' : '#333',
                    boxShadow: 2,
                    cursor: 'pointer',
                    borderLeft: index === 0 ? '5px solid #ff4c4c' : 'none',
                    '&:hover': {
                      backgroundColor: '#f7f7f7',
                      color: '#333',
                    },
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {option}
                  </Typography>
                </Card>
              </motion.div>
            ))}
          </Box>

          {/* ===== Book Now ===== */}
          <Card
            sx={{
              py: 3,
              mt: 4,
              textAlign: 'center',
              backgroundColor: 'hsla(0, 100%, 100%, 0.40)',
              boxShadow: 2,
              px: 2,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="caption" color="text.secondary">
                VISA CONSULTATION
              </Typography>
              <Typography variant="h5" color="#ff4c4c" fontWeight={600} my={1}>
                $30.00
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#ff4c4c',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#e53935',
                  },
                }}
              >
                BOOK NOW
              </Button>
            </motion.div>
          </Card>
        </Box>

        {/* ===== Right Content ===== */}
        <Box sx={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component="img"
              src="/VisaDetails.jpg"
              width="100%"
              sx={{ borderRadius: 2, mb: 3 }}
              alt="Visa Consultation"
            />
          </motion.div>

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Visa Overview
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={2}>
            Lorem ipsum is simply free text used by copytyping refreshing. Neque porro est qui dolorem ipsum quia
            quaed inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis
            enim var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur magni doloremque enim vero. Ducimus, autem. Nesciunt placeat rerum autem eum, in quisquam, adipisci, cupiditate fuga dicta eius expedita ad culpa.
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make a type specimen book.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VisaDetails;
