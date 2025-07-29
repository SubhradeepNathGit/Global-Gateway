import React, { useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/AddIcCall';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DescriptionIcon from '@mui/icons-material/Description';
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

const faqs = [
  {
    question: "How to get free immigration?",
    answer: "Sed rhoncus facilisis purus, at accumsan purus sagittis vitae. Nullam acelit at eros imperdiet. Pellentesque sit."
  },
  {
    question: "Which country is good for residents?",
    answer: "Canada, Australia, and New Zealand are popular destinations for permanent residency due to their immigration-friendly policies, quality of life, and opportunities for skilled workers."
  },
  {
    question: "Canada study visa requirements?",
    answer: "To obtain a Canadian study visa, you need an acceptance letter from a designated learning institution, proof of financial support, no criminal record, and may need to complete a medical exam."
  }
];

const Contact = () => {
  const [expanded, setExpanded] = useState('panel0');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      {/* Top Banner */}
      <Box
        sx={{
          height: { xs: '250px', md: '300px' },
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
            px: { xs: 2, sm: 4, md: 6, lg: 10 },
            maxWidth: '1400px',
            mx: 'auto',
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3rem' }
            }}
          >
            Contact Us
          </Typography>
          <Breadcrumbs sx={{ color: '#FF5252', mt: 1 }} separator="›">
            <Link 
              underline="hover" 
              href="/" 
              sx={{ 
                color: '#FF5252', 
                '&:hover': { color: '#fff' },
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              Home
            </Link>
            <Typography 
              sx={{ 
                color: '#FF5252',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              Contact
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Contact Section - White Background */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff' }}>
        <Container 
          maxWidth="xl" 
          sx={{ 
            maxWidth: '1400px',
            px: { xs: 2, sm: 4, md: 6, lg: 10 }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              justifyContent: 'space-between',
              alignItems: 'stretch', 
              gap: { xs: 4, md: 6, lg: 8 },
            }}
          >
            {/* Left Content */}
            <Box
              sx={{
                flex: '0 0 45%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mt: 1,
                  color: '#0f172a',
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.2rem' }
                }}
              >
                Get in touch with us
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2, 
                  color: '#64748b',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  lineHeight: 1.6
                }}
              >
                Lorem ipsum is simply free text available dolor sit amet, consectetur notted
                adipisicing elit sed do eiusmod tempor incididunt simply free ut labore et
                dolore magna aliqua.
              </Typography>

              {/* Contact Items */}
              <Box sx={{ mt: { xs: 3, md: 4 } }}>
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
                        mb: { xs: 2.5, md: 3 },
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: 'rgba(50, 132, 209, 1)',
                          width: { xs: 60, md: 70 },
                          height: { xs: 60, md: 70 },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          mr: { xs: 1.5, md: 2 },
                          flexShrink: 0,
                        }}
                      >
                        {React.cloneElement(item.icon, {
                          sx: { fontSize: { xs: 24, md: 28 }, color: '#fff' }
                        })}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '0.9rem', md: '1rem' }
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: '#475569',
                            fontSize: { xs: '0.85rem', md: '0.95rem' },
                            wordBreak: 'break-word'
                          }}
                        >
                          {item.content}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* Right Map */}
            <Box
              sx={{
                flex: '0 0 50%',
                display: 'flex',
                alignItems: 'stretch',
                minHeight: { xs: '300px', md: '400px' }
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
        </Container>
      </Box>

      {/* FAQ Section - White Background */}
      <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 10 } }}>
        <Container 
          maxWidth="xl" 
          sx={{ 
            maxWidth: '1400px',
            px: { xs: 2, sm: 4, md: 6, lg: 10 }
          }}
        >
          {/* Flex layout for left and right side */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 4, md: 6, lg: 8 },
              alignItems: 'stretch'
            }}
          >
            {/* Left Side - FAQ */}
            <Box 
              sx={{ 
                flex: '0 0 50%',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
             

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.5rem' },
                  lineHeight: 1.2,
                  color: '#2c3e50',
                  mb: { xs: 2, md: 3 }
                }}
              >
                Frequently Asked Questions
              </Typography>

              <Typography
                sx={{
                  color: '#6c757d',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  lineHeight: 1.6,
                  mb: { xs: 3, md: 4 }
                }}
              >
                Sed rhoncus facilisis purus, at accumsan purus sagittis vitae. Nullam acelit at eros.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {faqs.map((faq, index) => (
                  <Accordion
                    key={index}
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                    sx={{
                      boxShadow: 'none',
                      bgcolor: expanded === `panel${index}` ? 'white' : '#f8f9fa',
                      borderRadius: '8px !important',
                      border: '1px solid #e9ecef',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        margin: '0 0 16px 0',
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        expanded === `panel${index}` ? (
                          <ExpandMoreIcon sx={{ color: '#ef4444', fontSize: { xs: 24, md: 28 } }} />
                        ) : (
                          <KeyboardArrowRightIcon sx={{ color: '#6c757d', fontSize: { xs: 24, md: 28 } }} />
                        )
                      }
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 2, md: 3 },
                        minHeight: { xs: '60px', md: '70px' },
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center',
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          color: '#2c3e50',
                          pr: 1
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
                      <Typography
                        sx={{
                          color: '#6c757d',
                          fontSize: { xs: '0.9rem', md: '0.95rem' },
                          lineHeight: 1.6
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>

            {/* Right Side - Cards */}
            <Box 
              sx={{ 
                flex: '0 0 45%',
                minWidth: 0,
                display: 'flex', 
                flexDirection: 'column', 
                gap: { xs: 3, md: 4 }
              }}
            >
              {/* Red Banner */}
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'rgba(50, 132, 209, 1)',
                  borderRadius: '12px',
                  p: { xs: 3, md: 4 },
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: { xs: '160px', md: '200px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: 15, md: 20 },
                    left: { xs: 20, md: 30 },
                    opacity: 0.3
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: { xs: '2.5rem', md: '3rem' } }} />
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem', lg: '1.8rem' },
                    lineHeight: 1.3,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  Have 30+ Years Immigration Experience for Give you Visa Approval
                </Typography>
              </Paper>

              {/* Image with Text Overlay */}
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: { xs: '250px', md: '300px' }
                }}
              >
                <Box
                  component="img"
                  src="/Faq2.jpg"
                  alt="Immigration Consultant Agency"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    p: { xs: 2.5, md: 3 }
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      fontSize: { xs: '1.1rem', md: '1.3rem', lg: '1.4rem' },
                      lineHeight: 1.3
                    }}
                  >
                   Global Gateway- Visa Consultant Agency
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;