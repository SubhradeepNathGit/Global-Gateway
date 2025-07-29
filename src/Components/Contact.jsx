import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/AddIcCall';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion } from 'framer-motion';

const contactItems = [
  {
    icon: <PhoneIcon sx={{ fontSize: 28, color: '#fff' }} />,
    title: 'Have any question?',
    content: 'Free +92 (020)-9850',
  },
  {
    icon: <EmailIcon sx={{ fontSize: 28, color: '#fff' }} />,
    title: 'Write email',
    content: 'needhelp@company.com',
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 28, color: '#fff' }} />,
    title: 'Visit anytime',
    content: '66 broklyn golden street. New York',
  },
];

const ContactUs = () => {
  return (
    <Box sx={{ py: 10, bgcolor: '#fff' }}>
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 2, md: 10 },
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'stretch', 
          gap: 4,
        }}
      >
        {/* Left Content */}
        <Box
          flex={1}
          minWidth={{ xs: '100%', md: '45%' }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#ef4444', fontWeight: 700 }}>
            / NEED ANY HELP?
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mt: 1,
              color: '#0f172a',
            }}
          >
            Get in touch with us
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: '#64748b' }}>
            Lorem ipsum is simply free text available dolor sit amet, consectetur notted
            adipisicing elit sed do eiusmod tempor incididunt simply free ut labore et
            dolore magna aliqua.
          </Typography>

          {/* Contact Items */}
          <Box sx={{ mt: 4 }}>
            {contactItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'rgba(50, 132, 209, 1)',
                      width: 70,
                      height: 70,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      mr: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                    <Typography sx={{ color: '#475569' }}>{item.content}</Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Right Map */}
        <Box
          flex={1}
          minWidth={{ xs: '100%', md: '45%' }}
          sx={{
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ flex: 1 }}
          >
            <Box
              component="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509137!2d144.96315791589676!3d-37.81627944202173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5774a2262ad77e7!2sEnvato!5e0!3m2!1sen!2sbd!4v1664086404071!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{
                border: 0,
                borderRadius: 8,
                minHeight: '100%', 
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUs;
