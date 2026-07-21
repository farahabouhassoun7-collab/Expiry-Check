import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import type { Notification } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1',  title: 'Critical Expiry Alert',      body: 'Organic Hydration Serum (Batch A1) expires in 3 days — 50 units remaining.',          type: 'alert',  read: false, timestamp: '2 min ago'   },
  { id: '2',  title: 'Task Assigned',              body: 'You have a new task: Check dairy section expiry dates by 9:00 AM.',                    type: 'task',   read: false, timestamp: '15 min ago'  },
  { id: '3',  title: 'High Risk Item',             body: 'Multi-Vitamin Complex (90 ct) — 14 days remaining, 120 units at risk.',                type: 'alert',  read: false, timestamp: '1 hour ago'  },
  { id: '4',  title: 'AI Recommendation',          body: 'Apply 25% discount on Artisanal Olive Oil to clear 42 units before expiry.',           type: 'system', read: true,  timestamp: '2 hours ago' },
  { id: '5',  title: 'Task Completed',             body: 'Morning walk inspection completed by Alex J. — 7 items flagged.',                      type: 'task',   read: true,  timestamp: '3 hours ago' },
  { id: '6',  title: 'Auto-Markdown Applied',      body: '12 items moved to Flash Sale tier with 30% discount. Inventory moving.',               type: 'system', read: true,  timestamp: 'Yesterday'   },
  { id: '7',  title: 'Sensor Offline',             body: 'Freezer 04 temperature sensor not responding. Please check immediately.',              type: 'system', read: true,  timestamp: 'Yesterday'   },
  { id: '8',  title: 'Weekly Report Ready',        body: 'Your weekly waste reduction report is ready. Saved $840 this week.',                   type: 'system', read: true,  timestamp: '2 days ago'  },
];

const TYPE_CONFIG = {
  alert:  { icon: 'alert-circle',   color: Colors.error,    bg: 'rgba(186,26,26,0.10)'  },
  task:   { icon: 'checkbox',       color: Colors.secondary, bg: 'rgba(0,88,190,0.10)'  },
  system: { icon: 'information-circle', color: Colors.primary, bg: 'rgba(0,108,73,0.10)' },
} as const;

function NotifItem({ notif, onRead, index }: { notif: Notification; onRead: (id: string) => void; index: number }) {
  const cfg = TYPE_CONFIG[notif.type];

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity
        style={[styles.card, !notif.read && styles.cardUnread]}
        onPress={() => onRead(notif.id)}
        activeOpacity={0.85}
      >
        {/* Unread dot */}
        {!notif.read && <View style={styles.unreadDot} />}

        {/* Icon */}
        <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
        </View>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={[styles.title, !notif.read && styles.titleUnread]} numberOfLines={1}>
              {notif.title}
            </Text>
            <Text style={styles.time}>{notif.timestamp}</Text>
          </View>
          <Text style={styles.bodyText} numberOfLines={2}>{notif.body}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); }, 800);
  }, []);

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        rightIcon={unreadCount > 0 ? 'checkmark-done-outline' : undefined}
        onRightPress={markAllRead}
      />

      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        renderItem={({ item, index }) => <NotifItem notif={item} onRead={markRead} index={index} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState icon="notifications-off-outline" title="No notifications" subtitle="You're all caught up!" />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.background },
  list:        { padding: Spacing.base, paddingBottom: 100 },
  card:        { backgroundColor: Colors.backgroundPure, borderRadius: Radius.xl, padding: Spacing.base, flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.card, position: 'relative' },
  cardUnread:  { borderColor: Colors.primary + '40', backgroundColor: 'rgba(0,108,73,0.03)' },
  unreadDot:   { position: 'absolute', top: Spacing.md, right: Spacing.md, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  iconWrap:    { width: 44, height: 44, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  body:        { flex: 1, gap: Spacing.xs },
  topRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.sm },
  title:       { ...Typography.smallBold, color: Colors.textBody, flex: 1 },
  titleUnread: { color: Colors.textHeading, fontWeight: '700' },
  time:        { ...Typography.caption, color: Colors.outline, flexShrink: 0 },
  bodyText:    { ...Typography.small, color: Colors.textBody, lineHeight: 18 },
  separator:   { height: Spacing.sm },
});
