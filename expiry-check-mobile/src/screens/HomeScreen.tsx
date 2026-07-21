import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import { getProducts, getMockExpiryDays, getRiskLevel, formatExpiryDate } from '../services/api';
import type { Product } from '../types';

const QUICK_ACTIONS = [
  { icon: 'scan-outline',        label: 'Scan',      color: Colors.primary,    route: '/scanner'   },
  { icon: 'alert-circle-outline',label: 'Alerts',    color: Colors.error,      route: '/alerts'    },
  { icon: 'cube-outline',        label: 'Inventory', color: Colors.secondary,  route: '/inventory' },
  { icon: 'checkbox-outline',    label: 'Tasks',     color: Colors.tertiary,   route: '/tasks'     },
] as const;

function StatCard({ label, value, icon, color, delay }: any) {
  const opacity = useSharedValue(0);
  const y       = useSharedValue(20);
  const style   = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: y.value }] }));

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    y.value       = withDelay(delay, withSpring(0, { damping: 14 }));
  }, []);

  return (
    <Animated.View style={[styles.statCard, style]}>
      <View style={[styles.statIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router  = useRouter();
  const [expiringSoon, setExpiringSoon] = useState<Product[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const headerOpacity = useSharedValue(0);
  const headerY       = useSharedValue(-20);
  const headerStyle   = useAnimatedStyle(() => ({ opacity: headerOpacity.value, transform: [{ translateY: headerY.value }] }));

  const loadData = useCallback(() => {
    return getProducts(10, 0).then(data => {
      const sorted = [...data.products].sort((a, b) => getMockExpiryDays(a.id) - getMockExpiryDays(b.id));
      setExpiringSoon(sorted.slice(0, 5));
    }).finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value       = withSpring(0, { damping: 14 });
    loadData();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryFixedDim} />}>

        {/* Header */}
        <Animated.View style={headerStyle}>
          <LinearGradient colors={[Colors.onPrimaryContainer, '#005c3e']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.circle1} /><View style={styles.circle2} />
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Good morning 👋</Text>
                <Text style={styles.name}>Alex Rivera</Text>
                <Text style={styles.date}>{today}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications' as any)}>
                  <Ionicons name="notifications-outline" size={22} color="#fff" />
                  <View style={styles.notifDot} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile' as any)}>
                  <Text style={styles.avatarText}>AR</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Hero stats */}
            <View style={styles.heroStats}>
              {[
                { label: 'Expiring Today', value: '3',  urgent: true  },
                { label: 'High Risk',      value: '12', urgent: true  },
                { label: 'Tasks Done',     value: '7',  urgent: false },
              ].map((s) => (
                <View key={s.label} style={styles.heroStat}>
                  <Text style={[styles.heroStatVal, s.urgent && { color: Colors.tertiaryContainer }]}>{s.value}</Text>
                  <Text style={styles.heroStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.content}>
          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { label: 'Total Items',  value: '1,248', icon: 'cube',               color: Colors.primary,   delay: 100 },
              { label: 'Near Expiry', value: '48',    icon: 'time',               color: Colors.tertiary,  delay: 200 },
              { label: 'Critical',    value: '12',    icon: 'alert-circle',       color: Colors.error,     delay: 300 },
              { label: 'Saved Today', value: '$840',  icon: 'trending-up',        color: Colors.secondary, delay: 400 },
            ].map((s) => <StatCard key={s.label} {...s} />)}
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {QUICK_ACTIONS.map((a, i) => (
              <Animated.View key={a.label} style={{ opacity: 1 }}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(a.route as any)}>
                  <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}>
                    <Ionicons name={a.icon as any} size={24} color={a.color} />
                  </View>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Expiring Soon */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expiring Soon</Text>
            <TouchableOpacity onPress={() => router.push('/inventory')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingRow}>
              {[1,2,3].map(i => <View key={i} style={styles.skeletonCard} />)}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll} contentContainerStyle={{ gap: Spacing.md, paddingRight: Spacing.base }}>
              {expiringSoon.map((p) => {
                const days  = getMockExpiryDays(p.id);
                const risk  = getRiskLevel(days);
                return (
                  <TouchableOpacity key={p.id} style={styles.expiryCard} onPress={() => router.push(`/product/${p.id}` as any)}>
                    <Image source={{ uri: p.thumbnail }} style={styles.expiryImg} />
                    <View style={styles.expiryInfo}>
                      <StatusBadge level={risk} size="sm" />
                      <Text style={styles.expiryTitle} numberOfLines={2}>{p.title}</Text>
                      <View style={styles.expiryDays}>
                        <Ionicons name="time-outline" size={12} color={days <= 3 ? Colors.error : Colors.outline} />
                        <Text style={[styles.expiryDaysText, { color: days <= 3 ? Colors.error : Colors.outline }]}>
                          {days} days
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Today's Tasks */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/tasks' as any)}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <Card>
            {[
              { label: 'Check dairy section',    done: true,  priority: 'critical' },
              { label: 'Update produce labels',  done: true,  priority: 'high'     },
              { label: 'Clear bakery display',   done: false, priority: 'medium'   },
              { label: 'Restock frozen aisle',   done: false, priority: 'low'      },
            ].map((task, i) => (
              <View key={i} style={[styles.taskRow, i > 0 && styles.taskBorder]}>
                <View style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
                  {task.done && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                <Text style={[styles.taskLabel, task.done && styles.taskDone]}>{task.label}</Text>
                <StatusBadge level={task.priority as any} size="sm" />
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.background },
  scroll:      { flex: 1 },
  header:      { padding: Spacing.xl, paddingBottom: Spacing.xxl, overflow: 'hidden' },
  circle1:     { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.05)', top: -80, right: -60 },
  circle2:     { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -60, left: -40 },
  headerTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting:    { ...Typography.body, color: 'rgba(255,255,255,0.7)' },
  name:        { ...Typography.h2, color: '#fff', marginTop: 2 },
  date:        { ...Typography.small, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  avatar:      { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  avatarText:  { ...Typography.bodyBold, color: '#fff' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notifBtn:    { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifDot:    { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.tertiaryContainer, borderWidth: 1.5, borderColor: Colors.onPrimaryContainer },
  heroStats:   { flexDirection: 'row', marginTop: Spacing.xl, gap: Spacing.base },
  heroStat:    { flex: 1, alignItems: 'center' },
  heroStatVal: { ...Typography.h2, color: '#fff' },
  heroStatLabel:{ ...Typography.caption, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 2 },
  content:     { padding: Spacing.base, paddingTop: 0, marginTop: -Spacing.lg },
  statsRow:    { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  statCard:    { flex: 1, backgroundColor: Colors.backgroundPure, borderRadius: Radius.xl, padding: Spacing.sm, alignItems: 'center', gap: Spacing.xs, borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.card },
  statIcon:    { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  statValue:   { ...Typography.h4, color: Colors.textHeading },
  statLabel:   { ...Typography.caption, color: Colors.outline, textAlign: 'center' },
  sectionHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { ...Typography.h4, color: Colors.textHeading, marginBottom: 0 },
  seeAll:      { ...Typography.small, color: Colors.primary, fontWeight: '600' },
  actionsRow:  { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  actionBtn:   { flex: 1, alignItems: 'center', gap: Spacing.xs },
  actionIcon:  { width: 56, height: 56, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...Typography.caption, color: Colors.textBody },
  hScroll:     { marginBottom: Spacing.xl, marginHorizontal: -Spacing.base },
  expiryCard:  { width: 150, backgroundColor: Colors.backgroundPure, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.card },
  expiryImg:   { width: '100%', height: 100 },
  expiryInfo:  { padding: Spacing.sm, gap: Spacing.xs },
  expiryTitle: { ...Typography.small, color: Colors.textHeading, fontWeight: '600' },
  expiryDays:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  expiryDaysText:{ ...Typography.caption },
  taskRow:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  taskBorder:  { borderTopWidth: 1, borderTopColor: Colors.borderSubtle },
  taskCheck:   { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.borderSubtle, alignItems: 'center', justifyContent: 'center' },
  taskCheckDone:{ backgroundColor: Colors.primary, borderColor: Colors.primary },
  taskLabel:   { ...Typography.body, color: Colors.textBody, flex: 1 },
  taskDone:    { textDecorationLine: 'line-through', color: Colors.outline },
  loadingRow:  { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  skeletonCard:{ width: 150, height: 180, borderRadius: Radius.xl, backgroundColor: Colors.surfaceContainer },
});
