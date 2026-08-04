import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';
import { PostItemData } from './PostCard';

interface CommentItemData {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

const MOCK_COMMENTS: CommentItemData[] = [
  {
    id: 'c1',
    user: {
      username: 'sarah_vibes',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    text: 'This vibe is absolutely unmatched! 🔥 Love the color gradient aesthetics.',
    createdAt: '2h',
    likesCount: 14,
    isLiked: true,
  },
  {
    id: 'c2',
    user: {
      username: 'dev_alex',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    text: 'Where was this shot taken? The lighting looks magical! ✨',
    createdAt: '1h',
    likesCount: 8,
  },
  {
    id: 'c3',
    user: {
      username: 'creative_maya',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    text: 'Deepsta UI is looking so clean! Can’t wait for more updates! 💜',
    createdAt: '30m',
    likesCount: 5,
  },
];

interface CommentDrawerModalProps {
  visible: boolean;
  post: PostItemData | null;
  onClose: () => void;
}

export const CommentDrawerModal: React.FC<CommentDrawerModalProps> = ({
  visible,
  post,
  onClose,
}) => {
  const [comments, setComments] = useState<CommentItemData[]>(MOCK_COMMENTS);
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newComment: CommentItemData = {
      id: `c_${Date.now()}`,
      user: {
        username: 'you',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      },
      text: commentText.trim(),
      createdAt: 'Just now',
      likesCount: 0,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const toggleCommentLike = (commentId: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setComments((prev) =>
      prev.map((item) => {
        if (item.id === commentId) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likesCount: isLiked ? item.likesCount + 1 : item.likesCount - 1,
          };
        }
        return item;
      })
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Sheet Handle Indicator */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={BrandColors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Comment List */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentMain}>
                  <Text style={styles.commentBody}>
                    <Text style={styles.commentUsername}>{item.user.username}</Text>{' '}
                    {item.text}
                  </Text>
                  <View style={styles.commentMetaRow}>
                    <Text style={styles.commentTime}>{item.createdAt}</Text>
                    <Text style={styles.commentReplyText}>Reply</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.likeBtn}
                  onPress={() => toggleCommentLike(item.id)}
                >
                  <Ionicons
                    name={item.isLiked ? 'heart' : 'heart-outline'}
                    size={16}
                    color={item.isLiked ? BrandColors.glowMagenta : BrandColors.textMuted}
                  />
                  {item.likesCount > 0 && (
                    <Text style={styles.likeCountText}>{item.likesCount}</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
              }}
              style={styles.inputAvatar}
            />
            <TextInput
              style={styles.inputField}
              placeholder={`Comment as you...`}
              placeholderTextColor={BrandColors.textMuted}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={!commentText.trim()}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.postBtnText,
                  { color: commentText.trim() ? BrandColors.glowMagenta : BrandColors.textMuted },
                ]}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    height: '65%',
    backgroundColor: BrandColors.bgCardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    paddingTop: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  sheetTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: 18,
    gap: 12,
  },
  commentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  commentMain: {
    flex: 1,
  },
  commentBody: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
  },
  commentUsername: {
    fontWeight: '700',
    color: '#FFF',
  },
  commentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 4,
  },
  commentTime: {
    color: BrandColors.textMuted,
    fontSize: 11,
  },
  commentReplyText: {
    color: BrandColors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  likeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  likeCountText: {
    color: BrandColors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: BrandColors.bgDark,
    gap: 12,
  },
  inputAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  inputField: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    height: 40,
  },
  postBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
