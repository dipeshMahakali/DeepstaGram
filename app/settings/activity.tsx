import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandColors } from '@/constants/theme';

export default function YourActivityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const safeTopPadding = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  return (
    <View style={styles.container}>
      <View style={[styles.topHeader, { paddingTop: safeTopPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Time Spent Dashboard Card */}
        <View style={styles.dashboardCard}>
          <Text style={styles.cardLabel}>Daily Average</Text>
          <Text style={styles.timeValue}>48m <Text style={styles.subText}>/ day</Text></Text>
          <Text style={styles.descText}>
            You spent 12% less time on Deepsta this week compared to last week.
          </Text>

          {/* Bar Chart Representation */}
          <View style={styles.chartRow}>
            {[
              { day: 'M', height: '40%' },
              { day: 'T', height: '60%' },
              { day: 'W', height: '80%' },
              { day: 'T', height: '50%' },
              { day: 'F', height: '90%' },
              { day: 'S', height: '70%' },
              { day: 'S', height: '45%' },
            ].map((item, idx) => (
              <View key={idx} style={styles.barItem}>
                <View style={styles.barBg}>
                  <LinearGradient
                    colors={BrandColors.primaryGradient}
                    style={[styles.barFill, { height: item.height as any }]}
                  />
                </View>
                <Text style={styles.barDay}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Interactions</Text>

        <TouchableOpacity style={styles.actionRow}>
          <View style={styles.actionLeft}>
            <Ionicons name="heart" size={20} color={BrandColors.glowMagenta} />
            <Text style={styles.actionText}>Likes History</Text>
          </View>
          <Text style={styles.countTag}>1,420 likes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow}>
          <View style={styles.actionLeft}>
            <Ionicons name="chatbubble" size={20} color={BrandColors.electricCyan} />
            <Text style={styles.actionText}>Comments History</Text>
          </View>
          <Text style={styles.countTag}>380 comments</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Removed & Archived Content</Text>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push('/settings/archive' as any)}
        >
          <View style={styles.actionLeft}>
            <Ionicons name="archive" size={20} color={BrandColors.electricViolet} />
            <Text style={styles.actionText}>Recently Deleted</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dashboardCard: {
    backgroundColor: BrandColors.bgCardDark,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    marginBottom: 20,
  },
  cardLabel: {
    color: BrandColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 4,
  },
  subText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    fontWeight: '500',
  },
  descText: {
    color: BrandColors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barBg: {
    width: 10,
    height: 74,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
  },
  barDay: {
    color: BrandColors.textMuted,
    fontSize: 11,
    marginTop: 6,
  },
  sectionTitle: {
    color: BrandColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BrandColors.bgCardDark,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  countTag: {
    color: BrandColors.textMuted,
    fontSize: 12,
  },
});
