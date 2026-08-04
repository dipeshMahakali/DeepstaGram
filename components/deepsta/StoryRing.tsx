import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';

export interface StoryItemData {
  id: string;
  username: string;
  avatar: string;
  hasUnseenStory?: boolean;
  isUserStory?: boolean;
  isLive?: boolean;
}

interface StoryRingProps {
  story: StoryItemData;
  onPress: (story: StoryItemData) => void;
  onAddStoryPress?: () => void;
}

export const StoryRing: React.FC<StoryRingProps> = ({
  story,
  onPress,
  onAddStoryPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(story)}
      activeOpacity={0.8}
    >
      <View style={styles.avatarWrapper}>
        {story.isUserStory ? (
          <View style={styles.userAvatarBorder}>
            <Image source={{ uri: story.avatar }} style={styles.avatarImage} />
            <TouchableOpacity
              style={styles.addIconBadge}
              onPress={onAddStoryPress || (() => onPress(story))}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={BrandColors.primaryGradientHorizontal}
                style={styles.addIconGradient}
              >
                <Ionicons name="add" size={14} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : story.hasUnseenStory ? (
          <LinearGradient
            colors={
              story.isLive
                ? ['#FF0055', '#FF5500', '#E100FF']
                : [BrandColors.glowMagenta, BrandColors.electricViolet, BrandColors.electricCyan]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeRing}
          >
            <View style={styles.ringInnerGap}>
              <Image source={{ uri: story.avatar }} style={styles.avatarImage} />
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.seenRing}>
            <Image source={{ uri: story.avatar }} style={styles.avatarImage} />
          </View>
        )}

        {story.isLive && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        )}
      </View>

      <Text style={styles.usernameText} numberOfLines={1}>
        {story.isUserStory ? 'Your Story' : story.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
    marginRight: 14,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  activeRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seenRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringInnerGap: {
    flex: 1,
    width: '100%',
    backgroundColor: BrandColors.bgDark,
    borderRadius: 32,
    padding: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: BrandColors.bgCardDark,
  },
  addIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: BrandColors.bgDark,
    overflow: 'hidden',
  },
  addIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: '#FF0055',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: BrandColors.bgDark,
  },
  liveBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  usernameText: {
    color: BrandColors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
