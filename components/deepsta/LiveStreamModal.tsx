import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface LiveComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
}

interface LiveStreamModalProps {
  visible: boolean;
  onClose: () => void;
}

const SAMPLE_LIVE_COMMENTS: LiveComment[] = [
  {
    id: 'l1',
    user: 'sarah_m',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    text: 'Hey everyone!! Loving the live session 🔥',
  },
  {
    id: 'l2',
    user: 'jason_k',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    text: 'Can you show us your workspace setup??',
  },
];

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({ visible, onClose }) => {
  const [comments, setComments] = useState<LiveComment[]>(SAMPLE_LIVE_COMMENTS);
  const [commentText, setCommentText] = useState('');
  const [viewerCount, setViewerCount] = useState(1482);
  const [heartsCount, setHeartsCount] = useState(340);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 2000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newComm: LiveComment = {
      id: `lc_${Date.now()}`,
      user: 'you',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      text: commentText.trim(),
    };
    setComments((prev) => [...prev, newComm]);
    setCommentText('');
  };

  const handleSendHeart = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHeartsCount((prev) => prev + 1);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Stream Video Poster Background */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
          }}
          style={styles.bgStream}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.85)']}
          style={styles.gradientOverlay}
        />

        {/* Top Live Header */}
        <View style={styles.topHeader}>
          <View style={styles.hostRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
              }}
              style={styles.hostAvatar}
            />
            <View>
              <Text style={styles.hostName}>sarah_vibes</Text>
              <View style={styles.liveTagRow}>
                <View style={styles.liveTag}>
                  <Text style={styles.liveTagText}>LIVE</Text>
                </View>
                <View style={styles.viewersPill}>
                  <Ionicons name="eye-outline" size={12} color="#FFF" />
                  <Text style={styles.viewersText}>{viewerCount.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Live Chat Overlay */}
        <View style={styles.chatSection}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.chatBubbleRow}>
                <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                <View style={styles.chatTextContent}>
                  <Text style={styles.chatUsername}>{item.user}</Text>
                  <Text style={styles.chatMessage}>{item.text}</Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Bottom Toolbar */}
        <View style={styles.bottomToolbar}>
          <View style={styles.commentInputBox}>
            <TextInput
              style={styles.commentInput}
              placeholder="Comment live..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={handleSendComment}
            />
          </View>

          <TouchableOpacity style={styles.iconActionBtn} onPress={handleSendHeart}>
            <Ionicons name="heart" size={24} color={BrandColors.glowMagenta} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconActionBtn}>
            <Ionicons name="gift-outline" size={22} color={BrandColors.electricCyan} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconActionBtn}>
            <Ionicons name="person-add-outline" size={22} color="#FFF" />
          </TouchableOpacity>
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
  bgStream: {
    width: width,
    height: height,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hostAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#FF0055',
  },
  hostName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  liveTag: {
    backgroundColor: '#FF0055',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  liveTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  viewersPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  viewersText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  chatSection: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 80,
    height: 220,
    justifyContent: 'flex-end',
  },
  chatBubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
    gap: 8,
  },
  chatAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  chatTextContent: {
    flex: 1,
  },
  chatUsername: {
    color: BrandColors.glowMagenta,
    fontSize: 11,
    fontWeight: '700',
  },
  chatMessage: {
    color: '#FFF',
    fontSize: 12,
  },
  bottomToolbar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  commentInputBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  commentInput: {
    color: '#FFF',
    fontSize: 14,
  },
  iconActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
