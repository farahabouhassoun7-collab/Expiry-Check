import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Radius } from '../theme';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { ListSkeleton } from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import FloatingButton from '../components/FloatingButton';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';
import { getMockExpiryDays, getRiskLevel } from '../services/api';
import type { RiskLevel } from '../types';

const RISK_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'] as const;

export default function InventoryScreen() {
  const router = useRouter();
  const { products, total, loading, error, search: doSearch, loadMore, retry } = useProducts(20);
  const [query,      setQuery]      = useState('');
  const [filter,     setFilter]     = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => doSearch(q), 400);
  }, [doSearch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    doSearch(query);
    setTimeout(() => setRefreshing(false), 800);
  }, [doSearch, query]);

  // Client-side risk filter
  const filtered = filter === 'All' ? products : products.filter(p => {
    const days = getMockExpiryDays(p.id);
    const risk = getRiskLevel(days) as string;
    return risk === filter.toLowerCase();
  });

  const criticalCount = products.filter(p => getRiskLevel(getMockExpiryDays(p.id)) === 'critical').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>{loading ? 'Loading...' : `${total.toLocaleString()} products`}</Text>
        </View>
        <View style={styles.headerActions}>
          {criticalCount > 0 && (
            <View style={styles.criticalBadge}>
              <Ionicons name="alert-circle" size={14} color={Colors.error} />
              <Text style={styles.criticalText}>{criticalCount} critical</Text>
            </View>
          )}
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/scanner' as any)}>
            <Ionicons name="scan-outline" size={22} color={Colors.textHeading} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={handleSearch} placeholder="Search by name, brand, category..." />
      </View>

      {/* Risk filter chips */}
      <View style={styles.chipsRow}>
        {RISK_FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color={Colors.error} />
          <Text style={styles.errorText}>Failed to load products</Text>
          <TouchableOpacity onPress={retry} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product List */}
      {loading && !refreshing ? (
        <View style={styles.listPad}><ListSkeleton count={4} /></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={p => String(p.id)}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
              <ProductCard
                product={item}
                onPress={(p: Product) => router.push(`/product/${p.id}` as any)}
              />
            </Animated.View>
          )}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title="No products found"
              subtitle={query ? `No results for "${query}"` : 'No products available'}
              actionLabel={query ? 'Clear Search' : undefined}
              onAction={query ? () => handleSearch('') : undefined}
            />
          }
          ListFooterComponent={
            filtered.length > 0 ? (
              <Text style={styles.footerText}>
                Showing {filtered.length} of {total} products
              </Text>
            ) : null
          }
        />
      )}

      <FloatingButton icon="scan-outline" onPress={() => router.push('/scanner' as any)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.background },
  header:         { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, paddingBottom: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title:          { ...Typography.h2, color: Colors.textHeading },
  subtitle:       { ...Typography.small, color: Colors.outline, marginTop: 2 },
  headerActions:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  criticalBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.errorContainer, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  criticalText:   { ...Typography.caption, color: Colors.error, fontWeight: '700' },
  iconBtn:        { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.backgroundPure, borderWidth: 1, borderColor: Colors.borderSubtle, alignItems: 'center', justifyContent: 'center' },
  searchWrap:     { paddingHorizontal: Spacing.base, marginBottom: Spacing.sm },
  chipsRow:       { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.md, flexWrap: 'wrap' },
  chip:           { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.backgroundPure },
  chipActive:     { borderColor: Colors.primary, backgroundColor: 'rgba(0,108,73,0.08)' },
  chipText:       { ...Typography.smallBold, color: Colors.textBody },
  chipTextActive: { color: Colors.primary },
  list:           { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  listPad:        { paddingHorizontal: Spacing.base },
  errorBanner:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginHorizontal: Spacing.base, marginBottom: Spacing.sm, padding: Spacing.md, backgroundColor: Colors.errorContainer, borderRadius: Radius.lg },
  errorText:      { ...Typography.small, color: Colors.onErrorContainer, flex: 1 },
  retryBtn:       { paddingHorizontal: Spacing.md, paddingVertical: 4, backgroundColor: Colors.error, borderRadius: Radius.md },
  retryText:      { ...Typography.caption, color: '#fff', fontWeight: '700' },
  footerText:     { ...Typography.caption, color: Colors.outline, textAlign: 'center', paddingVertical: Spacing.md },
});
