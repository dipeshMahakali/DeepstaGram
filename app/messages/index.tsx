import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';

interface NoteItem {
  id: string;
  user: string;
  avatar: string;
  noteText: string;
  isUserNote?: boolean;
}

interface ChatThread {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    isOnline?: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
}

const SAMPLE_NOTES: NoteItem[] = [
  { id: 'n1', user: 'Your Note', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', noteText: 'Share a vibe...', isUserNote: true },
  { id: 'n2', user: 'sarah_m', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', noteText: 'Late night coding ✨' },
  { id: 'n3', user: 'alex_dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', noteText: 'Coffee & Lo-Fi 🎧' },
];

const SAMPLE_CHATS: ChatThread[] = [
  {
    id: 't1',
    user: {
      name: 'Sarah Miller',
      username: 'sarah_m',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isOnline: true,
    },
    lastMessage: 'Sent a story reply • 12m',
    timestamp: '12m',
    unreadCount: 2,
  },
  {
    id: 't2',
    user: {
      name: 'Alex Johnson',
      username: 'alex_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      isOnline: false,
    },
    lastMessage: 'Let’s record that DeepVibe audio track tomorrow!',
    timestamp: '2h',
  },
  {
    id: 't3',
    user: {
      name: 'Maya Lin',
      username: 'creative_maya',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      isOnline: true,
    },
    lastMessage: 'Reacted to your story ❤️',
    timestamp: '1d',
  },
];

export default function DirectMessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'primary' | 'general' | 'requests'>('primary');

  const safeTopPadding = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  const filteredChats = SAMPLE_CHATS.filter(
    (c) =>
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Header Navigation */}
      <View style={[styles.topHeader, { paddingTop: safeTopPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Direct Messages</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="videocam-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="create-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBoxWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={BrandColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages or people..."
            placeholderTextColor={BrandColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Notes Bubble Carousel */}
      <View style={styles.notesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.notesScroll}>
          {SAMPLE_NOTES.map((item) => (
            <TouchableOpacity key={item.id} style={styles.noteItem} activeOpacity={0.8}>
              <View style={styles.noteBubble}>
                <Text style={styles.noteBubbleText} numberOfLines={2}>
                  {item.noteText}
                </Text>
              </View>
              <View style={styles.noteAvatarWrapper}>
                <Image source={{ uri: item.avatar }} style={styles.noteAvatar} />
                {item.isUserNote && (
                  <View style={styles.addNotePlus}>
                    <Ionicons name="add" size={12} color="#FFF" />
                  </View>
                )}
              </View>
              <Text style={styles.noteUserText} numberOfLines={1}>
                {item.user}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter Tabs (Primary / General / Requests) */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'primary' && styles.tabBtnActive]}
          onPress={() => setActiveTab('primary')}
        >
          <Text style={[styles.tabText, activeTab === 'primary' && styles.tabTextActive]}>
            Primary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'general' && styles.tabBtnActive]}
          onPress={() => setActiveTab('general')}
        >
          <Text style={[styles.tabText, activeTab === 'general' && styles.tabTextActive]}>
            General
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            Requests (1)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatThreadRow} activeOpacity={0.7}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.user.avatar }} style={styles.chatAvatar} />
              {item.user.isOnline && <View style={styles.onlineBadge} />}
            </View>

            <View style={styles.chatMain}>
              <Text style={styles.chatName}>{item.user.name}</Text>
              <Text style={styles.chatSubtext} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            {item.unreadCount ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            ) : (
              <Ionicons name="camera-outline" size={20} color={BrandColors.textMuted} />
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.chatsList}
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
    paddingBottom: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 14,
  },
  actionBtn: {
    padding: 4,
  },
  searchBoxWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.bgInputDark,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  notesSection: {
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  notesScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  noteItem: {
    alignItems: 'center',
    width: 76,
  },
  noteBubble: {
    backgroundColor: BrandColors.bgCardDark,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 6,
    width: '100%',
  },
  noteBubbleText: {
    color: '#FFF',
    fontSize: 10,
    textAlign: 'center',
  },
  noteAvatarWrapper: {
    position: 'relative',
  },
  noteAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  addNotePlus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: BrandColors.glowMagenta,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BrandColors.bgDark,
  },
  noteUserText: {
    color: BrandColors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 20,
  },
  tabBtn: {
    paddingVertical: 4,
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: BrandColors.glowMagenta,
  },
  tabText: {
    color: BrandColors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  chatsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  chatThreadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  avatarContainer: {
    position: 'relative',
  },
  chatAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BrandColors.success,
    borderWidth: 2,
    borderColor: BrandColors.bgDark,
  },
  chatMain: {
    flex: 1,
  },
  chatName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  chatSubtext: {
    color: BrandColors.textMuted,
    fontSize: 13,
  },
  unreadBadge: {
    backgroundColor: BrandColors.glowMagenta,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
