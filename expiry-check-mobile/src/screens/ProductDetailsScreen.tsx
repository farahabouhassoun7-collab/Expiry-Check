import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { getProductById, getMockExpiryDays, getRiskLevel, formatExpiryDate } from '../services/api';
import { getRiskColor } from '../utils/risk';
import type { Product } from '../types';

function SkeletonLine({ w = '100%' }: { w?: number | string }) {
  return (
    <View style={[styles.skeleton, { width: w as any }]} />
  );
}

export default function ProductDetailsScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const router    = useRouter();
  const [product,  setProduct]  = useState<Product | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);

  const contentOpacity = useSharedValue(0);
  const contentY       = useSharedValue(24);
  const contentStyle   = useAnimatedStyle(() => ({
    opacity:   contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const favScale = useSharedValue(1);
  const favStyle = useAnimatedStyle(() => ({ transform: [{ scale: favScale.value }] }));

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProductById(Number(id))
      .then(p => {
        setProduct(p);
        contentOpacity.value = withTiming(1, { duration: 400 });
        contentY.value       = withSpring(0, { damping: 16 });
      })
      .catch(e => setError(e.message ?? 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleFavorite() {
    favScale.value = withSpring(1.3, { damping: 8 }, () => { favScale.value = withSpring(1); });
    setFavorite(v => !v);
  }

  function handleShare() {
    if (!product) return;
    Share.share({ message: `${product.title} — $${product.price.toFixed(2)}\nSKU: ${product.sku}` });
  }

  function handleDiscount() {
    Alert.alert('AI Discount Applied', `25% discount applied to ${product?.title}`, [{ text: 'OK' }]);
  }

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.heroWrap}>
          <View style={[styles.hero, { backgroundColor: Colors.surfaceContainer }]} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ padding: Spacing.base, gap: Spacing.base }}>
          <SkeletonLine w="70%" />
          <SkeletonLine w="90%" />
          <SkeletonLine w="50%" />
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {[1,2,3,4].map(i => <View key={i} style={[styles.skeleton, { flex: 1, height: 80 }]} />)}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TouchableOpacity style={styles.backBtnDark} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textHeading} />
        </TouchableOpacity>
        <EmptyState
          icon="alert-circle-outline"
          title="Product not found"
          subtitle={error ?? 'This product could not be loaded'}
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const days   = getMockExpiryDays(product.id);
  const risk   = getRiskLevel(days);
  const expiry = formatExpiryDate(days);
  const riskColor = getRiskColor(risk);
  const stockPct  = Math.min(100, Math.round((product.stock / 150) * 100));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: product.thumbnail }} style={styles.hero} resizeMode="cover" />

          {/* Gradient overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent', 'rgba(0,0,0,0.2)']}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Right actions */}
          <View style={styles.heroRight}>
            <Animated.View style={favStyle}>
              <TouchableOpacity style={styles.heroBtn} onPress={toggleFavorite}>
                <Ionicons
                  name={favorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={favorite ? Colors.tertiaryContainer : '#fff'}
                />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity style={styles.heroBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Status badge */}
          <View style={styles.heroBadge}>
            <StatusBadge level={risk} />
          </View>
        </View>

        {/* Content */}
        <Animated.View style={[styles.content, contentStyle]}>

          {/* Title row */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.title}>{product.title}</Text>
              {product.brand && (
                <Text style={styles.brand}>by {product.brand}</Text>
              )}
            </View>
            <View style={styles.priceWrap}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {product.discountPercentage > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{Math.round(product.discountPercentage)}%</Text>
                </View>
              )}
            </View>
          </View>

          {/* Metrics grid */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View style={styles.metricsGrid}>
              {[
                { label: 'In Stock',   value: `${product.stock}`,  icon: 'cube-outline',     color: Colors.primary                              },
                { label: 'SKU',        value: product.sku,          icon: 'barcode-outline',  color: Colors.secondary                            },
                { label: 'Expires',    value: `${days}d`,           icon: 'time-outline',     color: days <= 3 ? Colors.error : riskColor        },
                { label: 'Rating',     value: `★ ${product.rating}`,icon: 'star-outline',     color: Colors.tertiary                             },
              ].map((m) => (
                <View key={m.label} style={styles.metricCard}>
                  <View style={[styles.metricIcon, { backgroundColor: m.color + '18' }]}>
                    <Ionicons name={m.icon as any} size={18} color={m.color} />
                  </View>
                  <Text style={[styles.metricVal, { color: m.color }]} numberOfLines={1}>{m.value}</Text>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Expiry alert banner for critical/high */}
          {(risk === 'critical' || risk === 'high') && (
            <Animated.View entering={FadeInDown.delay(150).springify()}>
              <View style={[styles.expiryBanner, { backgroundColor: riskColor + '15', borderColor: riskColor + '40' }]}>
                <Ionicons name="warning" size={18} color={riskColor} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.expiryBannerTitle, { color: riskColor }]}>
                    {risk === 'critical' ? 'Expires in ' + days + ' days — Immediate action required' : 'Expires ' + expiry}
                  </Text>
                  <Text style={styles.expiryBannerSub}>Apply discount or move to clearance</Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Stock bar */}
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.stockSection}>
            <View style={styles.stockRow}>
              <Text style={styles.sectionLabel}>STOCK LEVEL</Text>
              <Text style={[styles.stockPct, { color: riskColor }]}>{stockPct}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${stockPct}%` as any, backgroundColor: riskColor }]} />
            </View>
            <Text style={styles.stockNote}>{product.stock} units remaining · {expiry}</Text>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.section}>
            <Text style={styles.sectionLabel}>DESCRIPTION</Text>
            <Text style={styles.description}>{product.description}</Text>
          </Animated.View>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
              <Text style={styles.sectionLabel}>TAGS</Text>
              <View style={styles.tagsRow}>
                {product.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Image gallery */}
          {product.images?.length > 1 && (
            <Animated.View entering={FadeInDown.delay(320).springify()} style={styles.section}>
              <Text style={styles.sectionLabel}>PRODUCT IMAGES</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
                {product.images.map((img, i) => (
                  <Image key={i} source={{ uri: img }} style={styles.galleryImg} resizeMode="cover" />
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(360).springify()} style={styles.actions}>
            <Button label="🤖  Apply AI Discount" onPress={handleDiscount} variant="primary" fullWidth />
            <View style={styles.actionsRow}>
              <Button label="Reorder Now" onPress={() => Alert.alert('Reorder', 'Reorder placed!')} variant="ghost" style={{ flex: 1 }} />
              <Button label="Mark Waste"  onPress={() => Alert.alert('Marked', 'Item marked as waste')} variant="danger" style={{ flex: 1 }} />
            </View>
          </Animated.View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: Colors.background },
  heroWrap:          { position: 'relative', height: 300 },
  hero:              { width: '100%', height: '100%' },
  backBtn:           { position: 'absolute', top: Spacing.base, left: Spacing.base, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  backBtnDark:       { margin: Spacing.base, width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  heroRight:         { position: 'absolute', top: Spacing.base, right: Spacing.base, gap: Spacing.sm },
  heroBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  heroBadge:         { position: 'absolute', bottom: Spacing.base, left: Spacing.base },
  content:           { padding: Spacing.base, gap: Spacing.base, paddingBottom: Spacing.xxxl },
  titleRow:          { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  category:          { ...Typography.caption, color: Colors.outline, textTransform: 'uppercase', letterSpacing: 1 },
  title:             { ...Typography.h3, color: Colors.textHeading, marginTop: 4 },
  brand:             { ...Typography.small, color: Colors.outline, marginTop: 2 },
  priceWrap:         { alignItems: 'flex-end', gap: 4 },
  price:             { ...Typography.h2, color: Colors.primary },
  discountBadge:     { backgroundColor: Colors.tertiaryContainer + '30', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  discountText:      { ...Typography.caption, color: Colors.tertiary, fontWeight: '700' },
  metricsGrid:       { flexDirection: 'row', gap: Spacing.sm },
  metricCard:        { flex: 1, backgroundColor: Colors.backgroundPure, borderRadius: Radius.xl, padding: Spacing.sm, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.card },
  metricIcon:        { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  metricVal:         { ...Typography.smallBold, textAlign: 'center' },
  metricLabel:       { ...Typography.caption, color: Colors.outline },
  expiryBanner:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.base, borderRadius: Radius.xl, borderWidth: 1 },
  expiryBannerTitle: { ...Typography.smallBold },
  expiryBannerSub:   { ...Typography.caption, color: Colors.outline, marginTop: 2 },
  stockSection:      { backgroundColor: Colors.backgroundPure, borderRadius: Radius.xl, padding: Spacing.base, borderWidth: 1, borderColor: Colors.borderSubtle, gap: Spacing.sm },
  stockRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel:      { ...Typography.label, color: Colors.outline, textTransform: 'uppercase' },
  stockPct:          { ...Typography.bodyBold },
  barBg:             { height: 8, backgroundColor: Colors.surfaceContainer, borderRadius: Radius.full, overflow: 'hidden' },
  barFill:           { height: '100%', borderRadius: Radius.full },
  stockNote:         { ...Typography.caption, color: Colors.outline },
  section:           { gap: Spacing.sm },
  description:       { ...Typography.body, color: Colors.textBody, lineHeight: 22 },
  tagsRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag:               { paddingHorizontal: Spacing.md, paddingVertical: 4, backgroundColor: Colors.surfaceContainer, borderRadius: Radius.full },
  tagText:           { ...Typography.caption, color: Colors.textBody },
  galleryImg:        { width: 100, height: 100, borderRadius: Radius.lg, backgroundColor: Colors.surfaceContainer },
  actions:           { gap: Spacing.sm },
  actionsRow:        { flexDirection: 'row', gap: Spacing.sm },
  skeleton:          { height: 16, backgroundColor: Colors.surfaceContainer, borderRadius: Radius.md },
});
