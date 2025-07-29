
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Facebook, Google, LinkedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase, createUserProfile, checkUserPermissions } from '../Supabase/supabaseClient';

const MotionBox = motion(Box);

const AuthForm = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [signupStep, setSignupStep] = useState('form');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at && signupStep === 'confirm') {
        await handleProfileCreation(session.user.id);
      }
    };

    checkEmailConfirmation();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at && signupStep === 'confirm') {
        await handleProfileCreation(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [signupStep]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('info');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const { data: userProfile, error: userProfileError } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();
        if (userProfile && !userProfileError) {
          setMessage('This email exists in our database, but not in the authentication system. Please sign up using this email, or contact support.');
          setShowSignupPrompt(true);
        } else {
          setMessage(error.message);
          setShowSignupPrompt(false);
        }
        setMessageType('error');
      } else {
        setMessage('Logged in successfully!');
        setMessageType('success');
        setShowSignupPrompt(false);
      }
    } else {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setMessage(signUpError.message);
        setMessageType('error');
        return;
      }

      const userId = signUpData?.user?.id;

      if (!userId) {
        setMessage('Signup succeeded but user ID not found.');
        setMessageType('error');
        return;
      }

      await handleProfileCreation(userId);
    }
  };

  const handleEmailConfirmation = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.email_confirmed_at) {
      await handleProfileCreation(session.user.id);
    } else {
      setMessage('Please confirm your email first. Check your inbox and click the confirmation link.');
      setMessageType('warning');
    }
  };

  const handleProfileCreation = async (userId) => {
    let filePath = null;
    let publicUrl = null;

    if (file) {
      try {
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        filePath = `avatars/${fileName}`;
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(filePath);
        publicUrl = publicData?.publicUrl;
        setMessage('Image uploaded successfully!');
        setMessageType('success');
      } catch (error) {
        setMessage('Image upload failed: ' + error.message);
        setMessageType('error');
        setUploading(false);
      }
    }

    const userDataToInsert = {
      id: userId,
      name,
      phone,
      email,
      avatar_url: filePath || '',
    };

    const { error: insertError } = await createUserProfile(userDataToInsert);

    if (insertError) {
      if (insertError.code === '42501') {
        setMessage('Access denied due to RLS policies. Contact support.');
      } else if (insertError.code === '23505') {
        setMessage('User profile already exists. You can now sign in.');
      } else {
        setMessage('User created but failed to insert profile: ' + insertError.message);
      }
      setMessageType('error');
    } else {
      setSignupStep('complete');
      setMessage('Signup complete! Welcome.');
      setMessageType('success');
    }

    setUploading(false);
  };

  const resetForm = () => {
    setSignupStep('form');
    setMessage('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setFile(null);
  };

  const handleTestPermissions = async () => {
    const result = await checkUserPermissions();
    console.log('Permission check result:', result);
    setMessage('Check console for permission details');
    setMessageType('info');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: isDark ? 'background.default' : '#f6f5f7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: 1000,
          height: 600,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: isDark ? 'background.paper' : '#fff',
          borderRadius: 3,
          boxShadow: 10,
          mt: 10,
          mb: 10,
        }}
      >
        <MotionBox
          animate={{ x: isLogin ? '0%' : '-100%' }}
          transition={{ duration: 0.6 }}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),url('/Thubmnail.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2}>
            {isLogin ? 'Hello, Friend!' : 'Welcome Back!'}
          </Typography>
          <Typography variant="body1" mb={3}>
            {isLogin
              ? 'Enter your personal details and start your journey with us'
              : 'To keep connected with us please login with your personal info'}
          </Typography>
          <Button
            onClick={() => {
              setIsLogin((prev) => !prev);
              setSignupStep('form');
              setMessage('');
            }}
            variant="outlined"
            sx={{ color: '#fff', borderColor: '#fff' }}
          >
            {isLogin ? 'SIGN UP' : 'SIGN IN'}
          </Button>
        </MotionBox>

        <Box
          sx={{
            width: '50%',
            zIndex: 3,
            transform: isLogin ? 'translateX(0%)' : 'translateX(100%)',
            transition: 'transform 0.6s ease-in-out',
            p: 5,
            bgcolor: 'background.default',
            color: 'text.primary',
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2}>
            {isLogin ? 'Sign in' : 'Create Account'}
          </Typography>

          <Box display="flex" gap={1} mb={2}>
            <IconButton><Facebook /></IconButton>
            <IconButton><Google /></IconButton>
            <IconButton><LinkedIn /></IconButton>
          </Box>

          <Typography variant="caption" color="text.secondary">
            or use your {isLogin ? 'account' : 'email for registration'}
          </Typography>

          <Box
            component="form"
            onSubmit={handleAuth}
            mt={2}
            display="flex"
            flexDirection="column"
            gap={2}
            encType="multipart/form-data"
          >
            {message && (
              <Alert severity={messageType} sx={{ mt: 2 }}>
                {message}
                {showSignupPrompt && (
                  <Button color="primary" size="small" sx={{ ml: 2 }} onClick={() => setIsLogin(false)}>
                    Sign Up
                  </Button>
                )}
              </Alert>
            )}

            {signupStep === 'form' && (
              <>
                {!isLogin && (
                  <>
                    <TextField
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <TextField
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ marginTop: '10px' }}
                    />
                  </>
                )}
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button variant="contained" type="submit" sx={{ mt: 1 }} disabled={uploading}>
                  {isLogin ? 'SIGN IN' : uploading ? 'UPLOADING...' : 'SIGN UP'}
                </Button>

                {!isLogin && (
                  <Button variant="outlined" onClick={handleTestPermissions} sx={{ mt: 1 }} type="button">
                    Test Permissions
                  </Button>
                )}
              </>
            )}

            {signupStep === 'confirm' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" mb={2}>
                  Email Confirmation Required
                </Typography>
                <Typography variant="body2" mb={3}>
                  We've sent a confirmation email to {email}. Please check your inbox and click the confirmation link.
                </Typography>
                <Button onClick={handleEmailConfirmation} variant="contained" disabled={uploading} sx={{ mr: 2 }}>
                  {uploading ? <CircularProgress size={24} color="inherit" /> : "I've Confirmed My Email"}
                </Button>
                <Button onClick={resetForm} variant="outlined">
                  Start Over
                </Button>
              </Box>
            )}

            {signupStep === 'complete' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" mb={2} color="success.main">
                  Welcome to Our Platform!
                </Typography>
                <Typography variant="body2" mb={3}>
                  Your account has been created successfully. You can now log in and access your dashboard.
                </Typography>
                <Button
                  onClick={() => {
                    setIsLogin(true);
                    setSignupStep('form');
                    setMessage('');
                  }}
                  variant="contained"
                  sx={{ mr: 2 }}
                >
                  Sign In
                </Button>
                <Button onClick={resetForm} variant="outlined">
                  Create Another Account
                </Button>
              </Box>
            )}

            {isLogin && signupStep === 'form' && (
              <Typography mt={1} fontSize={12}>
                Forgot your password?
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;
