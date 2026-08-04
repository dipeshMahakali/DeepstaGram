import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { ReelItem, ReelItemData } from '@/components/deepsta/ReelItem';
import { CommentDrawerModal } from '@/components/deepsta/CommentDrawerModal';
import { PostItemData } from '@/components/deepsta/PostCard';

const { height } = Dimensions.get('window');

const INITIAL_REELS: ReelItemData[] = [
  {
    id: 'r1',
    creator: {
      username: 'cyber_creator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isFollowing: false,
    },
    videoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    audioTrack: {
      title: 'Cyberpunk Odyssey (Synthwave Vibe)',
      artist: 'Deepsta Audio',
    },
    caption: 'Exploring neon alleyways in Shibuya 🌃✨ #TokyoVibes #Deepsta #Neon',
    likesCount: 42800,
    commentsCount: 1290,
    sharesCount: 540,
  },
  {
    id: 'r2',
    creator: {
      username: 'elena_art',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      isFollowing: true,
    },
    videoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    audioTrack: {
      title: 'Sunset Chill • Lo-Fi Dreams',
      artist: 'Aesthetic Beats',
    },
    caption: 'Golden hour waves in Bali 🌊 Real magic moments #OceanLife #Travel',
    likesCount: 89100,
    commentsCount: 3410,
    sharesCount: 1200,
  },
  {
    id: 'r3',
    creator: {
      username: 'sarah_vibes',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    videoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    audioTrack: {
      title: 'Deep Midnight Synths',
      artist: 'Vibe Master',
    },
    caption: 'Starry night reflections ✨ Infinite energy #NightVibes #Mindfulness',
    likesCount: 65400,
    commentsCount: 2100,
    sharesCount: 890,
  },
];

export default function ReelsScreen() {
  const router = useRouter();
  const [reelsList, setReelsList] = useState<ReelItemData[]>(INITIAL_REELS);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedCommentPost, setSelectedCommentPost] = useState<PostItemData | null>(null);

  // Infinite Scroll Handler for Reels Feed
  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);

    setTimeout(() => {
      const nextBatch: ReelItemData[] = INITIAL_REELS.map((item, index) => ({
        ...item,
        id: `reel_${Date.now()}_${index}`,
        likesCount: item.likesCount + Math.floor(Math.random() * 500),
      }));

      setReelsList((prev) => [...prev, ...nextBatch]);
      setLoadingMore(false);
    }, 800);
  };

  const handleOpenComments = (reel: ReelItemData) => {
    setSelectedCommentPost({
      id: reel.id,
      author: {
        name: reel.creator.username,
        username: reel.creator.username,
        avatar: reel.creator.avatar,
      },
      mediaUrl: reel.videoUrl,
      likesCount: reel.likesCount,
      commentsCount: reel.commentsCount,
      caption: reel.caption,
      createdAt: 'Recently',
    });
    setShowCommentModal(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reelsList}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <ReelItem
            reel={item}
            onCommentPress={handleOpenComments}
            onSharePress={() => router.push('/messages' as any)}
            onProfilePress={() => router.push('/(tabs)/profile')}
          />
        )}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loaderFooter}>
              <ActivityIndicator size="large" color={BrandColors.glowMagenta} />
            </View>
          ) : null
        }
      />

      <CommentDrawerModal
        visible={showCommentModal}
        post={selectedCommentPost}
        onClose={() => setShowCommentModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderFooter: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
