import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Radius } from '../theme';
import { getRiskColor, getRiskBgColor, getRiskLabel } from '../utils/risk';
import type { RiskLevel } from '../types';

interface Props { level: RiskLevel; size?: 'sm' | 'md'; }

export default function StatusBadge({ level, size = 'md' }: Props) {
  const color = getRiskColor(level);
  const bg    = getRiskBgColor(level);
  const label = getRiskLabel(level);

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: color + '30' },
      size === 'sm' && styles.small]}>
      <Text style={[styles.text, { color },
        size === 'sm' && styles.textSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  text: {
    ...Typography.caption,
    textTransform: 'uppercase',
  },
  textSmall: {
    fontSize: 9,
  },
});
