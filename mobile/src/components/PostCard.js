import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { likePost, addComment, deletePost } from '../api/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Video from 'react-native-video';

const PostCard = ({ post, navigation }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      await likePost(post._id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      await addComment(post._id, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: post.userId?.avatar || 'https://via.placeholder.com/40',
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{post.userId?.fullName}</Text>
            <Text style={styles.timestamp}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <MaterialCommunityIcons name="delete" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {post.media && (
        <View style={styles.mediaContainer}>
          {post.media.type === 'video' ? (
            <Video
              source={{ uri: post.media.url }}
              style={styles.media}
              controls
              paused
            />
          ) : (
            <Image source={{ uri: post.media.url }} style={styles.media} />
          )}
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.caption}>{post.content}</Text>

        {post.media?.type === 'video' && (
          <View style={styles.earnTag}>
            <MaterialCommunityIcons name="coin" size={14} color="gold" />
            <Text style={styles.earnText}>Earned ₹10</Text>
          </View>
        )}
        {post.media?.type === 'photo' && (
          <View style={styles.earnTag}>
            <MaterialCommunityIcons name="coin" size={14} color="gold" />
            <Text style={styles.earnText}>Earned ₹5</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <MaterialCommunityIcons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? '#ff6b6b' : '#999'}
          />
          <Text style={styles.actionText}>{post.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <MaterialCommunityIcons name="comment-outline" size={20} color="#999" />
          <Text style={styles.actionText}>{post.comments?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="share-outline" size={20} color="#999" />
          <Text style={styles.actionText}>{post.shares || 0}</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          <View style={styles.commentsList}>
            {post.comments?.map((comment) => (
              <View key={comment._id} style={styles.comment}>
                <Text style={styles.commentUser}>
                  {comment.userId?.fullName}
                </Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </View>
          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#667eea" />
              ) : (
                <MaterialCommunityIcons name="send" size={20} color="#667eea" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  mediaContainer: {
    width: '100%',
    backgroundColor: '#000',
  },
  media: {
    width: '100%',
    height: 400,
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  caption: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  earnTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  earnText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#999',
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  commentsList: {
    marginBottom: 10,
  },
  comment: {
    marginBottom: 10,
  },
  commentUser: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 13,
    marginRight: 10,
    color: '#333',
  },
});

export default PostCard;
