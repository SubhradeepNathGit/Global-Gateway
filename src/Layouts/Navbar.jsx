import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase, getAvatarUrl } from '../Supabase/supabaseClient';
import Cart from '../Pages/Cart';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Countries', to: '/country' },
  {
    label: 'Coaching',
    children: [
      { label: 'IELTS Test', to: '/coachingcards' },
      { label: 'TOEFL Test', to: '/coachingcards' },
      { label: 'PTE Test', to: '/coachingcards' },
      { label: 'Citizenship Test', to: '/coachingcards' },
      { label: 'DET Test', to: '/coachingcards' },
      { label: 'Refugee Advocacy', to: '/coachingcards' },
    ],
  },
  {
    label: 'Apply Visa',
    children: [
      { label: 'Student Visa', to: '/visacards' },
      { label: 'Tourist Visa', to: '/visacards' },
      { label: 'Family Visa', to: '/visacards' },
      { label: 'Resident Visa', to: '/visacards' },
      { label: 'Working Visa', to: '/visacards' },
      { label: 'Business Visa', to: '/visacards' },
    ],
  },
  { label: 'Get in Touch', to: '/contact' },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (data?.avatar_url) {
        try {
          const url = await getAvatarUrl(data.avatar_url);
          setAvatarUrl(url || '/default-avatar.png');
        } catch {
          setAvatarUrl('/default-avatar.png');
        }
      } else {
        setAvatarUrl('/default-avatar.png');
      }
    };

    fetchAvatar();
  }, [user]);

  useEffect(() => {
    const fetchCart = async () => {
      const { data, error } = await supabase.from('cart').select('*');
      if (!error) setCartItems(data);
    };
    fetchCart();
  }, []);

  const handleDropdownToggle = (label) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(prev => !prev);
    setOpenDropdown(null);
  };

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    handleClose();
    navigate('/');
  };

  const toggleCartDrawer = () => setCartDrawerOpen(prev => !prev);

  // Function to close cart drawer (for passing to Cart component)
  const closeCartDrawer = () => setCartDrawerOpen(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled ? 'rgba(0,0,0,0.6)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'background-color 0.4s ease',
          px: 4,
          py: 1,
          boxShadow: 'none',
          color: 'white',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlightTakeoffIcon sx={{ fontSize: '30px', color: 'white' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '25px', letterSpacing: 1 }}>
              Global Gateway
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {navLinks.map((link) =>
                link.children ? (
                  <Box key={link.label} sx={{ position: 'relative' }}>
                    <Button
                      onClick={() => handleDropdownToggle(link.label)}
                      sx={{ color: 'white', fontWeight: 500, fontSize: '15px', textTransform: 'none' }}
                    >
                      {link.label} {openDropdown === link.label ? <ExpandLess /> : <ExpandMore />}
                    </Button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={dropdownVariants}
                          style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', minWidth: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 20, borderRadius: '6px' }}
                        >
                          {link.children.map((sub) => (
                            <Button
                              key={sub.label}
                              component={RouterLink}
                              to={sub.to}
                              fullWidth
                              onClick={() => setOpenDropdown(null)}
                              sx={{ justifyContent: 'flex-start', px: 2, py: 1, color: 'white', textTransform: 'none', fontWeight: 500 }}
                            >
                              {sub.label}
                            </Button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                ) : (
                  <Button
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    sx={{ color: 'white', fontWeight: 500, fontSize: '15px', textTransform: 'none' }}
                  >
                    {link.label}
                  </Button>
                )
              )}

              <IconButton color="inherit" onClick={toggleCartDrawer}>
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {user ? (
                <>
                  <IconButton onClick={handleMenu}>
                    <Avatar src={avatarUrl || '/default-avatar.png'} alt="Profile" />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem component={RouterLink} to="/dashboard" onClick={handleClose}>Dashboard</MenuItem>
                    <MenuItem component={RouterLink} to="/cart" onClick={handleClose}>My Cart</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button component={RouterLink} to="/signup" sx={{ color: 'white' }}>
                  Sign Up
                </Button>
              )}
            </Box>
          )}

          {isMobile && (
            <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ ml: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 160, pt: 2 }}>
          {user && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Avatar src={avatarUrl || '/default-avatar.png'} alt="Profile" sx={{ width: 64, height: 64 }} />
              <Button onClick={handleLogout} sx={{ color: 'red', mt: 1, textTransform: 'none' }}>
                Logout
              </Button>
              <Divider sx={{ width: '100%', my: 1 }} />
              <List>
                <ListItemButton component={RouterLink} to="/dashboard" onClick={handleDrawerToggle}>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/cart" onClick={handleDrawerToggle}>
                  <ListItemText primary="My Cart" />
                </ListItemButton>
              </List>
              <Divider sx={{ width: '100%' }} />
            </Box>
          )}
          <List>
            {navLinks.map((link) =>
              link.children ? (
                <React.Fragment key={link.label}>
                  <ListItemButton onClick={() => handleDropdownToggle(link.label)}>
                    <ListItemText primary={link.label} />
                    {openDropdown === link.label ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openDropdown === link.label} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {link.children.map((sub) => (
                        <ListItemButton
                          key={sub.label}
                          component={RouterLink}
                          to={sub.to}
                          onClick={handleDrawerToggle}
                          sx={{ pl: 4 }}
                        >
                          <ListItemText primary={sub.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ) : (
                <ListItemButton
                  key={link.label}
                  component={RouterLink}
                  to={link.to}
                  onClick={handleDrawerToggle}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              )
            )}
          </List>
        </Box>
      </Drawer>

      <Drawer anchor="right" open={cartDrawerOpen} onClose={toggleCartDrawer}>
        <Box sx={{ width: 580, p: 2 }}>
          <Cart cartItems={cartItems} onCloseDrawer={closeCartDrawer} />
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;