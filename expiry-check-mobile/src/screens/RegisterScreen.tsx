import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';
import Button from '../components/Button';
import { registerApi, ApiError } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [role, setRole]           = useState('Employee');
  
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errorMsg, setErrorMsg]   = useState<string | null>(null);

  const cardOpacity = useSharedValue(0);
  const cardY       = useSharedValue(40);

  React.useEffect(() => {
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    cardY.value       = withDelay(200, withSpring(0, { damping: 16 }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity:   cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));

  async function handleRegister() {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await registerApi({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (response && response.token && response.user) {
        await register(response.token, response.user);
      } else {
        setErrorMsg('Failed to process registration response.');
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errors) {
          const detailMsgs = Object.entries(err.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(' ')}`)
            .join('\n');
          setErrorMsg(detailMsgs || err.message);
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg(err.message || 'An unexpected network error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[Colors.onPrimaryContainer, '#005c3e']} style={styles.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoBox}>
            <Ionicons name="cube" size={32} color="#fff" />
          </View>
          <Text style={styles.appName}>Expiry Check</Text>
          <Text style={styles.tagline}>CREATE PORTAL ACCOUNT</Text>
        </View>

        {/* Card */}
        <Animated.View style={[styles.card, cardStyle]}>
          <Text style={styles.welcome}>Register</Text>
          <Text style={styles.prompt}>Sign up for a store employee profile</Text>

          {/* Error Banner */}
          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* First Name / Last Name Row */}
          <View style={styles.nameRow}>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="John"
                  placeholderTextColor={Colors.outline}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  placeholderTextColor={Colors.outline}
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@store.com"
                placeholderTextColor={Colors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min 8 characters"
                placeholderTextColor={Colors.outline}
                secureTextEntry={!showPw}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Role selection */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Select Role</Text>
            <View style={styles.rolePickerRow}>
              {['Employee', 'Manager', 'Admin'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleChip, role === r && styles.roleChipActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <Button label="Register" onPress={handleRegister} loading={loading} fullWidth style={{ marginTop: Spacing.xs }} />

          {/* Go to login */}
          <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginLinkWrap}>
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            Protected by enterprise-grade security.{' '}
            <Text style={styles.footerLink}>Contact IT Support</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg:         { ...StyleSheet.absoluteFillObject },
  circle1:    { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.04)', top: -80, right: -80 },
  circle2:    { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.04)', bottom: 100, left: -60 },
  scroll:     { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  logoArea:   { alignItems: 'center', marginBottom: Spacing.lg, gap: Spacing.sm },
  logoBox:    { width: 68, height: 68, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  appName:    { ...Typography.h2, color: '#fff' },
  tagline:    { ...Typography.label, color: 'rgba(255,255,255,0.55)', letterSpacing: 3 },
  card:       { backgroundColor: Colors.backgroundPure, borderRadius: Radius.xxl, padding: Spacing.xl, gap: Spacing.base, ...Shadows.modal },
  welcome:    { ...Typography.h3, color: Colors.textHeading },
  prompt:     { ...Typography.body, color: Colors.outline, marginTop: -Spacing.xs },
  errorBox:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.errorContainer, padding: Spacing.md, borderRadius: Radius.lg, gap: Spacing.sm },
  errorText:  { ...Typography.smallBold, color: Colors.error, flex: 1 },
  nameRow:    { flexDirection: 'row', gap: Spacing.sm },
  fieldWrap:  { gap: Spacing.xs },
  label:      { ...Typography.label, color: Colors.textBody, textTransform: 'uppercase' },
  inputRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceMuted, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderSubtle, paddingHorizontal: Spacing.md, gap: Spacing.sm },
  inputIcon:  {},
  input:      { flex: 1, ...Typography.body, color: Colors.textBody, paddingVertical: Spacing.md },
  rolePickerRow: { flexDirection: 'row', gap: Spacing.sm },
  roleChip:   { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.surfaceMuted },
  roleChipActive: { backgroundColor: 'rgba(0,108,73,0.08)', borderColor: Colors.primary },
  roleText:   { ...Typography.smallBold, color: Colors.textBody },
  roleTextActive: { color: Colors.primary },
  loginLinkWrap: { alignItems: 'center', paddingVertical: Spacing.xs },
  loginLinkText: { ...Typography.body, color: Colors.textBody },
  loginLinkTextBold: { color: Colors.secondary, fontWeight: '700' },
  footer:     { ...Typography.small, color: Colors.outline, textAlign: 'center', marginTop: Spacing.sm },
  footerLink: { color: Colors.secondary, fontWeight: '600' },
});
