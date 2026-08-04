import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const itemWidth = width / 3;

const MOCK_ARCHIVES = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
];

export default function ArchiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'stories' | 'posts'>('stories');
  const safeTopPadding = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  return (
    <View style={styles.container}>
      <View style={[styles.topHeader, { paddingTop: safeTopPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'stories' ? 'Stories Archive' : 'Posts Archive'}
        </Text>
        <TouchableOpacity
          onPress={() => setMode(mode === 'stories' ? 'posts' : 'stories')}
          style={styles.switchBtn}
        >
          <Ionicons name="swap-horizontal" size={20} color={BrandColors.glowMagenta} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_ARCHIVES}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridItem}>
            <Image source={{ uri: item }} style={styles.gridImage} />
            <View style={styles.dateTag}>
              <Text style={styles.dateTagText}>14 Aug</Text>
            </View>
          </TouchableOpacity>
        )}
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
  switchBtn: {
    padding: 4,
  },
  gridItem: {
    width: itemWidth,
    height: itemWidth * 1.3,
    padding: 1,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  dateTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dateTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
