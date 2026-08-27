import React, { useState } from 'react';
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
    scopeText: 'Create a Deepsta profile using Google credentials',
  },
  Apple: {
    name: 'Apple ID',
    icon: 'logo-apple',
    color: '#FFFFFF',
    accountName: 'Alex Morgan',
    accountEmail: 'a.morgan@privaterelay.appleid.com',
    scopeText: 'Create a Deepsta profile with Apple Hide My Email',
  },
  Instagram: {
    name: 'Meta / Instagram',
    icon: 'logo-instagram',
    color: '#E1306C',
    accountName: '@alex_deepsta',
    accountEmail: 'alex.morgan@meta.com',
    scopeText: 'Sync Instagram posts, avatar, and social connections',
  },
};

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Field validation errors
  const [fullNameError, setFullNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Social Auth Modal State
  const [activeSocialProvider, setActiveSocialProvider] = useState<SocialProvider | null>(null);
  const [isSocialAuthenticating, setIsSocialAuthenticating] = useState(false);
  const [socialAuthSuccess, setSocialAuthSuccess] = useState(false);

  // Live Password Security Evaluation
  const passwordSecurity = SecurityUtils.calculatePasswordSecurity(password);
  const usernameValidation = SecurityUtils.validateUsername(username);

  const handleRegister = async () => {
    // Reset all errors
    setFullNameError('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setTermsError('');

    let hasErrors = false;

    // 1. Full Name
    const nameVal = SecurityUtils.validateFullName(fullName);
    if (!nameVal.isValid) {
      setFullNameError(nameVal.error || 'Invalid full name.');
      hasErrors = true;
    }

    // 2. Username
    if (!usernameValidation.isValid) {
      setUsernameError(usernameValidation.error || 'Invalid username.');
      hasErrors = true;
    }

    // 3. Email
    const emailVal = SecurityUtils.validateEmail(email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error || 'Invalid email address.');
      hasErrors = true;
    }

    // 4. Password Security
    if (!passwordSecurity.isValid) {
      setPasswordError(passwordSecurity.error || 'Password does not meet security requirements.');
      hasErrors = true;
    }

    // 5. Terms Agreement
    if (!agreeTerms) {
      setTermsError('You must agree to the Terms of Service & Privacy Policy.');
      hasErrors = true;
    }

    if (hasErrors) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setIsLoading(true);
    try {
      const res = await authApiService.register({
        email: emailVal.sanitizedValue || email,
        username: username.toLowerCase().trim(),
        name: nameVal.sanitizedValue || fullName,
        password,
      });

      setIsLoading(false);

      if (res.success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/(tabs)');
      } else {
        const errorMsg = res.error?.message || 'Registration failed. Username or email may already exist.';
        if (errorMsg.toLowerCase().includes('email')) {
          setEmailError(errorMsg);
        } else if (errorMsg.toLowerCase().includes('username')) {
          setUsernameError(errorMsg);
        } else {
          setPasswordError(errorMsg);
        }
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setPasswordError(err.message || 'Registration failed.');
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

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Header Navigation */}
          <View style={styles.topNav}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Join Deepsta</Text>
            <Text style={styles.cardSubtitle}>
              Create your profile to start sharing, discovering, and connecting.
            </Text>

            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  fullNameError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={fullNameError ? BrandColors.danger : BrandColors.glowMagenta}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Alex Morgan"
                  placeholderTextColor={BrandColors.textMuted}
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (fullNameError) setFullNameError('');
                  }}
                />
              </View>
              {fullNameError ? <Text style={styles.fieldErrorText}>{fullNameError}</Text> : null}
            </View>

            {/* Username */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username</Text>
              <View
                style={[
                  styles.inputContainer,
                  usernameError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="at-outline"
                  size={20}
                  color={usernameError ? BrandColors.danger : BrandColors.glowMagenta}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="unique_handle"
                  placeholderTextColor={BrandColors.textMuted}
                  value={username}
                  onChangeText={(val) => {
                    setUsername(val.toLowerCase().replace(/\s+/g, ''));
                    if (usernameError) setUsernameError('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {username.length > 0 && (
                  <View
                    style={[
                      styles.availabilityBadge,
                      {
                        backgroundColor: usernameValidation.isValid
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(244, 63, 94, 0.15)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={usernameValidation.isValid ? 'checkmark-circle' : 'alert-circle'}
                      size={14}
                      color={usernameValidation.isValid ? BrandColors.success : BrandColors.danger}
                    />
                    <Text
                      style={[
                        styles.availabilityText,
                        {
                          color: usernameValidation.isValid
                            ? BrandColors.success
                            : BrandColors.danger,
                        },
                      ]}
                    >
                      {usernameValidation.isValid ? 'Available' : 'Invalid'}
                    </Text>
                  </View>
                )}
              </View>
              {usernameError ? <Text style={styles.fieldErrorText}>{usernameError}</Text> : null}
            </View>

            {/* Email Address */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  emailError ? styles.inputContainerError : null,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={emailError ? BrandColors.danger : BrandColors.glowMagenta}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="alex@example.com"
                  placeholderTextColor={BrandColors.textMuted}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}
            </View>

            {/* Password */}
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
                  placeholder="At least 8 characters"
                  placeholderTextColor={BrandColors.textMuted}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (passwordError) setPasswordError('');
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

              {/* Password Security Meter & Checks */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarBg}>
                    <View
                      style={[
                        styles.strengthBarFill,
                        {
                          width: `${passwordSecurity.score}%`,
                          backgroundColor: passwordSecurity.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthText, { color: passwordSecurity.color }]}>
                    Security Rating: {passwordSecurity.label}
                  </Text>

                  {/* Security Requirements Checklist */}
                  <View style={styles.checkListRow}>
                    <View style={styles.checkItem}>
                      <Ionicons
                        name={passwordSecurity.checks.hasMinLength ? 'checkmark' : 'close'}
                        size={12}
                        color={passwordSecurity.checks.hasMinLength ? BrandColors.success : BrandColors.textMuted}
                      />
                      <Text style={styles.checkLabel}>8+ chars</Text>
                    </View>
                    <View style={styles.checkItem}>
                      <Ionicons
                        name={passwordSecurity.checks.hasNumber ? 'checkmark' : 'close'}
                        size={12}
                        color={passwordSecurity.checks.hasNumber ? BrandColors.success : BrandColors.textMuted}
                      />
                      <Text style={styles.checkLabel}>1+ number</Text>
                    </View>
                    <View style={styles.checkItem}>
                      <Ionicons
                        name={passwordSecurity.checks.hasUpper || passwordSecurity.checks.hasSpecial ? 'checkmark' : 'close'}
                        size={12}
                        color={passwordSecurity.checks.hasUpper || passwordSecurity.checks.hasSpecial ? BrandColors.success : BrandColors.textMuted}
                      />
                      <Text style={styles.checkLabel}>Symbol / Upper</Text>
                    </View>
                  </View>
                </View>
              )}
              {passwordError ? <Text style={styles.fieldErrorText}>{passwordError}</Text> : null}
            </View>

            {/* Checkbox Terms */}
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => {
                  setAgreeTerms(!agreeTerms);
                  if (termsError) setTermsError('');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                  {agreeTerms && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsHighlight}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {termsError ? <Text style={styles.fieldErrorText}>{termsError}</Text> : null}
            </View>

            {/* Register Submit Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
              style={styles.submitBtnWrapper}
            >
              <LinearGradient
                colors={BrandColors.primaryGradientHorizontal}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Create Account</Text>
                    <Ionicons name="sparkles-outline" size={20} color="#FFF" style={styles.btnArrow} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or register with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Registration */}
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

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.7}>
              <Text style={styles.loginLink}> Log In</Text>
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
                <Text style={styles.modalTitle}>Sign Up via {activeSocialProvider.name}</Text>
                <Text style={styles.modalSubtitle}>
                  Create your <Text style={{ color: '#FFF', fontWeight: '700' }}>Deepsta</Text> profile using {activeSocialProvider.name}
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
                      <Text style={styles.modalConfirmBtnText}> Creating Profile...</Text>
                    </View>
                  ) : socialAuthSuccess ? (
                    <View style={styles.loadingRow}>
                      <Ionicons name="checkmark-done" size={20} color="#FFF" />
                      <Text style={styles.modalConfirmBtnText}> Profile Created!</Text>
                    </View>
                  ) : (
                    <Text style={styles.modalConfirmBtnText}>
                      Sign Up as {activeSocialProvider.accountName.split(' ')[0]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bgDark,
  },
  glowTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    backgroundColor: 'rgba(138, 43, 226, 0.18)',
    transform: [{ scale: 1.2 }],
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: 'rgba(255, 59, 112, 0.14)',
    transform: [{ scale: 1.2 }],
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  topNav: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  navTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
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
  eyeBtn: {
    padding: 4,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  fieldErrorText: {
    color: BrandColors.danger,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  strengthContainer: {
    marginTop: 10,
  },
  strengthBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  checkListRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  checkLabel: {
    color: BrandColors.textMuted,
    fontSize: 10,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: BrandColors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: BrandColors.glowMagenta,
    borderColor: BrandColors.glowMagenta,
  },
  termsText: {
    flex: 1,
    color: BrandColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  termsHighlight: {
    color: BrandColors.glowMagenta,
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
    marginTop: 24,
  },
  footerText: {
    color: BrandColors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
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
});
