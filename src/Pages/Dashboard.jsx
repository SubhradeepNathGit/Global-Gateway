import React, { useEffect, useState } from 'react';
import { supabase, getAvatarUrl } from '../Supabase/supabaseClient';
import { Avatar, Box, Typography } from '@mui/material';

const Dashboard = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (sessionError || !userId) {
        console.error('Error getting session:', sessionError?.message);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('avatar_url, name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error.message);
        setAvatarUrl('/default-avatar.png');
        return;
      }

      setUserName(data?.name || '');

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
    <Box mt={10} textAlign="center">
      <Typography variant="h4">Welcome to your Dashboard</Typography>

      {avatarUrl && (
        <Box mt={4} display="flex" justifyContent="center">
          <Avatar
            src={avatarUrl}
            alt="User Avatar"
            sx={{ width: 120, height: 120 }}
          />
        </Box>
      )}

      {userName && (
        <Typography variant="h6" mt={2}>
          {userName}
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard;
