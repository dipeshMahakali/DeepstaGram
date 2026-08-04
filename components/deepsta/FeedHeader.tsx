import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';

export type FeedType = 'For You' | 'Following' | 'Favorites';

interface FeedHeaderProps {
  currentFeed: FeedType;
  onFeedSelect: (feed: FeedType) => void;
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  currentFeed,
  onFeedSelect,
  unreadMessagesCount = 3,
  unreadNotificationsCount = 5,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const safeTopPadding = Math.max(insets.top, StatusBar.currentHeight || 0) + 8;

  const handleSelectFeed = (type: FeedType) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    onFeedSelect(type);
    setDropdownVisible(false);
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: safeTopPadding }]}>
      {/* Brand Logo & Feed Selector Dropdown */}
      <TouchableOpacity
        style={styles.logoRow}
        onPress={() => setDropdownVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.brandTitle}>DEEPSTA</Text>
        <View style={styles.feedTagBadge}>
          <Text style={styles.feedTagText}>{currentFeed}</Text>
          <Ionicons name="chevron-down" size={14} color={BrandColors.glowMagenta} />
        </View>
      </TouchableOpacity>

      {/* Right Top Bar Icons: Notifications & Direct Messages */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/notifications' as any);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="heart-outline" size={24} color="#FFF" />
          {unreadNotificationsCount > 0 && (
            <View style={styles.badgeNotification}>
              <Text style={styles.badgeText}>
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/messages' as any);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="paper-plane-outline" size={22} color="#FFF" />
          {unreadMessagesCount > 0 && (
            <View style={styles.badgeMessage}>
              <Text style={styles.badgeText}>
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Feed Toggle Selector Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownCard}>
            {(['For You', 'Following', 'Favorites'] as FeedType[]).map((type) => {
              const isSelected = currentFeed === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}
                  onPress={() => handleSelectFeed(type)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dropdownItemLeft}>
                    <Ionicons
                      name={
                        type === 'For You'
                          ? 'sparkles'
                          : type === 'Following'
                          ? 'people'
                          : 'star'
                      }
                      size={18}
                      color={isSelected ? BrandColors.glowMagenta : BrandColors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color={BrandColors.glowMagenta} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 12,
    paddingBottom: 12,
    backgroundColor: BrandColors.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    zIndex: 100,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  feedTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 112, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 112, 0.3)',
    gap: 4,
  },
  feedTagText: {
    color: BrandColors.glowMagenta,
    fontSize: 11,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeNotification: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: BrandColors.glowMagenta,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeMessage: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: BrandColors.electricCyan,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: Platform.OS === 'ios' ? 90 : 60,
    paddingLeft: 16,
  },
  dropdownCard: {
    width: 180,
    backgroundColor: BrandColors.bgCardDark,
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255, 59, 112, 0.1)',
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownItemText: {
    color: BrandColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownItemTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
});
