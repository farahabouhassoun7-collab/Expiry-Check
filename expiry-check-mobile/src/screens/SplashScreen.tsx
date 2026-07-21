import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSpring, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../theme';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { token, loading } = useAuth();
  const [animDone, setAnimDone] = useState(false);

  const logoScale   = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY       = useSharedValue(30);
  const dotOpacity  = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity:   logoOpacity.value,
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity:   textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));
  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));

  useEffect(() => {
    logoScale.value   = withSpring(1, { damping: 12, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 600 });
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    textY.value       = withDelay(400, withSpring(0, { damping: 14 }));
    dotOpacity.value  = withDelay(800, withTiming(1, { duration: 400 }));

    const timer = setTimeout(() => {
      setAnimDone(true);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && animDone) {
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, animDone, token]);


  return (
    <LinearGradient
      colors={[Colors.onPrimaryContainer, '#006c49', '#004d33']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Background decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <View style={styles.logoBox}>
          <Ionicons name="cube" size={40} color="#fff" />
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textWrap, textStyle]}>
        <Text style={styles.appName}>Expiry Check</Text>
        <Text style={styles.tagline}>INTELLIGENCE SUITE</Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={[styles.dots, dotStyle]}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle1: {
    position: 'absolute', width: width * 1.2, height: width * 1.2,
    borderRadius: width * 0.6, backgroundColor: 'rgba(255,255,255,0.04)',
    top: -width * 0.3, right: -width * 0.2,
  },
  circle2: {
    position: 'absolute', width: width * 0.8, height: width * 0.8,
    borderRadius: width * 0.4, backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -width * 0.15, left: -width * 0.15,
  },
  logoWrap: { marginBottom: Spacing.xl },
  logoBox: {
    width: 88, height: 88, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  textWrap:   { alignItems: 'center', gap: Spacing.xs },
  appName:    { ...Typography.h1, color: '#fff', letterSpacing: 0.5 },
  tagline:    { ...Typography.label, color: 'rgba(255,255,255,0.6)', letterSpacing: 3 },
  dots:       { position: 'absolute', bottom: 80, flexDirection: 'row', gap: Spacing.sm },
  dot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive:  { backgroundColor: Colors.primaryFixedDim, width: 20, borderRadius: 3 },
});
