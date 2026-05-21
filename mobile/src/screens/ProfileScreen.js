import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, followUser, updateProfile } from '../api/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({ route, navigation }) => {
  const userId = route?.params?.userId;
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadProfile();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    setCurrentUser(JSON.parse(userData));
  };

  const loadProfile = async () => {
    try {
      let profileUserId = userId;
      if (!profileUserId) {
        const userData = await AsyncStorage.getItem('user');
        profileUserId = JSON.parse(userData).id;
        setIsOwnProfile(true);
      }

      const response = await getUserProfile(profileUserId);
      setUser(response.data.user);
      setBioText(response.data.user.bio || '');
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followUser(user._id);
      loadProfile();
    } catch (error) {
      Alert.alert('Error', 'Failed to follow user');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(bioText, user.fullName);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated');
      loadProfile();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          navigation.replace('Auth');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Image
            source={{
              uri: user.avatar || 'https://via.placeholder.com/100',
            }}
            style={styles.avatar}
          />
          <Text style={styles.fullName}>{user.fullName}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.followers?.length || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.following?.length || 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {isOwnProfile && isEditing ? (
        <View style={styles.editCard}>
          <Text style={styles.cardTitle}>Edit Profile</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Bio"
            value={bioText}
            onChangeText={setBioText}
            multiline
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.bioCard}>
          <Text style={styles.bioText}>{user.bio || 'No bio added'}</Text>
          {isOwnProfile ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="#667eea" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.followButton}
              onPress={handleFollow}
            >
              <MaterialCommunityIcons name="account-plus" size={16} color="white" />
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isOwnProfile && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'white',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 15,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  bioCard: {
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  editCard: {
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    marginBottom: 15,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#667eea',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    marginLeft: 8,
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 14,
  },
  followButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    marginLeft: 8,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutButton: {
    marginHorizontal: 15,
    marginBottom: 30,
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  logoutButtonText: {
    marginLeft: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
