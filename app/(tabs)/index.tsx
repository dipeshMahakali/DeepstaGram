import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { FeedHeader, FeedType } from '@/components/deepsta/FeedHeader';
import { StoryRing, StoryItemData } from '@/components/deepsta/StoryRing';
import { PostCard, PostItemData } from '@/components/deepsta/PostCard';
import { StoryViewerModal } from '@/components/deepsta/StoryViewerModal';
import { CommentDrawerModal } from '@/components/deepsta/CommentDrawerModal';
import { LiveStreamModal } from '@/components/deepsta/LiveStreamModal';

const STORIES: StoryItemData[] = [
  {
    id: 's0',
    username: 'Your Story',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    isUserStory: true,
  },
  {
    id: 's1',
    username: 'sarah_vibes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    hasUnseenStory: true,
    isLive: true,
  },
  {
    id: 's2',
    username: 'alex_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    hasUnseenStory: true,
  },
  {
    id: 's3',
    username: 'creative_maya',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    hasUnseenStory: true,
  },
  {
    id: 's4',
    username: 'jason_photo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    hasUnseenStory: false,
  },
];

const POSTS: PostItemData[] = [
  {
    id: 'p1',
    author: {
      name: 'Sarah Miller',
      username: 'sarah_vibes',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
    },
    location: 'Cyber Neon District • Tokyo',
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    audioTrack: {
      title: 'Midnight Vibe (Original Audio)',
      artist: 'Deepsta Beats',
    },
    likesCount: 14280,
    commentsCount: 384,
    caption: 'Lost in the neon glow of the midnight aesthetic. What vibe are you tuning into today? ✨ #DeepstaVibes #CyberAesthetics #NeonGlow',
    createdAt: '2 hours ago',
    isLiked: true,
  },
  {
    id: 'p2',
    author: {
      name: 'Alex Johnson',
      username: 'alex_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      isVerified: false,
    },
    location: 'Silicon Valley, CA',
    mediaUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    audioTrack: {
      title: 'Lo-Fi Chill Code',
      artist: 'Synthwave Labs',
    },
    likesCount: 8940,
    commentsCount: 120,
    caption: 'Building the next evolution of social experience with React Native and Expo! 🚀 Code and coffee.',
    createdAt: '5 hours ago',
    isSaved: true,
  },
];

export default function HomeFeedScreen() {
  const router = useRouter();
  const [currentFeed, setCurrentFeed] = useState<FeedType>('For You');
  const [postsList, setPostsList] = useState<PostItemData[]>(POSTS);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [selectedStory, setSelectedStory] = useState<StoryItemData | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedCommentPost, setSelectedCommentPost] = useState<PostItemData | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPostsList(POSTS);
      setRefreshing(false);
    }, 1000);
  };

  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const newPosts: PostItemData[] = POSTS.map((p, idx) => ({
        ...p,
        id: `post_${Date.now()}_${idx}`,
        likesCount: p.likesCount + Math.floor(Math.random() * 200),
        createdAt: 'Earlier today',
      }));
      setPostsList((prev) => [...prev, ...newPosts]);
      setLoadingMore(false);
    }, 800);
  };

  const handleStoryPress = (story: StoryItemData) => {
    if (story.isLive) {
      setShowLiveModal(true);
    } else {
      setSelectedStory(story);
      setShowStoryModal(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Feed Header Component */}
      <FeedHeader
        currentFeed={currentFeed}
        onFeedSelect={setCurrentFeed}
        unreadMessagesCount={3}
        unreadNotificationsCount={5}
      />

      {/* Main Feed Content List */}
      <FlatList
        data={postsList}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={BrandColors.glowMagenta}
          />
        }
        ListHeaderComponent={
          <View style={styles.storiesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesScrollContent}
            >
              {STORIES.map((story) => (
                <StoryRing
                  key={story.id}
                  story={story}
                  onPress={handleStoryPress}
                  onAddStoryPress={() => router.push('/(tabs)/create')}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={BrandColors.glowMagenta} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onCommentPress={(post) => {
              setSelectedCommentPost(post);
              setShowCommentModal(true);
            }}
            onSharePress={() => router.push('/messages' as any)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Story Viewer Modal Component */}
      <StoryViewerModal
        visible={showStoryModal}
        story={selectedStory}
        onClose={() => setShowStoryModal(false)}
      />

      {/* Comment Drawer Sheet Component */}
      <CommentDrawerModal
        visible={showCommentModal}
        post={selectedCommentPost}
        onClose={() => setShowCommentModal(false)}
      />

      {/* Live Stream View Component */}
      <LiveStreamModal
        visible={showLiveModal}
        onClose={() => setShowLiveModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bgDark,
  },
  storiesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: BrandColors.bgDark,
  },
  storiesScrollContent: {
    paddingHorizontal: 12,
  },
});
