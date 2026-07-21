import React from 'react';
import { View, StyleSheet, Animated as RNAnimated } from 'react-native';
import { Colors, Radius, Spacing } from '../theme';

function SkeletonBox({ w, h, style }: { w?: number | string; h: number; style?: any }) {
  const anim = React.useRef(new RNAnimated.Value(0)).current;
  React.useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        RNAnimated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  return (
    <RNAnimated.View style={[{ width: w ?? '100%', height: h, borderRadius: Radius.md,
      backgroundColor: Colors.surfaceContainer, opacity }, style]} />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBox h={160} style={{ borderRadius: Radius.xl }} />
      <View style={{ padding: Spacing.base, gap: Spacing.sm }}>
        <SkeletonBox h={10} w="40%" />
        <SkeletonBox h={16} w="80%" />
        <SkeletonBox h={12} w="60%" />
        <SkeletonBox h={4}  />
      </View>
    </View>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
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
  },
});
