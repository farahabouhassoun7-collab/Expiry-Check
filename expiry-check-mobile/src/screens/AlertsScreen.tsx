import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius } from '../theme';
import AlertCard from '../components/AlertCard';
import EmptyState from '../components/EmptyState';
import { getProducts, getMockExpiryDays, getRiskLevel } from '../services/api';
import type { Alert } from '../types';

const FILTERS = ['All', 'Critical', 'High', 'Medium'] as const;

export default function AlertsScreen() {
  const [alerts,  setAlerts]  = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadAlerts = useCallback(() => {
    return getProducts(30, 0).then(data => {
      const msgs: Record<string, string> = {
        critical: 'Expires in {{d}} days — immediate action required',
        high:     'Expires in {{d}} days — consider discounting',
        medium:   'Expires in {{d}} days — monitor closely',
        low:      'Expires in {{d}} days — stock looks healthy',
      };
      const now = new Date();
      const items: Alert[] = data.products.map(p => {
        const days = getMockExpiryDays(p.id);
        const risk = getRiskLevel(days);
        const ts   = new Date(now.getTime() - Math.random() * 3600000 * 6);
        return {
          id: String(p.id),
          productId: p.id,
          productName: p.title,
          thumbnail: p.thumbnail,
          type: risk,
          message: msgs[risk].replace('{{d}}', String(days)),
          daysRemaining: days,
          timestamp: ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
      }).sort((a, b) => a.daysRemaining - b.daysRemaining);
      setAlerts(items);
    }).finally(() => { setLoading(false); setRefreshing(false); });
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
          <TouchableOpacity key={f} style={[styles.chip, filter === f && styles.chipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.chipText, filter === f && styles.chipActive && { color: Colors.primary }]}>{f}</Text>
            {filter === f && <View style={styles.chipDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.pad}>{[1,2,3,4].map(i => <View key={i} style={styles.skeleton} />)}</View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={a => a.id}
          renderItem={({ item }) => <AlertCard alert={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={<EmptyState icon="checkmark-circle-outline" title="No alerts" subtitle="All products look healthy" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.background },
  header:       { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  title:        { ...Typography.h2, color: Colors.textHeading },
  subtitle:     { ...Typography.small, color: Colors.outline },
  chips:        { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.md },
  chip:         { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.backgroundPure, flexDirection: 'row', alignItems: 'center', gap: 4 },
  chipActive:   { borderColor: Colors.primary, backgroundColor: 'rgba(0,108,73,0.08)' },
  chipText:     { ...Typography.smallBold, color: Colors.textBody },
  chipDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  list:         { paddingHorizontal: Spacing.base, paddingBottom: 80 },
  pad:          { paddingHorizontal: Spacing.base, gap: Spacing.md },
  skeleton:     { height: 80, backgroundColor: Colors.surfaceContainer, borderRadius: Radius.xl, marginBottom: Spacing.md },
});
