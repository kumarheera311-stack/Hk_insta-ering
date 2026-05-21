import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Video,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { uploadPost } from '../api/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';

const UploadScreen = ({ navigation }) => {
  const [media, setMedia] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMediaPick = async (source) => {
    const options = {
      mediaType: 'mixed',
      includeBase64: false,
    };

    const launchFunction = source === 'camera' ? launchCamera : launchImageLibrary;

    launchFunction(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setMedia(response.assets[0]);
      }
    });
  };

  const handleUpload = async () => {
    if (!media) {
      Alert.alert('Error', 'Please select a file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('media', {
        uri: media.uri,
        type: media.type,
        name: media.fileName || `media_${Date.now()}`,
      });
      formData.append('content', content);
      formData.append('mediaType', media.type?.startsWith('video') ? 'video' : 'photo');

      const response = await uploadPost(formData);
      Alert.alert('Success', `Earned ₹${response.data.earnedAmount}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#f5f5f5', '#ffffff']} style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Content</Text>
        </View>

        <View style={styles.mediaContainer}>
          {media ? (
            <View style={styles.mediaPreview}>
              {media.type?.startsWith('image') ? (
                <Image source={{ uri: media.uri }} style={styles.mediaImage} />
              ) : (
                <Video source={{ uri: media.uri }} style={styles.mediaImage} />
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setMedia(null)}
              >
                <MaterialCommunityIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleMediaPick('camera')}
              >
                <MaterialCommunityIcons name="camera" size={40} color="#667eea" />
                <Text style={styles.optionText}>Take Photo/Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleMediaPick('gallery')}
              >
                <MaterialCommunityIcons name="image-multiple" size={40} color="#667eea" />
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Add a caption..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
            editable={!loading}
          />
        </View>

        {media && (
          <View style={styles.earningsContainer}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.earningsBox}
            >
              <MaterialCommunityIcons name="coin" size={24} color="gold" />
              <Text style={styles.earningsText}>
                Earn ₹{media.type?.startsWith('video') ? '10' : '5'}
              </Text>
            </LinearGradient>
          </View>
        )}

        <TouchableOpacity
          style={[styles.uploadButton, loading && styles.disabledButton]}
          onPress={handleUpload}
          disabled={!media || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="cloud-upload" size={24} color="white" />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  mediaContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    overflow: 'hidden',
    elevation: 3,
  },
  uploadOptions: {
    flexDirection: 'row',
    padding: 20,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    borderRadius: 10,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  optionText: {
    marginTop: 10,
    fontSize: 12,
    color: '#667eea',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mediaPreview: {
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: 400,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  captionInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
    elevation: 2,
  },
  earningsContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  earningsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  earningsText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  uploadButton: {
    marginHorizontal: 15,
    marginBottom: 30,
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UploadScreen;
