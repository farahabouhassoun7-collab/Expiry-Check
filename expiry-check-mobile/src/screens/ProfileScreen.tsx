import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

function SettingRow({ icon, label, value, onPress, danger, toggle, toggleValue, onToggle }: any) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!!toggle}>
      <View style={[styles.settingIcon, { backgroundColor: (danger ? Colors.error : Colors.primary) + '18' }]}>
        <Ionicons name={icon} size={18} color={danger ? Colors.error : Colors.primary} />
      </View>
      <Text style={[styles.settingLabel, danger && { color: Colors.error }]}>{label}</Text>
      {toggle ? (
        <Switch value={toggleValue} onValueChange={onToggle} trackColor={{ true: Colors.primary }} thumbColor="#fff" />
      ) : value ? (
        <Text style={styles.settingValue}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={Colors.outline} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = React.useState(false);

  const rawUser = user as any;

  const fullName = rawUser
    ? (rawUser.name || `${rawUser.firstName || ''} ${rawUser.lastName || ''}`.trim() || rawUser.email || 'Store Staff')
    : 'Store Staff';

  const initials = rawUser
    ? (rawUser.firstName && rawUser.lastName
        ? `${rawUser.firstName[0] || ''}${rawUser.lastName[0] || ''}`.toUpperCase()
        : fullName.slice(0, 2).toUpperCase())
    : 'SS';

  const roleName = rawUser?.role || 'Inventory Associate';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.role}>{roleName}</Text>
          <View style={styles.storeBadge}>
            <Ionicons name="storefront-outline" size={12} color={Colors.primary} />
            <Text style={styles.storeName}>Green Basket — Main Store</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <Card style={styles.card}>
          <SettingRow icon="moon-outline"          label="Dark Mode"      toggle toggleValue={darkMode} onToggle={setDarkMode} />
          <View style={styles.divider} />
          <SettingRow icon="notifications-outline" label="Notifications"  onPress={() => router.push('/notifications' as any)} />
          <View style={styles.divider} />
          <SettingRow icon="language-outline"      label="Language"       value="English"   onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="checkbox-outline"      label="Today's Tasks"  onPress={() => router.push('/tasks' as any)} />
        </Card>

        {/* Account */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <Card style={styles.card}>
          <SettingRow icon="person-outline"             label="Edit Profile"   onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="shield-checkmark-outline"   label="Security"       onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="help-circle-outline"        label="Help & Support" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="information-circle-outline" label="About"          value="v1.0.0" onPress={() => {}} />
        </Card>

        {/* Logout */}
        <Text style={styles.sectionLabel}>SESSION</Text>
        <Card style={styles.card}>
          <SettingRow icon="log-out-outline" label="Sign Out" danger onPress={logout} />
        </Card>

        <Text style={styles.footer}>Expiry Check Mobile v1.0.0 · Intelligence Suite</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.background },
  scroll:         { flex: 1 },
  avatarSection:  { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  avatar:         { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadows.cardMd },
  avatarText:     { ...Typography.h2, color: '#fff' },
  name:           { ...Typography.h3, color: Colors.textHeading },
  role:           { ...Typography.body, color: Colors.outline },
  storeBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,108,73,0.08)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  storeName:      { ...Typography.small, color: Colors.primary, fontWeight: '600' },
  sectionLabel:   { ...Typography.label, color: Colors.outline, marginBottom: Spacing.sm, marginTop: Spacing.base },
  card:           { marginBottom: Spacing.sm, padding: 0, overflow: 'hidden' },
  settingRow:     { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md },
  settingIcon:    { width: 34, height: 34, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  settingLabel:   { ...Typography.body, color: Colors.textBody, flex: 1 },
  settingValue:   { ...Typography.small, color: Colors.outline },
  divider:        { height: 1, backgroundColor: Colors.borderSubtle, marginHorizontal: Spacing.base },
  footer:         { ...Typography.caption, color: Colors.outlineVariant, textAlign: 'center', marginTop: Spacing.xl, marginBottom: Spacing.base },
});
