import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing, Typography } from '../theme';
import StatusBadge from './StatusBadge';
import { getRiskColor } from '../utils/risk';
import type { Alert } from '../types';

interface Props { alert: Alert; }

export default function AlertCard({ alert }: Props) {
  const color = getRiskColor(alert.type);
  const iconMap = { critical: 'alert-circle', high: 'warning', medium: 'time', low: 'checkmark-circle' } as const;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Image source={{ uri: alert.thumbnail }} style={styles.thumb} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <StatusBadge level={alert.type} size="sm" />
          <Text style={styles.time}>{alert.timestamp}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{alert.productName}</Text>
        <View style={styles.msgRow}>
          <Ionicons name={iconMap[alert.type] as any} size={14} color={color} />
          <Text style={[styles.msg, { color }]}>{alert.message}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    backgroundColor: Colors.backgroundPure,
    borderRadius:    Radius.xl,
    borderWidth:     1,
    borderColor:     Colors.borderSubtle,
    borderLeftWidth: 4,
    padding:         Spacing.base,
    marginBottom:    Spacing.md,
    gap:             Spacing.md,
    alignItems:      'center',
    ...Shadows.card,
  },
  thumb:  { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.surfaceContainer },
  body:   { flex: 1, gap: Spacing.xs },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time:   { ...Typography.caption, color: Colors.outline },
  name:   { ...Typography.bodyBold, color: Colors.textHeading },
  msgRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  msg:    { ...Typography.small, flex: 1 },
});
