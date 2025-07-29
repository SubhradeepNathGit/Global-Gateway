import React, { useEffect, useState } from 'react';
import { supabase, getAvatarUrl } from '../Supabase/supabaseClient';
import { 
  Avatar, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Notifications,
  Settings,
  ExitToApp,
  Email,
  Phone
} from '@mui/icons-material';

const Dashboard = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (sessionError || !userId) {
        console.error('Error getting session:', sessionError?.message);
        return;
      }

      // Get email from session (auth data)
      setUserEmail(session.user.email || '');

      // Fetch additional user data from users table
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url, name, phone') // Added phone to the select
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error.message);
        setAvatarUrl('/default-avatar.png');
        return;
      }

      setUserName(data?.name || '');
      setUserPhone(data?.phone || ''); // Set phone number

      if (data?.avatar_url) {
        try {
          const avatarUrl = await getAvatarUrl(data.avatar_url);
          setAvatarUrl(avatarUrl || '/default-avatar.png');
        } catch (e) {
          setAvatarUrl('/default-avatar.png');
        }
      } else {
        setAvatarUrl('/default-avatar.png');
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
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
            px: { xs: 2, md: 10 },
            maxWidth: '1400px',
            mx: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h3" 
              fontWeight="bold"
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
            >
              Your Profile
            </Typography>
            <Breadcrumbs sx={{ color: '#FF5252', mt: 1 }} separator="›">
              <Link 
                underline="hover" 
                href="/" 
                sx={{ color: '#FF5252', '&:hover': { color: '#fff' } }}
              >
                Home
              </Link>
              <Typography sx={{ color: '#FF5252' }}>Profile</Typography>
            </Breadcrumbs>
          </motion.div>
        </Box>
      </Box>

      {/* User Welcome Card */}
      <Box sx={{ position: 'relative', mt: { xs: -6, md: -8 }, zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 10 }, mb: 4 }}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3
                  }}
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {avatarUrl && (
                        <Avatar
                          src={avatarUrl}
                          alt="User Avatar"
                          sx={{ 
                            width: { xs: 80, md: 120 }, 
                            height: { xs: 80, md: 120 },
                            border: '4px solid #FF5252',
                            boxShadow: '0 8px 32px rgba(255, 82, 82, 0.3)'
                          }}
                        />
                      )}
                    </motion.div>
                    <Box>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold"
                        sx={{ 
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          color: '#2c3e50'
                        }}
                      >
                        Welcome to your Profile
                      </Typography>
                      {userName && (
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#FF5252', 
                            mt: 1,
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            fontWeight: 600
                          }}
                        >
                          {userName}
                        </Typography>
                      )}
                      
                      {/* Email and Phone Section */}
                      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {userEmail && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Email sx={{ fontSize: 16, color: '#6c757d' }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6c757d',
                                fontSize: { xs: '0.8rem', md: '0.9rem' }
                              }}
                            >
                              {userEmail}
                            </Typography>
                          </Box>
                        )}
                        {userPhone && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Phone sx={{ fontSize: 16, color: '#6c757d' }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6c757d',
                                fontSize: { xs: '0.8rem', md: '0.9rem' }
                              }}
                            >
                              {userPhone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6c757d', 
                          mt: 1,
                          fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                      >
                        Track your visa applications and manage your immigration journey
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" gap={1}>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <IconButton 
                        sx={{ 
                          bgcolor: 'rgba(255, 82, 82, 0.1)',
                          color: '#FF5252',
                          '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.2)' }
                        }}
                      >
                        <Notifications />
                      </IconButton>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <IconButton 
                        sx={{ 
                          bgcolor: 'rgba(255, 82, 82, 0.1)',
                          color: '#FF5252',
                          '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.2)' }
                        }}
                      >
                        <Settings />
                      </IconButton>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <IconButton 
                        sx={{ 
                          bgcolor: 'rgba(255, 82, 82, 0.1)',
                          color: '#FF5252',
                          '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.2)' }
                        }}
                      >
                        <ExitToApp />
                      </IconButton>
                    </motion.div>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Dashboard;