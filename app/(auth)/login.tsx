import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '@/constants/theme';
import { SecurityUtils } from '@/utils/validation';
import { authApiService } from '@/src/services/auth.service';

const { width } = Dimensions.get('window');

interface SocialProvider {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  accountName: string;
  accountEmail: string;
  scopeText: string;
}

const PROVIDER_DATA: Record<string, SocialProvider> = {
  Google: {
    name: 'Google',
    icon: 'logo-google',
    color: '#EA4335',
    accountName: 'Alex Morgan',
    accountEmail: 'alex.morgan@gmail.com',
    scopeText: 'Share name, email address, and profile picture with Deepsta',
  },
  Apple: {
    name: 'Apple ID',
    icon: 'logo-apple',
    color: '#FFFFFF',
    accountName: 'Alex Morgan',
    accountEmail: 'a.morgan@privaterelay.appleid.com',
    scopeText: 'Hide My Email enabled. Secure authentication with Apple ID',
  },
  Instagram: {
    name: 'Meta / Instagram',
    icon: 'logo-instagram',
    color: '#E1306C',
    accountName: '@alex_deepsta',
    accountEmail: 'alex.morgan@meta.com',
    scopeText: 'Import public profile info, bio, and connection preferences',
  },
};

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Field validation errors
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Anti-Brute Force Lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Social Auth Modal State
  const [activeSocialProvider, setActiveSocialProvider] = useState<SocialProvider | null>(null);
  const [isSocialAuthenticating, setIsSocialAuthenticating] = useState(false);
  const [socialAuthSuccess, setSocialAuthSuccess] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Lockout Countdown Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTimer]);

  const handleLogin = async () => {
    // Clear previous errors
    setIdentifierError('');
    setPasswordError('');
    setGeneralError('');

    // Check Lockout Status
    if (lockoutTimer > 0) {
      setGeneralError(`Security Lockout active. Please wait ${lockoutTimer}s before retrying.`);
      return;
    }

    // 1. Sanitize & Validate Identifier
    const sanitizedId = SecurityUtils.sanitizeInput(identifier);
    const idValidation = SecurityUtils.validateLoginIdentifier(sanitizedId);

    if (!idValidation.isValid) {
      setIdentifierError(idValidation.error || 'Invalid username or email.');
    }

    // 2. Validate Password
    const sanitizedPassword = password.trim();
    if (!sanitizedPassword) {
      setPasswordError('Password is required.');
    } else if (sanitizedPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
    }

    // Block submission if errors exist
    if (!idValidation.isValid || !sanitizedPassword || sanitizedPassword.length < 6) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);

    try {
      const res = await authApiService.login({
        identifier: sanitizedId,
        password: sanitizedPassword,
      });

      setIsLoading(false);

      if (res.success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/(tabs)');
      } else {
        const errorMsg = res.error?.message || 'Login failed. Please check your credentials.';
        setGeneralError(errorMsg);
        setFailedAttempts((prev) => {
          const newCount = prev + 1;
          if (newCount >= 5) setLockoutTimer(30);
          return newCount;
        });
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setGeneralError(err.message || 'An error occurred during authentication.');
    }
  };

  const handleOpenSocialModal = (providerKey: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    const provider = PROVIDER_DATA[providerKey];
    if (provider) {
      setActiveSocialProvider(provider);
      setIsSocialAuthenticating(false);
      setSocialAuthSuccess(false);
    }
  };

  const handleConfirmSocialAuth = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setIsSocialAuthenticating(true);

    setTimeout(() => {
      setIsSocialAuthenticating(false);
      setSocialAuthSuccess(true);

      setTimeout(() => {
        setActiveSocialProvider(null);
        router.replace('/(tabs)');
      }, 600);
    }, 1200);
  };

  const handleSendPasswordReset = () => {
    setResetEmailError('');
    const emailValidation = SecurityUtils.validateEmail(resetEmail);

    if (!emailValidation.isValid) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      setResetEmailError(emailValidation.error || 'Invalid email address.');
      return;
    }

    setIsSendingReset(true);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setTimeout(() => {
      setIsSendingReset(false);
      setResetSuccessMsg(`Password recovery instructions sent to ${emailValidation.sanitizedValue}`);
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccessMsg('');
        setResetEmail('');
        setResetEmailError('');
      }, 2500);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient Aura Glow */}
      <View style={styles.glowTopLeft} />
      <View style={styles.glowBottomRight} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Header Brand Section */}
          <View style={styles.brandHeader}>
            <View style={styles.logoGradientBorder}>
              <LinearGradient
                colors={BrandColors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradientInner}
              >
                <Ionicons name="sparkles" size={36} color="#FFF" />
              </LinearGradient>
            </View>

            <Text style={styles.appName}>DEEPSTA</Text>
            <Text style={styles.appTagline}>
              Dive into deeper connections & vibrant moments
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Log in to access your creative realm</Text>

            {generalError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="shield-outline" size={18} color={BrandColors.danger} />
                <Text style={styles.errorText}>{generalError}</Text>
              </View>
            ) : null}

            {/* Identifier Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username or Email</Text>
              <View
                style={[
                  styles.inputContainer,
                  identifierError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={identifierError ? BrandColors.danger : BrandColors.glowMagenta}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com or @username"
                  placeholderTextColor={BrandColors.textMuted}
                  value={identifier}
                  onChangeText={(val) => {
                    setIdentifier(val);
                    if (identifierError) setIdentifierError('');
                    if (generalError) setGeneralError('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setIdentifier('')}
                  style={[styles.clearBtn, { opacity: identifier.length > 0 ? 1 : 0 }]}
                  disabled={identifier.length === 0}
                >
                  <Ionicons name="close-circle" size={18} color={BrandColors.textMuted} />
                </TouchableOpacity>
              </View>
              {identifierError ? (
                <Text style={styles.fieldErrorText}>{identifierError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  passwordError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={passwordError ? BrandColors.danger : BrandColors.glowMagenta}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={BrandColors.textMuted}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (passwordError) setPasswordError('');
                    if (generalError) setGeneralError('');
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={BrandColors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.fieldErrorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Options Row */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowForgotModal(true);
                  setResetEmailError('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading || lockoutTimer > 0}
              activeOpacity={0.85}
              style={[
                styles.submitBtnWrapper,
                lockoutTimer > 0 && styles.disabledSubmitBtn,
              ]}
            >
              <LinearGradient
                colors={
                  lockoutTimer > 0
                    ? ['#334155', '#1E293B']
                    : BrandColors.primaryGradientHorizontal
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : lockoutTimer > 0 ? (
                  <Text style={styles.submitBtnText}>Locked ({lockoutTimer}s)</Text>
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Log In</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.btnArrow} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleOpenSocialModal('Google')}
                activeOpacity={0.75}
              >
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleOpenSocialModal('Apple')}
                activeOpacity={0.75}
              >
                <Ionicons name="logo-apple" size={22} color="#FFF" />
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleOpenSocialModal('Instagram')}
                activeOpacity={0.75}
              >
                <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                <Text style={styles.socialBtnText}>Meta</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Social Auth Interactive Modal */}
      <Modal
        visible={!!activeSocialProvider}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveSocialProvider(null)}
      >
        <View style={styles.modalOverlay}>
          {activeSocialProvider && (
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setActiveSocialProvider(null)}
              >
                <Ionicons name="close" size={22} color={BrandColors.textMuted} />
              </TouchableOpacity>

              <View style={styles.modalHeader}>
                <View style={[styles.modalProviderIconBg, { borderColor: activeSocialProvider.color }]}>
                  <Ionicons name={activeSocialProvider.icon} size={32} color={activeSocialProvider.color} />
                </View>
                <Text style={styles.modalTitle}>Continue with {activeSocialProvider.name}</Text>
                <Text style={styles.modalSubtitle}>
                  Choose an account to sign in to <Text style={{ color: '#FFF', fontWeight: '700' }}>Deepsta</Text>
                </Text>
              </View>

              {/* Account Selection Box */}
              <View style={styles.accountCard}>
                <View style={styles.accountAvatar}>
                  <Text style={styles.avatarInitial}>
                    {activeSocialProvider.accountName.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountName}>{activeSocialProvider.accountName}</Text>
                  <Text style={styles.accountEmail}>{activeSocialProvider.accountEmail}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={22} color={BrandColors.glowMagenta} />
              </View>

              <View style={styles.scopeBox}>
                <Ionicons name="shield-checkmark-outline" size={16} color={BrandColors.textSecondary} />
                <Text style={styles.scopeText}>{activeSocialProvider.scopeText}</Text>
              </View>

              {/* Confirmation Action */}
              <TouchableOpacity
                style={styles.modalConfirmBtnWrapper}
                onPress={handleConfirmSocialAuth}
                disabled={isSocialAuthenticating || socialAuthSuccess}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={BrandColors.primaryGradientHorizontal}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalConfirmBtn}
                >
                  {isSocialAuthenticating ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator color="#FFF" size="small" />
                      <Text style={styles.modalConfirmBtnText}> Authenticating...</Text>
                    </View>
                  ) : socialAuthSuccess ? (
                    <View style={styles.loadingRow}>
                      <Ionicons name="checkmark-done" size={20} color="#FFF" />
                      <Text style={styles.modalConfirmBtnText}> Connected!</Text>
                    </View>
                  ) : (
                    <Text style={styles.modalConfirmBtnText}>
                      Continue as {activeSocialProvider.accountName.split(' ')[0]}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActiveSocialProvider(null)}
                disabled={isSocialAuthenticating}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowForgotModal(false)}
            >
              <Ionicons name="close" size={22} color={BrandColors.textMuted} />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <View style={styles.resetIconBg}>
                <Ionicons name="key-outline" size={28} color={BrandColors.glowMagenta} />
              </View>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text style={styles.modalSubtitle}>
                Enter your registered email address to receive secure recovery steps.
              </Text>
            </View>

            {resetSuccessMsg ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle-outline" size={20} color={BrandColors.success} />
                <Text style={styles.successText}>{resetSuccessMsg}</Text>
              </View>
            ) : (
              <>
                <View style={styles.inputWrapper}>
                  <View
                    style={[
                      styles.inputContainer,
                      resetEmailError ? styles.inputContainerError : null,
                    ]}
                  >
                    <Ionicons name="mail-outline" size={20} color={BrandColors.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your registered email"
                      placeholderTextColor={BrandColors.textMuted}
                      value={resetEmail}
                      onChangeText={(val) => {
                        setResetEmail(val);
                        if (resetEmailError) setResetEmailError('');
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {resetEmailError ? (
                    <Text style={styles.fieldErrorText}>{resetEmailError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={styles.modalConfirmBtnWrapper}
                  onPress={handleSendPasswordReset}
                  disabled={isSendingReset}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={BrandColors.primaryGradientHorizontal}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalConfirmBtn}
                  >
                    {isSendingReset ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.modalConfirmBtnText}>Send Reset Link</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bgDark,
  },
  glowTopLeft: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: 'rgba(255, 59, 112, 0.18)',
    transform: [{ scale: 1.2 }],
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    transform: [{ scale: 1.2 }],
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoGradientBorder: {
    width: 80,
    height: 80,
    borderRadius: 24,
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: BrandColors.glowMagenta,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 14,
  },
  logoGradientInner: {
    flex: 1,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 4,
  },
  appTagline: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: BrandColors.bgCardDark,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  cardSubtitle: {
    fontSize: 13,
    color: BrandColors.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: BrandColors.danger,
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.bgInputDark,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 59, 112, 0.3)',
  },
  inputContainerError: {
    borderColor: BrandColors.danger,
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#FFF',
    fontSize: 15,
  },
  clearBtn: {
    padding: 4,
  },
  eyeBtn: {
    padding: 4,
  },
  fieldErrorText: {
    color: BrandColors.danger,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: BrandColors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: BrandColors.glowMagenta,
    borderColor: BrandColors.glowMagenta,
  },
  rememberMeText: {
    color: BrandColors.textSecondary,
    fontSize: 13,
  },
  forgotText: {
    color: BrandColors.glowMagenta,
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtnWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: BrandColors.glowMagenta,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  disabledSubmitBtn: {
    opacity: 0.65,
    shadowOpacity: 0,
  },
  submitBtn: {
    flexDirection: 'row',
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnArrow: {
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: BrandColors.textMuted,
    fontSize: 12,
    paddingHorizontal: 12,
    textTransform: 'lowercase',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  socialBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    color: BrandColors.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: BrandColors.glowMagenta,
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 13, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: BrandColors.bgCardDark,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: BrandColors.borderDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalProviderIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 12,
  },
  resetIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 59, 112, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  accountAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BrandColors.glowMagenta,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  accountName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  accountEmail: {
    color: BrandColors.textMuted,
    fontSize: 12,
  },
  scopeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  scopeText: {
    flex: 1,
    color: BrandColors.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  modalConfirmBtnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  modalConfirmBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalCancelBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    color: BrandColors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginVertical: 10,
    gap: 10,
  },
  successText: {
    flex: 1,
    color: BrandColors.success,
    fontSize: 13,
  },
});
