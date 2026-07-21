import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing, Typography } from '../theme';
import StatusBadge from './StatusBadge';
import { getMockExpiryDays, getRiskLevel, formatExpiryDate } from '../services/api';
import type { Product } from '../types';

interface Props {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const days  = getMockExpiryDays(product.id);
  const risk  = getRiskLevel(days);
  const expiry = formatExpiryDate(days);

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1,    { damping: 15 }); }}
        onPress={() => onPress(product)}
        style={styles.card}
      >
        {/* Image */}
        <View style={styles.imgWrap}>
          <Image source={{ uri: product.thumbnail }} style={styles.img} resizeMode="cover" />
          <View style={styles.badgeOverlay}>
            <StatusBadge level={risk} size="sm" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.category} numberOfLines={1}>{product.category}</Text>
          <Text style={styles.title} numberOfLines={2}>{product.title}</Text>

          <View style={styles.row}>
            <View style={styles.expiryWrap}>
              <Text style={styles.expiryLabel}>Expires</Text>
              <Text style={[styles.expiryVal, { color: days <= 7 ? Colors.error : Colors.textBody }]}>
                {days}d · {expiry}
              </Text>
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          {/* Stock bar */}
          <View style={styles.barBg}>
            <View style={[styles.barFill, {
              width: `${Math.min(100, (product.stock / 150) * 100)}%` as any,
              backgroundColor: days <= 3 ? Colors.error : days <= 14 ? Colors.tertiary : Colors.primary,
            }]} />
          </View>
          <Text style={styles.stockText}>{product.stock} units in stock</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundPure,
    borderRadius:    Radius.xl,
    borderWidth:     1,
    borderColor:     Colors.borderSubtle,
    marginBottom:    Spacing.md,
    overflow:        'hidden',
    ...Shadows.card,
  },
  imgWrap:     { width: '100%', height: 160, position: 'relative' },
  img:         { width: '100%', height: '100%' },
  badgeOverlay:{ position: 'absolute', top: 10, left: 10 },
  content:     { padding: Spacing.base, gap: Spacing.xs },
  category:    { ...Typography.caption, color: Colors.outline, textTransform: 'uppercase' },
  title:       { ...Typography.h4, color: Colors.textHeading },
  row:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 2 },
  expiryWrap:  {},
  expiryLabel: { ...Typography.caption, color: Colors.outline },
  expiryVal:   { ...Typography.smallBold },
  price:       { ...Typography.h4, color: Colors.primary },
  barBg:       { height: 4, backgroundColor: Colors.surfaceContainer, borderRadius: Radius.full, marginTop: 6 },
  barFill:     { height: '100%', borderRadius: Radius.full },
  stockText:   { ...Typography.caption, color: Colors.outline },
});
