import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';
import Button from '../components/Button';
import { loginApi, ApiError } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [remember, setRemember] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  async function handleLogin() {
    if (!email.trim() || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await loginApi({ email: email.trim(), password });
      if (response && response.token && response.user) {
        await login(response.token, response.user);
      } else {
        setErrorMsg('Failed to process login response.');
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
          <Text style={styles.tagline}>EMPLOYEE PORTAL</Text>
        </View>

        {/* Card */}
        <Animated.View style={[styles.card, cardStyle]}>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.prompt}>Sign in to your store account</Text>

          {/* Error Banner */}
          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

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
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity><Text style={styles.forgot}>Forgot?</Text></TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.outline}
                secureTextEntry={!showPw}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember me */}
          <TouchableOpacity style={styles.rememberRow} onPress={() => setRemember(!remember)}>
            <View style={[styles.checkbox, remember && styles.checkboxActive]}>
              {remember && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={styles.rememberText}>Keep me signed in</Text>
          </TouchableOpacity>

          {/* Submit */}
          <Button label="Sign In" onPress={handleLogin} loading={loading} fullWidth style={{ marginTop: Spacing.base }} />

          {/* Go to register */}
          <TouchableOpacity onPress={() => router.replace('/register' as any)} style={styles.registerLinkWrap}>
            <Text style={styles.registerLinkText}>
              Don't have an account? <Text style={styles.registerLinkTextBold}>Sign Up</Text>
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
  logoArea:   { alignItems: 'center', marginBottom: Spacing.xxl, gap: Spacing.sm },
  logoBox:    { width: 68, height: 68, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  appName:    { ...Typography.h2, color: '#fff' },
  tagline:    { ...Typography.label, color: 'rgba(255,255,255,0.55)', letterSpacing: 3 },
  card:       { backgroundColor: Colors.backgroundPure, borderRadius: Radius.xxl, padding: Spacing.xl, gap: Spacing.base, ...Shadows.modal },
  welcome:    { ...Typography.h3, color: Colors.textHeading },
  prompt:     { ...Typography.body, color: Colors.outline, marginTop: -Spacing.xs },
  errorBox:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.errorContainer, padding: Spacing.md, borderRadius: Radius.lg, gap: Spacing.sm },
  errorText:  { ...Typography.smallBold, color: Colors.error, flex: 1 },
  fieldWrap:  { gap: Spacing.xs },
  labelRow:   { flexDirection: 'row', justifyContent: 'space-between' },
  label:      { ...Typography.label, color: Colors.textBody, textTransform: 'uppercase' },
  forgot:     { ...Typography.small, color: Colors.secondary },
  inputRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceMuted, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderSubtle, paddingHorizontal: Spacing.md, gap: Spacing.sm },
  inputIcon:  {},
  input:      { flex: 1, ...Typography.body, color: Colors.textBody, paddingVertical: Spacing.md },
  rememberRow:{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  checkbox:   { width: 18, height: 18, borderRadius: 5, borderWidth: 2, borderColor: Colors.borderSubtle, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  rememberText: { ...Typography.body, color: Colors.textBody },
  registerLinkWrap: { alignItems: 'center', paddingVertical: Spacing.xs },
  registerLinkText: { ...Typography.body, color: Colors.textBody },
  registerLinkTextBold: { color: Colors.secondary, fontWeight: '700' },
  footer:     { ...Typography.small, color: Colors.outline, textAlign: 'center', marginTop: Spacing.sm },
  footerLink: { color: Colors.secondary, fontWeight: '600' },
});

