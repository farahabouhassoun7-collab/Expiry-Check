import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, Typography, Radius, Spacing } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export default function Button({ label, onPress, variant = 'primary', loading, disabled, style, fullWidth = false }: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handlePressIn()  { scale.value = withSpring(0.96, { damping: 15 }); }
  function handlePressOut() { scale.value = withSpring(1,    { damping: 15 }); }

  const bg = {
    primary:   Colors.primary,
    secondary: Colors.secondary,
    ghost:     'transparent',
    danger:    Colors.error,
  }[variant];

  const textColor = variant === 'ghost' ? Colors.primary : '#fff';
  const border    = variant === 'ghost' ? { borderWidth: 1, borderColor: Colors.primary } : {};

  return (
    <Animated.View style={[animStyle, fullWidth && { width: '100%' }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[styles.btn, { backgroundColor: bg }, border,
          (disabled || loading) && styles.disabled,
          fullWidth && styles.full, style]}
      >
        {loading
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        }
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn:      { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  label:    { ...Typography.bodyBold },
  disabled: { opacity: 0.5 },
  full:     { width: '100%' },
});
