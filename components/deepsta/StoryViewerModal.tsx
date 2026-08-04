import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';
import { StoryItemData } from './StoryRing';

const { width, height } = Dimensions.get('window');

interface StoryViewerModalProps {
  visible: boolean;
  story: StoryItemData | null;
  onClose: () => void;
  onSendReply?: (story: StoryItemData, message: string) => void;
}

const SAMPLE_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
];

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  visible,
  story,
  onClose,
  onSendReply,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [progress, setProgress] = useState(0);

  // Auto advance timer simulation
  useEffect(() => {
    if (!visible) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          if (currentSlideIndex < SAMPLE_STORY_IMAGES.length - 1) {
            setCurrentSlideIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 1;
          }
        }
        return prev + 0.05;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [visible, currentSlideIndex]);

  if (!story) return null;

  const currentImage = SAMPLE_STORY_IMAGES[currentSlideIndex] || story.avatar;

  const handleNext = () => {
    if (currentSlideIndex < SAMPLE_STORY_IMAGES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (onSendReply) onSendReply(story, replyText);
    setReplyText('');
  };

  const handleQuickEmoji = (emoji: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onSendReply) onSendReply(story, emoji);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Story Media */}
        <Image source={{ uri: currentImage }} style={styles.mediaBackground} resizeMode="cover" />

        {/* Top Vignette Gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.85)']}
          style={styles.vignetteOverlay}
        />

        {/* Story Header */}
        <View style={styles.headerArea}>
          {/* Progress Segment Bars */}
          <View style={styles.progressSegmentsRow}>
            {SAMPLE_STORY_IMAGES.map((_, index) => (
              <View key={index} style={styles.segmentBg}>
                <View
                  style={[
                    styles.segmentFill,
                    {
                      width:
                        index < currentSlideIndex
                          ? '100%'
                          : index === currentSlideIndex
                          ? `${progress * 100}%`
                          : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Author Info */}
          <View style={styles.authorRow}>
            <View style={styles.authorLeft}>
              <Image source={{ uri: story.avatar }} style={styles.authorAvatar} />
              <Text style={styles.authorName}>{story.username}</Text>
              <Text style={styles.timeAgo}>3h ago</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={26} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Touch Navigation Overlay */}
        <View style={styles.touchNavigationLayer}>
          <TouchableOpacity style={styles.touchLeft} onPress={handlePrev} activeOpacity={1} />
          <TouchableOpacity style={styles.touchRight} onPress={handleNext} activeOpacity={1} />
        </View>

        {/* Bottom Reaction & Reply Bar */}
        <View style={styles.bottomBar}>
          {/* Quick Reaction Emojis */}
          <View style={styles.quickEmojisRow}>
            {['❤️', '🔥', '😂', '😮', '👏', '🎉'].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiBubble}
                onPress={() => handleQuickEmoji(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DM Reply Input */}
          <View style={styles.replyInputRow}>
            <TextInput
              style={styles.replyInput}
              placeholder={`Send message to ${story.username}...`}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
              <Ionicons name="paper-plane" size={20} color={BrandColors.glowMagenta} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  mediaBackground: {
    width: width,
    height: height,
  },
  vignetteOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerArea: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 45 : 20,
    left: 14,
    right: 14,
    zIndex: 30,
  },
  progressSegmentsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  segmentBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    backgroundColor: '#FFF',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: BrandColors.glowMagenta,
  },
  authorName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  timeAgo: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  closeBtn: {
    padding: 4,
  },
  touchNavigationLayer: {
    position: 'absolute',
    top: 100,
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 10,
  },
  touchLeft: {
    flex: 1,
  },
  touchRight: {
    flex: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 16,
    left: 14,
    right: 14,
    zIndex: 30,
  },
  quickEmojisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emojiBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  replyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  replyInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  sendBtn: {
    padding: 6,
  },
});
