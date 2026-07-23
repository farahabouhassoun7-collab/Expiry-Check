import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius } from '../theme';
import AlertCard from '../components/AlertCard';
import EmptyState from '../components/EmptyState';
import { getExpiringBatches, getExpiredBatches, getRiskLevel } from '../services/api';
import type { Alert } from '../types';

const FILTERS = ['All', 'Critical', 'High', 'Medium'] as const;

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const [expiring, expired] = await Promise.all([
        getExpiringBatches(30).catch(() => []),
        getExpiredBatches().catch(() => []),
      ]);

      const items: Alert[] = [];

      expired.forEach(b => {
        items.push({
          id: `exp-${b.id}`,
          productId: b.productId,
          productName: `${b.productName} (${b.batchNumber})`,
          thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          type: 'critical',
          message: `EXPIRED ${Math.abs(b.daysRemaining)} days ago — Action Required (${b.remainingQuantity} units remaining)`,
          daysRemaining: b.daysRemaining,
          timestamp: new Date(b.expiryDate).toLocaleDateString(),
        });
      });

      expiring.forEach(b => {
        const risk = getRiskLevel(b.daysRemaining);
        items.push({
          id: `batch-${b.id}`,
          productId: b.productId,
          productName: `${b.productName} (${b.batchNumber})`,
          thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          type: risk,
          message: `Expires in ${b.daysRemaining} days — ${b.remainingQuantity} units available in ${b.warehouseLocation || 'Stock'}`,
          daysRemaining: b.daysRemaining,
          timestamp: new Date(b.expiryDate).toLocaleDateString(),
        });
      });

      items.sort((a, b) => a.daysRemaining - b.daysRemaining);
      setAlerts(items);
    } catch (e) {
      console.error('Failed to load alerts:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); loadAlerts(); }, [loadAlerts]);
  useEffect(() => { loadAlerts(); }, [loadAlerts]);

  const filtered = filter === 'All' ? alerts : alerts.filter(a => a.type.toLowerCase() === filter.toLowerCase());

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts Center</Text>
        <Text style={styles.subtitle}>{filtered.length} active alerts</Text>
      </View>

      {/* Filter chips */}
      <View style={styles.chips}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AlertCard alert={item} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="checkmark-circle-outline"
              title="No alerts right now"
              subtitle="All products have healthy expiration dates"
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { ...Typography.h1, color: Colors.textHeading },
  subtitle: { ...Typography.body, color: Colors.textBody, marginTop: 2 },
  chips: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: Spacing.sm, marginBottom: Spacing.md },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { ...Typography.label, color: Colors.textBody },
  chipTextActive: { color: Colors.onPrimary },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
});
