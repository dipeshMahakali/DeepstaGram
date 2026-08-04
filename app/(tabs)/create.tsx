import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';

export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [caption, setCaption] = useState('');
  const [vibeAudio, setVibeAudio] = useState('Midnight Synthwave • Neon Beats');
  const [location, setLocation] = useState('Tokyo, Japan');
  const [isPosting, setIsPosting] = useState(false);

  const safeTop = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  const sampleImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  ];
  const [selectedImage, setSelectedImage] = useState(sampleImages[0]);

  const handleSharePost = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Deepsta Post</Text>
        <TouchableOpacity onPress={handleSharePost} disabled={isPosting}>
          <Text style={styles.shareBtnText}>{isPosting ? 'Sharing...' : 'Share'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Media Preview */}
        <View style={styles.mediaContainer}>
          <Image source={{ uri: selectedImage }} style={styles.mainMedia} />
          <View style={styles.vibeBadge}>
            <Ionicons name="musical-notes" size={14} color="#FFF" />
            <Text style={styles.vibeBadgeText}>{vibeAudio}</Text>
          </View>
        </View>

        {/* Media Selector Row */}
        <Text style={styles.sectionTitle}>Choose Media</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
          {sampleImages.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedImage(img)}
              style={[
                styles.thumbWrapper,
                selectedImage === img && styles.thumbActive,
              ]}
            >
              <Image source={{ uri: img }} style={styles.thumbImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Caption Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Caption</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption or add #hashtags..."
            placeholderTextColor={BrandColors.textMuted}
            multiline
            value={caption}
            onChangeText={setCaption}
          />
        </View>

        {/* Deepsta Vibe Audio */}
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="disc-outline" size={20} color={BrandColors.glowMagenta} />
            <Text style={styles.optionText}>Add DeepVibe Audio</Text>
          </View>
          <Text style={styles.optionVal}>{vibeAudio}</Text>
        </View>

        {/* Location Tag */}
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="location-outline" size={20} color={BrandColors.glowCyan} />
            <Text style={styles.optionText}>Add Location</Text>
          </View>
          <Text style={styles.optionVal}>{location}</Text>
        </View>

        {/* Share Button */}
        <TouchableOpacity onPress={handleSharePost} disabled={isPosting} activeOpacity={0.85}>
          <LinearGradient
            colors={BrandColors.primaryGradientHorizontal}
            style={styles.postBtn}
          >
            <Text style={styles.postBtnText}>{isPosting ? 'Publishing...' : 'Publish Post'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bgDark,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  shareBtnText: {
    color: BrandColors.glowMagenta,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  mediaContainer: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  mainMedia: {
    width: '100%',
    height: '100%',
  },
  vibeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 12, 21, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  vibeBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    color: BrandColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  mediaRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  thumbWrapper: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: BrandColors.glowMagenta,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    color: BrandColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  captionInput: {
    backgroundColor: BrandColors.bgInputDark,
    borderRadius: 16,
    padding: 14,
    color: '#FFF',
    fontSize: 15,
    minHeight: 80,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BrandColors.bgCardDark,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  optionVal: {
    color: BrandColors.textMuted,
    fontSize: 12,
  },
  postBtn: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  postBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
