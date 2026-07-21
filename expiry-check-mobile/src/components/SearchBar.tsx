import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../theme';

interface Props {
  placeholder?: string;
  onChangeText: (text: string) => void;
  value: string;
}

export default function SearchBar({ placeholder = 'Search...', onChangeText, value }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Ionicons name="search-outline" size={18} color={Colors.outline} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.outline}
        style={styles.input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color={Colors.outline} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: Colors.surfaceMuted,
    borderRadius:    Radius.xl,
    borderWidth:     1,
    borderColor:     Colors.borderSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm + 2,
    gap: Spacing.sm,
  },
  focused: { borderColor: Colors.primary },
  icon:    {},
  input:   { flex: 1, ...Typography.body, color: Colors.textBody, padding: 0 },
});
