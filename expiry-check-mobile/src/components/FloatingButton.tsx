import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  bottom?: number;
  right?: number;
}

export default function FloatingButton({ icon, onPress, bottom = 32, right = 24 }: Props) {
  const scale = useSharedValue(1);
  const anim  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.wrap, { bottom, right }, anim]}>
      <TouchableOpacity
        style={styles.btn}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.93, { damping: 12 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
        activeOpacity={1}
      >
        <Ionicons name={icon} size={26} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute' },
  btn:  {
    width: 56, height: 56, borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.fab,
  },
});
