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
import { BrandColors } from '@/constants/theme';

export default function SettingsAndPrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const safeTopPadding = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  return (
    <View style={styles.container}>
      <View style={[styles.topHeader, { paddingTop: safeTopPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings and Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Your Account</Text>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => router.push('/settings/insights' as any)}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="stats-chart" size={20} color={BrandColors.glowMagenta} />
            <Text style={styles.itemText}>Insights & Creator Tools</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => router.push('/settings/activity' as any)}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="time" size={20} color={BrandColors.electricCyan} />
            <Text style={styles.itemText}>Your Activity & Time Spent</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => router.push('/settings/archive' as any)}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="archive" size={20} color={BrandColors.electricViolet} />
            <Text style={styles.itemText}>Archive (Stories & Posts)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => router.push('/settings/saved' as any)}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="bookmark" size={20} color="#F59E0B" />
            <Text style={styles.itemText}>Saved Posts & Audio</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Privacy & Security</Text>

        <TouchableOpacity style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name="lock-closed" size={20} color={BrandColors.textSecondary} />
            <Text style={styles.itemText}>Account Privacy</Text>
          </View>
          <Text style={styles.valueText}>Public</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name="notifications" size={20} color={BrandColors.textSecondary} />
            <Text style={styles.itemText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name="shield-checkmark" size={20} color={BrandColors.textSecondary} />
            <Text style={styles.itemText}>Security & Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.itemRow, { marginTop: 24 }]}
          onPress={() => router.replace('/(auth)/login')}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="log-out-outline" size={20} color={BrandColors.danger} />
            <Text style={[styles.itemText, { color: BrandColors.danger }]}>Log Out</Text>
          </View>
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
  sectionHeader: {
    color: BrandColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BrandColors.bgCardDark,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  valueText: {
    color: BrandColors.textMuted,
    fontSize: 13,
  },
});
