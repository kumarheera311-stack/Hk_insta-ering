import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Card, CardContent, Typography, Button, Avatar, TextField, Alert } from '@mui/material';
import { getUserProfile, followUser, updateProfile } from '../api/api';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await getUserProfile(userId);
      setProfile(response.data.user);
      setBioText(response.data.user.bio || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await followUser(userId);
      loadProfile();
      setMessage('Follow status updated');
    } catch (error) {
      setMessage('Error updating follow status');
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(bioText, profile.fullName, profile.avatar);
      setMessage('Profile updated successfully');
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <Typography>Loading...</Typography>;

  const isOwnProfile = currentUser.id === userId;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar sx={{ width: 120, height: 120 }} src={profile.avatar} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4">{profile.fullName}</Typography>
              <Typography color="textSecondary">@{profile.username}</Typography>
              <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                <Box>
                  <Typography variant="h6">Posts</Typography>
                  <Typography color="textSecondary">0</Typography>
                </Box>
                <Box>
                  <Typography variant="h6">Followers</Typography>
                  <Typography color="textSecondary">{profile.followers?.length || 0}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6">Following</Typography>
                  <Typography color="textSecondary">{profile.following?.length || 0}</Typography>
                </Box>
              </Box>
              {!isOwnProfile && (
                <Button variant="contained" color="primary" onClick={handleFollow} sx={{ mt: 2 }}>
                  Follow
                </Button>
              )}
            </Box>
          </Box>

          {isEditing && isOwnProfile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Bio"
                multiline
                rows={3}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={handleUpdateProfile} disabled={loading}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography>{profile.bio}</Typography>
              {isOwnProfile && (
                <Button variant="outlined" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
                  Edit Profile
                </Button>
              )}
            </Box>
          )}

          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
