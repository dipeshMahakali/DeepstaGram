import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export interface ReelItemData {
  id: string;
  creator: {
    username: string;
    avatar: string;
    isFollowing?: boolean;
  };
  videoUrl: string; // Simulated with image/video poster
  audioTrack: {
    title: string;
    artist: string;
  };
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

interface ReelItemProps {
  reel: ReelItemData;
  onCommentPress: (reel: ReelItemData) => void;
  onSharePress: (reel: ReelItemData) => void;
  onProfilePress: (username: string) => void;
}

export const ReelItem: React.FC<ReelItemProps> = ({
  reel,
  onCommentPress,
  onSharePress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const [isFollowing, setIsFollowing] = useState(reel.creator.isFollowing || false);

  const safeTop = Math.max(insets.top, StatusBar.currentHeight || 0) + 10;

  const handleLikeToggle = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
  };

  const handleFollowToggle = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setIsFollowing(!isFollowing);
  };

  return (
    <View style={styles.container}>
      {/* Background Poster Simulation */}
      <Image
        source={{ uri: reel.videoUrl }}
        style={styles.bgMedia}
        resizeMode="cover"
      />

      {/* Dark Vignette Overlay for readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.85)']}
        style={styles.overlayGradient}
      />

      {/* Top Header Tag */}
      <View style={[styles.topBar, { top: safeTop }]}>
        <Text style={styles.reelsHeaderTitle}>Reels</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Info Section */}
      <View style={styles.bottomSection}>
        <View style={styles.creatorInfo}>
          <TouchableOpacity
            style={styles.creatorRow}
            onPress={() => onProfilePress(reel.creator.username)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: reel.creator.avatar }} style={styles.creatorAvatar} />
            <Text style={styles.creatorUsername}>{reel.creator.username}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.followBtn, isFollowing && styles.followingBtn]}
            onPress={handleFollowToggle}
            activeOpacity={0.7}
          >
            <Text style={styles.followBtnText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.captionText} numberOfLines={2}>
          {reel.caption}
        </Text>

        {/* Audio Track Tag */}
        <View style={styles.audioRow}>
          <Ionicons name="musical-notes" size={14} color="#FFF" />
          <Text style={styles.audioText} numberOfLines={1}>
            {reel.audioTrack.title} • {reel.audioTrack.artist}
          </Text>
        </View>
      </View>

      {/* Right Interaction Column */}
      <View style={styles.rightColumn}>
        <TouchableOpacity style={styles.interactionBtn} onPress={handleLikeToggle}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={30}
            color={isLiked ? BrandColors.glowMagenta : '#FFF'}
          />
          <Text style={styles.interactionText}>{likesCount.toLocaleString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.interactionBtn}
          onPress={() => onCommentPress(reel)}
        >
          <Ionicons name="chatbubble-outline" size={28} color="#FFF" />
          <Text style={styles.interactionText}>{reel.commentsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.interactionBtn}
          onPress={() => onSharePress(reel)}
        >
          <Ionicons name="paper-plane-outline" size={28} color="#FFF" />
          <Text style={styles.interactionText}>{reel.sharesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.interactionBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Audio Spinning Vinyl Disc */}
        <View style={styles.audioDiscContainer}>
          <LinearGradient
            colors={[BrandColors.glowMagenta, BrandColors.electricCyan]}
            style={styles.audioDiscBorder}
          >
            <Image source={{ uri: reel.creator.avatar }} style={styles.audioDiscAvatar} />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#000',
    position: 'relative',
  },
  bgMedia: {
    width: '100%',
    height: '100%',
  },
  overlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  reelsHeaderTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  bottomSection: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 75,
    left: 16,
    right: 80,
    zIndex: 20,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  creatorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  creatorUsername: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  followBtn: {
    backgroundColor: BrandColors.glowMagenta,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  followingBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  followBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  captionText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 10,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  audioText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rightColumn: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 75,
    right: 16,
    alignItems: 'center',
    gap: 20,
    zIndex: 20,
  },
  interactionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  interactionText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  audioDiscContainer: {
    marginTop: 8,
  },
  audioDiscBorder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioDiscAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
});
