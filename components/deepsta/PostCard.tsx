import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export interface PostItemData {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  location?: string;
  mediaUrl: string;
  aspectRatio?: number;
  audioTrack?: {
    title: string;
    artist: string;
  };
  likesCount: number;
  commentsCount: number;
  caption: string;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

interface PostCardProps {
  post: PostItemData;
  onLikePress?: (post: PostItemData) => void;
  onCommentPress?: (post: PostItemData) => void;
  onSharePress?: (post: PostItemData) => void;
  onSavePress?: (post: PostItemData) => void;
  onProfilePress?: (username: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLikePress,
  onCommentPress,
  onSharePress,
  onSavePress,
  onProfilePress,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);

  const handleLikeToggle = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    if (onLikePress) onLikePress(post);
  };

  const handleSaveToggle = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    if (onSavePress) onSavePress(post);
  };

  // Double tap to like
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!isLiked) {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
        if (onLikePress) onLikePress(post);
      }
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowHeartOverlay(true);
      setTimeout(() => setShowHeartOverlay(false), 800);
    }
    setLastTap(now);
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={styles.authorRow}
          onPress={() => onProfilePress && onProfilePress(post.author.username)}
          activeOpacity={0.8}
        >
          <View style={styles.avatarBorder}>
            <Image source={{ uri: post.author.avatar }} style={styles.avatarImage} />
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.usernameText}>{post.author.username}</Text>
              {post.author.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color={BrandColors.glowMagenta} />
              )}
            </View>
            {post.location && <Text style={styles.locationText}>{post.location}</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.6}>
          <Ionicons name="ellipsis-horizontal" size={20} color={BrandColors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Media View */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleDoubleTap}
        style={styles.mediaContainer}
      >
        <Image
          source={{ uri: post.mediaUrl }}
          style={styles.mediaImage}
          resizeMode="cover"
        />

        {/* Double Tap Heart Overlay */}
        {showHeartOverlay && (
          <View style={styles.doubleTapHeartOverlay}>
            <Ionicons name="heart" size={90} color={BrandColors.glowMagenta} />
          </View>
        )}

        {/* DeepVibe Audio Badge Pill */}
        {post.audioTrack && (
          <View style={styles.audioPill}>
            <Ionicons name="musical-notes" size={12} color="#FFF" />
            <Text style={styles.audioText} numberOfLines={1}>
              {post.audioTrack.title} • {post.audioTrack.artist}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionsBar}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={handleLikeToggle} style={styles.actionBtn}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={isLiked ? BrandColors.glowMagenta : '#FFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onCommentPress && onCommentPress(post)}
            style={styles.actionBtn}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSharePress && onSharePress(post)}
            style={styles.actionBtn}
          >
            <Ionicons name="paper-plane-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSaveToggle} style={styles.actionBtn}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? BrandColors.electricCyan : '#FFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Likes Count */}
      <View style={styles.detailsContainer}>
        <Text style={styles.likesText}>
          {likesCount.toLocaleString()} <Text style={styles.boldSubtext}>likes</Text>
        </Text>

        {/* Caption */}
        <Text style={styles.captionText} numberOfLines={3}>
          <Text style={styles.captionUsername}>{post.author.username}</Text>{' '}
          {post.caption}
        </Text>

        {/* Comments Count Shortcut */}
        <TouchableOpacity
          onPress={() => onCommentPress && onCommentPress(post)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewCommentsText}>
            View all {post.commentsCount} comments
          </Text>
        </TouchableOpacity>

        {/* Timestamp */}
        <Text style={styles.timestampText}>{post.createdAt}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: BrandColors.bgCardDark,
    marginVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBorder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 1.5,
    borderWidth: 1.5,
    borderColor: BrandColors.glowMagenta,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  usernameText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  locationText: {
    color: BrandColors.textMuted,
    fontSize: 11,
  },
  moreBtn: {
    padding: 4,
  },
  mediaContainer: {
    width: '100%',
    height: width * 1.1,
    position: 'relative',
    backgroundColor: '#000',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  doubleTapHeartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  audioPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 7, 13, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
    maxWidth: width * 0.7,
  },
  audioText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    padding: 2,
  },
  detailsContainer: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 14,
  },
  likesText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  boldSubtext: {
    fontWeight: '500',
    color: BrandColors.textSecondary,
  },
  captionText: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  captionUsername: {
    fontWeight: '700',
    color: '#FFF',
  },
  viewCommentsText: {
    color: BrandColors.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  timestampText: {
    color: BrandColors.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
