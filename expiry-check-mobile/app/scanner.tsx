import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Radius } from '../src/theme';

export default function ScannerScreen() {
  const router   = useRouter();
  const [manual, setManual] = useState('');

  const scanLine = useSharedValue(0);
  React.useEffect(() => {
    scanLine.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLine.value * 200 - 100 }],
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Barcode</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Scanner frame */}
      <View style={styles.scanArea}>
        <View style={styles.overlay} />
        <View style={styles.frame}>
          {/* Corner decorations */}
          {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => (
            <View key={i} style={[styles.corner, pos]} />
          ))}
          {/* Scan line */}
          <Animated.View style={[styles.scanLine, lineStyle]} />
        </View>
        <Text style={styles.hint}>Align barcode within the frame</Text>
      </View>

      {/* Manual input */}
      <View style={styles.manualWrap}>
        <Text style={styles.manualLabel}>Or enter barcode manually</Text>
        <View style={styles.manualRow}>
          <View style={styles.manualInput}>
            <Ionicons name="barcode-outline" size={18} color={Colors.outline} />
            <TextInput
              value={manual}
              onChangeText={setManual}
              placeholder="e.g. 6001234567890"
              placeholderTextColor={Colors.outline}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            style={[styles.searchBtn, !manual && styles.searchBtnDisabled]}
            onPress={() => manual && router.push(`/product/1` as any)}
            disabled={!manual}
          >
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#000' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.base },
  backBtn:         { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:     { ...Typography.h4, color: '#fff' },
  scanArea:        { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay:         { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  frame:           { width: 260, height: 200, borderRadius: Radius.lg, overflow: 'hidden', position: 'relative' },
  corner:          { position: 'absolute', width: 24, height: 24, borderColor: Colors.primary, borderWidth: 3 },
  scanLine:        { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: Colors.primaryContainer, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8, elevation: 8 },
  hint:            { ...Typography.body, color: 'rgba(255,255,255,0.6)', marginTop: Spacing.xl, zIndex: 1 },
  manualWrap:      { backgroundColor: Colors.backgroundPure, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl, padding: Spacing.xl, gap: Spacing.md },
  manualLabel:     { ...Typography.label, color: Colors.outline, textTransform: 'uppercase' },
  manualRow:       { flexDirection: 'row', gap: Spacing.sm },
  manualInput:     { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surfaceMuted, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderSubtle, paddingHorizontal: Spacing.md },
  input:           { flex: 1, ...Typography.body, color: Colors.textBody, paddingVertical: Spacing.md },
  searchBtn:       { width: 52, height: 52, borderRadius: Radius.lg, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  searchBtnDisabled:{ opacity: 0.4 },
});
