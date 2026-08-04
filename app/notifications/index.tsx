import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  postThumbnail?: string;
  isFollowing?: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'like',
    user: {
      username: 'sarah_vibes',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    text: 'liked your post.',
    timestamp: '2m',
    postThumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'n2',
    type: 'follow',
    user: {
      username: 'alex_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    text: 'started following you.',
    timestamp: '1h',
    isFollowing: false,
  },
  {
    id: 'n3',
    type: 'comment',
    user: {
      username: 'creative_maya',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    text: 'commented: "Deepsta UI looks stunning! 🔥"',
    timestamp: '3h',
    postThumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const safeTopPadding = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topHeader, { paddingTop: safeTopPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />

            <View style={styles.content}>
              <Text style={styles.text}>
                <Text style={styles.username}>{item.user.username}</Text> {item.text}{' '}
                <Text style={styles.time}>{item.timestamp}</Text>
              </Text>
            </View>

            {item.type === 'follow' ? (
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            ) : item.postThumbnail ? (
              <Image source={{ uri: item.postThumbnail }} style={styles.thumb} />
            ) : null}
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bgDark,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  content: {
    flex: 1,
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
  },
  username: {
    fontWeight: '700',
  },
  time: {
    color: BrandColors.textMuted,
    fontSize: 11,
  },
  followBtn: {
    backgroundColor: BrandColors.glowMagenta,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  followText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
});
