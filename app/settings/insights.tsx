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

export default function InsightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const safeTopPadding = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  return (
    <View style={styles.container}>
      <View style={[styles.topHeader, { paddingTop: safeTopPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insights Overview</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Date Filter Badge */}
        <View style={styles.dateFilterPill}>
          <Text style={styles.dateFilterText}>Last 30 Days (Jul 5 - Aug 4)</Text>
          <Ionicons name="calendar-outline" size={14} color={BrandColors.glowMagenta} />
        </View>

        {/* Reach Card */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="eye" size={20} color={BrandColors.glowMagenta} />
            <Text style={styles.metricTitle}>Accounts Reached</Text>
          </View>
          <Text style={styles.metricValue}>124,890</Text>
          <Text style={styles.growthText}>+18.4% vs previous 30 days</Text>
        </View>

        {/* Engagement Card */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={20} color={BrandColors.electricCyan} />
            <Text style={styles.metricTitle}>Accounts Engaged</Text>
          </View>
          <Text style={styles.metricValue}>32,410</Text>
          <Text style={styles.growthText}>+24.1% vs previous 30 days</Text>
        </View>

        {/* Total Followers */}
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color={BrandColors.electricViolet} />
            <Text style={styles.metricTitle}>Total Followers</Text>
          </View>
          <Text style={styles.metricValue}>18.4K</Text>
          <Text style={styles.growthText}>+540 new followers</Text>
        </View>

        {/* Audience Demographics */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Top Cities & Demographics</Text>
          <View style={styles.demoRow}>
            <Text style={styles.cityName}>New York</Text>
            <View style={styles.barBg}>
              <LinearGradient colors={BrandColors.primaryGradientHorizontal} style={[styles.barFill, { width: '85%' }]} />
            </View>
            <Text style={styles.percentText}>38%</Text>
          </View>
          <View style={styles.demoRow}>
            <Text style={styles.cityName}>London</Text>
            <View style={styles.barBg}>
              <LinearGradient colors={BrandColors.primaryGradientHorizontal} style={[styles.barFill, { width: '60%' }]} />
            </View>
            <Text style={styles.percentText}>26%</Text>
          </View>
          <View style={styles.demoRow}>
            <Text style={styles.cityName}>Tokyo</Text>
            <View style={styles.barBg}>
              <LinearGradient colors={BrandColors.primaryGradientHorizontal} style={[styles.barFill, { width: '40%' }]} />
            </View>
            <Text style={styles.percentText}>18%</Text>
          </View>
        </View>
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
  dateFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 59, 112, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 112, 0.3)',
    gap: 6,
    marginBottom: 16,
  },
  dateFilterText: {
    color: BrandColors.glowMagenta,
    fontSize: 12,
    fontWeight: '600',
  },
  metricCard: {
    backgroundColor: BrandColors.bgCardDark,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricTitle: {
    color: BrandColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  metricValue: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
  },
  growthText: {
    color: BrandColors.success,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  demoCard: {
    backgroundColor: BrandColors.bgCardDark,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    marginTop: 8,
  },
  demoTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  cityName: {
    color: BrandColors.textSecondary,
    fontSize: 12,
    width: 70,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
});
