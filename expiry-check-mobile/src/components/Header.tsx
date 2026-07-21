import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightBadge?: number;
}

export default function Header({ title, subtitle, showBack, rightIcon, onRightPress, rightBadge }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textHeading} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {rightIcon ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onRightPress}>
          <Ionicons name={rightIcon} size={22} color={Colors.textHeading} />
          {rightBadge != null && rightBadge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{rightBadge > 9 ? '9+' : rightBadge}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingHorizontal: Spacing.base,
    paddingVertical:   Spacing.md,
    backgroundColor:   Colors.backgroundPure,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  iconBtn:   { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  center:    { flex: 1, alignItems: 'center' },
  title:     { ...Typography.h4, color: Colors.textHeading },
  subtitle:  { ...Typography.caption, color: Colors.outline, marginTop: 1 },
  badge:     { position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
});
