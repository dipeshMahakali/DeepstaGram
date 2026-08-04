import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const itemWidth = (width - 4) / 3;

export type SearchFilterCategory = 'Top' | 'Accounts' | 'Reels' | 'Audio' | 'Tags' | 'Places';

interface ExploreMediaItem {
  id: string;
  type: 'reel' | 'photo' | 'carousel';
  mediaUrl: string;
  viewsCount?: string;
  creator: {
    username: string;
    avatar: string;
  };
}

interface UserSearchResult {
  id: string;
  username: string;
  name: string;
  avatar: string;
  followers: string;
  isFollowing?: boolean;
}

const EXPLORE_GRID_ITEMS: ExploreMediaItem[] = [
  {
    id: 'e1',
    type: 'reel',
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    viewsCount: '142K',
    creator: {
      username: 'sarah_vibes',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: 'e2',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    creator: {
      username: 'alex_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: 'e3',
    type: 'reel',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
    viewsCount: '89.4K',
    creator: {
      username: 'creative_maya',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: 'e4',
    type: 'reel',
    mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
    viewsCount: '310K',
    creator: {
      username: 'jason_photo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: 'e5',
    type: 'carousel',
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    creator: {
      username: 'elena_art',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: 'e6',
    type: 'reel',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    viewsCount: '54.2K',
    creator: {
      username: 'cyber_creator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
  },
];

const SEARCH_USERS: UserSearchResult[] = [
  {
    id: 'u1',
    username: 'sarah_vibes',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    followers: '142.8K followers',
    isFollowing: true,
  },
  {
    id: 'u2',
    username: 'alex_dev',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    followers: '89.4K followers',
    isFollowing: false,
  },
  {
    id: 'u3',
    username: 'creative_maya',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    followers: '65.2K followers',
    isFollowing: false,
  },
];

const FILTER_CATEGORIES: { id: SearchFilterCategory; label: string; icon: string }[] = [
  { id: 'Top', label: 'Top', icon: 'sparkles' },
  { id: 'Accounts', label: 'Accounts', icon: 'person' },
  { id: 'Reels', label: 'Reels', icon: 'film' },
  { id: 'Audio', label: 'Audio', icon: 'musical-notes' },
  { id: 'Tags', label: 'Tags', icon: 'pricetag' },
  { id: 'Places', label: 'Places', icon: 'location' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchFilterCategory>('Top');

  const safeTop = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  const handleCategorySelect = (cat: SearchFilterCategory) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setActiveCategory(cat);
  };

  const filteredMedia = EXPLORE_GRID_ITEMS.filter((item) => {
    if (activeCategory === 'Reels') return item.type === 'reel';
    if (searchQuery.trim()) {
      return item.creator.username.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const filteredUsers = SEARCH_USERS.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Header Bar with safe top padding */}
      <View style={[styles.headerContainer, { paddingTop: safeTop }]}>
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color={BrandColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search accounts, reels, audio..."
            placeholderTextColor={BrandColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={BrandColors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Horizontal Filter Tabs Bar */}
      <View style={styles.filterBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTER_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => handleCategorySelect(cat.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isSelected ? '#FFF' : BrandColors.textSecondary}
                />
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      {activeCategory === 'Accounts' ? (
        /* Accounts List Mode */
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.accountsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.accountRow}
              onPress={() => router.push('/(tabs)/profile')}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.avatar }} style={styles.accountAvatar} />
              <View style={styles.accountInfo}>
                <Text style={styles.accountUsername}>{item.username}</Text>
                <Text style={styles.accountName}>{item.name} • {item.followers}</Text>
              </View>
              <TouchableOpacity style={styles.followBtn} activeOpacity={0.7}>
                <Text style={styles.followBtnText}>
                  {item.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        /* Reels & Media Grid Format with User Profile Logo at Bottom Right */
        <FlatList
          data={filteredMedia}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridTile}
              onPress={() => {
                if (item.type === 'reel') {
                  router.push('/(tabs)/reels' as any);
                } else {
                  router.push('/(tabs)' as any);
                }
              }}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.mediaUrl }} style={styles.gridImage} resizeMode="cover" />

              {/* Top Right Type/Views Badge */}
              <View style={styles.topRightBadge}>
                {item.type === 'reel' ? (
                  <View style={styles.viewsTag}>
                    <Ionicons name="play" size={10} color="#FFF" />
                    {item.viewsCount && <Text style={styles.viewsText}>{item.viewsCount}</Text>}
                  </View>
                ) : (
                  <Ionicons name="copy-outline" size={12} color="#FFF" />
                )}
              </View>

              {/* User Profile Logo at Bottom Right as requested */}
              <View style={styles.bottomRightAvatarBadge}>
                <LinearGradient
                  colors={[BrandColors.glowMagenta, BrandColors.electricCyan]}
                  style={styles.avatarRingGradient}
                >
                  <Image source={{ uri: item.creator.avatar }} style={styles.tileAvatarImage} />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bgDark,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: BrandColors.bgDark,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.bgCardDark,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  clearBtn: {
    padding: 2,
  },
  filterBarContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  filterScrollContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: BrandColors.glowMagenta,
    borderColor: BrandColors.glowMagenta,
  },
  filterChipText: {
    color: BrandColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  gridTile: {
    width: itemWidth,
    height: itemWidth * 1.35,
    margin: 0.6,
    position: 'relative',
    backgroundColor: '#000',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  topRightBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  viewsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  /* Requirement: User-profile logo at bottom right of reels in grid format */
  bottomRightAvatarBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarRingGradient: {
    width: 26,
    height: 26,
    borderRadius: 13,
    padding: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  accountsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  accountAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountUsername: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  accountName: {
    color: BrandColors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: BrandColors.glowMagenta,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  followBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
