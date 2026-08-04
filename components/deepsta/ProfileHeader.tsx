import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';

export interface UserProfileData {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  website?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
}

interface ProfileHeaderProps {
  user: UserProfileData;
  onEditProfilePress?: () => void;
  onShareProfilePress?: () => void;
  onMenuPress?: () => void;
}

const HIGHLIGHTS = [
  { id: 'h1', title: 'Vibes', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop' },
  { id: 'h2', title: 'Travel', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop' },
  { id: 'h3', title: 'Shots', cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop' },
];

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditProfilePress,
  onShareProfilePress,
  onMenuPress,
}) => {
  const insets = useSafeAreaInsets();
  const safeTopPadding = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  return (
    <View style={[styles.container, { paddingTop: safeTopPadding }]}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.usernameRow}>
          <Text style={styles.usernameTitle}>{user.username}</Text>
          {user.isVerified && (
            <Ionicons name="checkmark-circle" size={16} color={BrandColors.glowMagenta} />
          )}
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity style={styles.topIconBtn}>
            <Ionicons name="add-circle-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topIconBtn}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (onMenuPress) onMenuPress();
            }}
          >
            <Ionicons name="menu-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Profile Info Row */}
      <View style={styles.profileMainRow}>
        <LinearGradient
          colors={[BrandColors.glowMagenta, BrandColors.electricViolet]}
          style={styles.avatarBorder}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followersCount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Bio Details */}
      <View style={styles.bioContainer}>
        <Text style={styles.nameText}>{user.name}</Text>
        <Text style={styles.bioText}>{user.bio}</Text>
        {user.website && (
          <Text style={styles.websiteText}>🔗 {user.website}</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEditProfilePress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onShareProfilePress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Story Highlights Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.highlightsScroll}
      >
        <TouchableOpacity style={styles.highlightItem} activeOpacity={0.7}>
          <View style={styles.newHighlightCircle}>
            <Ionicons name="add" size={24} color="#FFF" />
          </View>
          <Text style={styles.highlightTitle}>New</Text>
        </TouchableOpacity>

        {HIGHLIGHTS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.highlightItem} activeOpacity={0.7}>
            <View style={styles.highlightRing}>
              <Image source={{ uri: item.cover }} style={styles.highlightImage} />
            </View>
            <Text style={styles.highlightTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 45 : 16,
    backgroundColor: BrandColors.bgDark,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  usernameTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  topIconBtn: {
    padding: 4,
  },
  profileMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  avatarBorder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: BrandColors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  bioContainer: {
    marginBottom: 16,
  },
  nameText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bioText: {
    color: BrandColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  websiteText: {
    color: BrandColors.glowMagenta,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  actionButton: {
    flex: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  highlightsScroll: {
    paddingBottom: 14,
    gap: 14,
  },
  highlightItem: {
    alignItems: 'center',
    width: 64,
  },
  newHighlightCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2,
    borderWidth: 1.5,
    borderColor: BrandColors.glowMagenta,
    marginBottom: 4,
  },
  highlightImage: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  highlightTitle: {
    color: BrandColors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
});
