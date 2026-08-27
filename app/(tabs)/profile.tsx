import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';
import { ProfileHeader, UserProfileData } from '@/components/deepsta/ProfileHeader';

const { width } = Dimensions.get('window');
const itemWidth = width / 3;

const USER_DATA: UserProfileData = {
  name: 'Alex Morgan',
  username: 'alex_deepsta',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
  bio: '✨ Digital Creator & UI Architect\n🚀 Crafting deep, vibrant social experiences\n📍 San Francisco, CA',
  website: 'deepsta.app/alex',
  postsCount: 42,
  followersCount: 18400,
  followingCount: 420,
  isVerified: true,
};

const POST_GRID = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
];

import { userApiService } from '@/src/services/user.service';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'saved' | 'tagged'>('grid');
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState<UserProfileData>(USER_DATA);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApiService.getUserProfile('alex_deepsta');
        if (res.success && res.data) {
          setUserData({
            name: res.data.name || res.data.username || 'Alex Morgan',
            username: res.data.username || 'alex_deepsta',
            avatar: res.data.avatar || USER_DATA.avatar,
            bio: res.data.bio || USER_DATA.bio,
            website: res.data.website || USER_DATA.website,
            postsCount: res.data.postsCount ?? USER_DATA.postsCount,
            followersCount: res.data.followersCount ?? USER_DATA.followersCount,
            followingCount: res.data.followingCount ?? USER_DATA.followingCount,
            isVerified: res.data.isVerified ?? USER_DATA.isVerified,
          });
        }
      } catch (e) {
        // Fallback to static user data on error
      }
    };
    fetchProfile();
  }, []);

  const handleMenuNavigate = (path: string) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setMenuVisible(false);
    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={POST_GRID}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        ListHeaderComponent={
          <>
            <ProfileHeader
              user={userData}
              onMenuPress={() => setMenuVisible(true)}
            />

            {/* Profile Gallery Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'grid' && styles.tabItemActive]}
                onPress={() => setActiveTab('grid')}
              >
                <Ionicons
                  name="grid"
                  size={20}
                  color={activeTab === 'grid' ? BrandColors.glowMagenta : BrandColors.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'reels' && styles.tabItemActive]}
                onPress={() => setActiveTab('reels')}
              >
                <Ionicons
                  name="film"
                  size={20}
                  color={activeTab === 'reels' ? BrandColors.glowMagenta : BrandColors.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'saved' && styles.tabItemActive]}
                onPress={() => setActiveTab('saved')}
              >
                <Ionicons
                  name="bookmark"
                  size={20}
                  color={activeTab === 'saved' ? BrandColors.glowMagenta : BrandColors.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'tagged' && styles.tabItemActive]}
                onPress={() => setActiveTab('tagged')}
              >
                <Ionicons
                  name="person-add"
                  size={20}
                  color={activeTab === 'tagged' ? BrandColors.glowMagenta : BrandColors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridCell} activeOpacity={0.8}>
            <Image source={{ uri: item }} style={styles.gridImage} />
          </TouchableOpacity>
        )}
      />

      {/* Hamburger Settings Menu Sheet Modal */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuSheet}>
            <View style={styles.sheetHandle} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => handleMenuNavigate('/settings')}
            >
              <Ionicons name="settings-outline" size={22} color="#FFF" />
              <Text style={styles.menuText}>Settings and Privacy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => handleMenuNavigate('/settings/insights')}
            >
              <Ionicons name="stats-chart-outline" size={22} color={BrandColors.glowMagenta} />
              <Text style={styles.menuText}>Insights</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => handleMenuNavigate('/settings/activity')}
            >
              <Ionicons name="time-outline" size={22} color={BrandColors.electricCyan} />
              <Text style={styles.menuText}>Your Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => handleMenuNavigate('/settings/archive')}
            >
              <Ionicons name="archive-outline" size={22} color={BrandColors.electricViolet} />
              <Text style={styles.menuText}>Archive</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => handleMenuNavigate('/settings/saved')}
            >
              <Ionicons name="bookmark-outline" size={22} color="#F59E0B" />
              <Text style={styles.menuText}>Saved</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bgDark,
  },
  tabRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 2,
  },
  tabItem: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: BrandColors.glowMagenta,
  },
  gridCell: {
    width: itemWidth,
    height: itemWidth,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: BrandColors.bgCardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    gap: 6,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  menuText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
