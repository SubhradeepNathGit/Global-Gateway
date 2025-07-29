// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pspnapxvlropwaovinkq.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcG5hcHh2bHJvcHdhb3ZpbmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Mzk1MzgsImV4cCI6MjA2OTExNTUzOH0.2FoWnmt-IuKt3f8gAD_HvlKupTBf8FHdXXcSijIgtt8'; // replace with your anon/public key
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to create user profile
export const createUserProfile = async (userData) => {
  const { id, name, phone, email, avatar_url } = userData;
  
  console.log('createUserProfile called with:', userData);
  
  const { data, error } = await supabase.from('users').insert([
    {
      id,
      name,
      phone,
      email,
      avatar_url,
    }
  ]);

  console.log('createUserProfile result - data:', data);
  console.log('createUserProfile result - error:', error);

  return { data, error };
};

// Helper function to get user profile
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

// Helper function to convert bytea avatar data to URL
export const getAvatarUrl = async (avatarData) => {
  if (!avatarData) return null;
  
  try {
    console.log('Processing avatar data:', avatarData);
    console.log('Avatar data type:', typeof avatarData);
    
    // If avatarData is already a URL string, return it
    if (typeof avatarData === 'string' && avatarData.startsWith('http')) {
      console.log('Avatar data is already a URL');
      return avatarData;
    }
    
    // If it's bytea data, we need to decode it to get the file path
    let filePath = avatarData;
    
    // If it's hex encoded, decode it
    if (typeof avatarData === 'string' && avatarData.startsWith('\\x')) {
      console.log('Decoding hex data...');
      // Remove the \x prefix and decode hex
      const hexString = avatarData.substring(2);
      // Convert hex to string using browser-compatible method
      filePath = hexString.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
      console.log('Decoded file path:', filePath);
    }
    
    // If filePath is empty or invalid, return null
    if (!filePath || filePath === '') {
      console.error('Invalid file path from avatar data');
      return null;
    }
    
    // Get the public URL from Supabase Storage
    const { data: urlData, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    if (error) {
      console.error('Error getting avatar URL:', error);
      return null;
    }
    
    console.log('Generated avatar URL:', urlData?.publicUrl);
    return urlData?.publicUrl || null;
  } catch (error) {
    console.error('Error processing avatar data:', error);
    return null;
  }
};

// Test function to debug avatar URL issues
export const testAvatarUrl = async (userId) => {
  try {
    console.log('Testing avatar URL for user:', userId);
    
    // Get user data
    const { data: userData, error: userError } = await getUserProfile(userId);
    if (userError) {
      console.error('Error getting user profile:', userError);
      return null;
    }
    
    console.log('User data:', userData);
    
    if (userData?.avatar_url) {
      const avatarUrl = await getAvatarUrl(userData.avatar_url);
      console.log('Test result - Avatar URL:', avatarUrl);
      return avatarUrl;
    } else {
      console.log('No avatar URL found for user');
      return null;
    }
  } catch (error) {
    console.error('Error in testAvatarUrl:', error);
    return null;
  }
};

// Test function to manually insert user data
export const testInsertUser = async (testData) => {
  try {
    console.log('Testing user insertion with data:', testData);
    
    const { data, error } = await supabase.from('users').insert([testData]);
    
    console.log('Test insert result - data:', data);
    console.log('Test insert result - error:', error);
    
    return { data, error };
  } catch (error) {
    console.error('Error in testInsertUser:', error);
    return { data: null, error };
  }
};

// Function to check user permissions and session
export const checkUserPermissions = async () => {
  try {
    console.log('Checking user permissions...');
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current session:', session);
    console.log('Session error:', sessionError);
    
    if (session) {
      console.log('User ID:', session.user.id);
      console.log('User email:', session.user.email);
      console.log('Email confirmed:', session.user.email_confirmed_at);
      console.log('User role:', session.user.role);
    }
    
    // Try to read from users table to check permissions
    const { data: readData, error: readError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    console.log('Read test result - data:', readData);
    console.log('Read test result - error:', readError);
    
    return { session, readData, readError };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return { session: null, readData: null, readError: error };
  }
};