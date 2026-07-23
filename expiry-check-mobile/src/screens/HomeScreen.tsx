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
import { getProducts, getExpiringBatches, getExpiredBatches, getLowStockBatches, getRiskLevel } from '../services/api';
import type { Product } from '../types';
import { AddProductModal } from '../components/AddProductModal';

const QUICK_ACTIONS = [
  { icon: 'add-circle-outline',   label: 'Add Product',color: Colors.primary,    action: 'add_product' },
  { icon: 'scan-outline',        label: 'Scan',       color: Colors.secondary,  route: '/scanner'     },
  { icon: 'alert-circle-outline',label: 'Alerts',     color: Colors.error,      route: '/alerts'      },
  { icon: 'cube-outline',        label: 'Inventory',  color: Colors.tertiary,   route: '/inventory'   },
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
  const [stats, setStats] = useState({
    totalProducts: 0,
    expiringCount: 0,
    expiredCount: 0,
    lowStockCount: 0,
  });
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addProductVisible, setAddProductVisible] = useState(false);

  const headerOpacity = useSharedValue(0);
  const headerY       = useSharedValue(-20);
  const headerStyle   = useAnimatedStyle(() => ({ opacity: headerOpacity.value, transform: [{ translateY: headerY.value }] }));

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, expiring, expired, lowStock] = await Promise.all([
        getProducts(10, 0).catch(() => ({ products: [], total: 0, skip: 0, limit: 10 })),
        getExpiringBatches(30).catch(() => []),
        getExpiredBatches().catch(() => []),
        getLowStockBatches().catch(() => []),
      ]);

      setStats({
        totalProducts: prodRes.total || prodRes.products.length,
        expiringCount: expiring.length,
        expiredCount: expired.length,
        lowStockCount: lowStock.length,
      });

      setExpiringSoon(prodRes.products.slice(0, 5));
    } catch (e) {
      console.error('Error loading home data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
                <Text style={styles.name}>Store Manager</Text>
                <Text style={styles.date}>{today}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications' as any)}>
                  <Ionicons name="notifications-outline" size={22} color="#fff" />
                  {stats.expiredCount > 0 && <View style={styles.notifDot} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile' as any)}>
                  <Text style={styles.avatarText}>SM</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Hero stats */}
            <View style={styles.heroStats}>
              {[
                { label: 'Expired Today', value: String(stats.expiredCount), urgent: stats.expiredCount > 0 },
                { label: 'Expiring Soon', value: String(stats.expiringCount), urgent: stats.expiringCount > 0 },
                { label: 'Low Stock', value: String(stats.lowStockCount), urgent: stats.lowStockCount > 0 },
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
              { label: 'Total Items',  value: String(stats.totalProducts), icon: 'cube',               color: Colors.primary,   delay: 100 },
              { label: 'Near Expiry', value: String(stats.expiringCount),  icon: 'time',               color: Colors.tertiary,  delay: 200 },
              { label: 'Expired',     value: String(stats.expiredCount),   icon: 'alert-circle',       color: Colors.error,     delay: 300 },
              { label: 'Low Stock',   value: String(stats.lowStockCount),  icon: 'trending-down',      color: Colors.secondary, delay: 400 },
            ].map((s) => <StatCard key={s.label} {...s} />)}
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {QUICK_ACTIONS.map((a) => (
              <Animated.View key={a.label} style={{ opacity: 1 }}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    if ((a as any).action === 'add_product') {
                      setAddProductVisible(true);
                    } else if ((a as any).route) {
                      router.push((a as any).route);
                    }
                  }}
                >
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
            <Text style={styles.sectionTitle}>Catalog Overview</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/inventory' as any)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {expiringSoon.map((p) => {
            const risk = getRiskLevel(p.stock || 10);
            return (
              <TouchableOpacity key={p.id} activeOpacity={0.8} onPress={() => router.push(`/product/${p.id}` as any)}>
                <Card style={styles.itemCard}>
                  <Image source={{ uri: p.thumbnail }} style={styles.itemThumb} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{p.title}</Text>
                    <Text style={styles.itemSub}>{p.category} • SKU: {p.sku}</Text>
                    <Text style={styles.itemDate}>Barcode: {p.barcode || 'N/A'}</Text>
                  </View>
                  <StatusBadge level={risk as any} />
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Product Modal */}
      <AddProductModal
        visible={addProductVisible}
        onClose={() => setAddProductVisible(false)}
        onSuccess={loadData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  header: { padding: Spacing.xl, paddingTop: Spacing.md, borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -40 },
  circle2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: -20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { ...Typography.body, color: 'rgba(255,255,255,0.7)' },
  name: { ...Typography.h2, color: '#fff' },
  date: { ...Typography.label, color: Colors.primaryFixedDim, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  notifBtn: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error },
  avatar: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: Colors.secondaryContainer, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...Typography.label, color: '#fff' },
  heroStats: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: Radius.lg, padding: Spacing.md, marginTop: Spacing.lg },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatVal: { ...Typography.h1, color: '#fff' },
  heroStatLabel: { ...Typography.label, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
  statCard: { width: '47%', backgroundColor: Colors.backgroundPure, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.card },
  statIcon: { width: 36, height: 36, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  statValue: { ...Typography.h1, color: Colors.textHeading },
  statLabel: { ...Typography.label, color: Colors.textBody, marginTop: 2 },
  sectionTitle: { ...Typography.h2, color: Colors.textHeading, marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.md },
  seeAll: { ...Typography.label, color: Colors.primary },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  actionBtn: { alignItems: 'center', gap: Spacing.xs },
  actionIcon: { width: 56, height: 56, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { ...Typography.label, color: Colors.textBody },
  itemCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, marginBottom: Spacing.md, gap: Spacing.md },
  itemThumb: { width: 52, height: 52, borderRadius: Radius.md, backgroundColor: Colors.surfaceMuted },
  itemInfo: { flex: 1 },
  itemTitle: { ...Typography.bodyBold, color: Colors.textHeading },
  itemSub: { ...Typography.body, color: Colors.textBody, marginTop: 2 },
  itemDate: { ...Typography.label, color: Colors.outline, marginTop: 2 },
});

