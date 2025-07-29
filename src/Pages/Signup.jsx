import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  // Common styling for all text fields
  const textFieldStyles = {
    width: '100%',
    '& label': {
      color: 'white',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInputBase-root': {
      color: 'white',
      backgroundColor: 'transparent',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'transparent',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    // Override Chrome autofill styles
    '& input': {
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
        WebkitTextFillColor: 'white !important',
        backgroundColor: 'transparent !important',
        transition: 'background-color 5000s ease-in-out 0s',
      },
      '&:-webkit-autofill:hover': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
        WebkitTextFillColor: 'white !important',
        backgroundColor: 'transparent !important',
      },
      '&:-webkit-autofill:focus': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
        WebkitTextFillColor: 'white !important',
        backgroundColor: 'transparent !important',
      },
      '&:-webkit-autofill:active': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
        WebkitTextFillColor: 'white !important',
        backgroundColor: 'transparent !important',
      },
    },
  };

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
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Small delay to show success message
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

      setSignupStep('confirm');
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
      
      // Redirect to dashboard after successful signup
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Slightly longer delay for signup completion
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage:`url(/Slider1.jpg)`,
        backgroundSize: 'cover',
        bgcolor: isDark ? 'background.default' : '#000000ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          mt: 10,
        mb: 20,
          width: '100%',
          maxWidth: 1100,
          height: 600,
          display: 'flex',
          boxShadow: 10,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            bgcolor: isDark ? 'background.default' : '#000000ff',
            width: '50%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              top: 0,
              left: 0,
            }}
          >
            <source src="/14153564_2160_3840_60fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <Box
            sx={{
              bgcolor: isDark ? 'background.default' : '#000000ff',
              position: 'relative',
              zIndex: 1,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              px: 4,
              height: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <Typography variant="h4" fontWeight="bold" mb={2}>
              {isLogin ? 'Hello, Traveller!' : 'Welcome Back!'}
            </Typography>
            <Typography variant="body1" mb={3}>
              {isLogin
                ? 'Enter your personal details to start your immigration journey with us'
                : 'To keep connected with us please login with your personal info'}
            </Typography>
            <Button
              onClick={() => {
                setIsLogin(!isLogin);
                setSignupStep('form');
                setMessage('');
              }}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            >
              {isLogin ? 'SIGN UP' : 'SIGN IN'}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            mt: -2,
            width: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(50px)',
            color: '#fff',
            p: 5,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '600px',
          }}
        >
          <Typography sx={{color: 'white'}} variant="h4" fontWeight="bold" mb={2}>
            {isLogin ? 'Sign in' : 'Create Account'}
          </Typography>

          <Box display="flex" gap={1} mb={2}>
            <IconButton sx={{color: 'white'}}><Facebook /></IconButton>
            <IconButton sx={{color:'white'}}><Google /></IconButton>
            <IconButton sx={{color:'white'}}><LinkedIn /></IconButton>
          </Box>

          <Typography variant="caption" color="white">
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
            sx={{ 
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            {message && (
              <Alert severity={messageType}>
                {message}
                {showSignupPrompt && (
                  <Button size="small" onClick={() => setIsLogin(false)} sx={{ ml: 2 }}>
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
                      sx={textFieldStyles} 
                      label="Name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                    <TextField 
                      sx={textFieldStyles} 
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
                      style={{ marginTop: 8 }}
                    />
                  </>
                )}
                <TextField 
                  sx={textFieldStyles} 
                  label="Email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <TextField 
                  sx={textFieldStyles} 
                  label="Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <Button sx={{backgroundColor: 'black'}}  type="submit" variant="contained" disabled={uploading}>
                  {isLogin ? 'SIGN IN' : uploading ? 'UPLOADING...' : 'SIGN UP'}
                </Button>
              </>
            )}

            {signupStep === 'confirm' && (
              <Box textAlign="center">
                <Typography variant="h6" mb={2}>Email Confirmation Required</Typography>
                <Typography variant="body2" mb={3}>Check your inbox for a confirmation link.</Typography>
                <Button onClick={handleEmailConfirmation} variant="contained" sx={{ mr: 2 }}>
                  {uploading ? <CircularProgress size={24} color="inherit" /> : "I've Confirmed My Email"}
                </Button>
                <Button onClick={resetForm} variant="outlined">Start Over</Button>
              </Box>
            )}

            {signupStep === 'complete' && (
              <Box textAlign="center">
                <Typography variant="h6" color="success.main">Signup Complete!</Typography>
                <Typography variant="body2" mb={3}>You can now log in and access your account.</Typography>
                <Button onClick={() => { setIsLogin(true); resetForm(); }} variant="contained" sx={{ mr: 2 }}>
                  Sign In
                </Button>
              </Box>
            )}

            {isLogin && signupStep === 'form' && (
              <Typography fontSize={12} mt={1}>Forgot your password?</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;