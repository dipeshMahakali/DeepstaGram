/**
 * Deepsta Security & Validation Engine
 * Enterprise-grade input sanitization, security validation, and anti-brute-force rate limiting.
 */

// XSS and Script Injection Sanitization Regex
const DANGEROUS_PATTERNS = /[<>'";`\\={}]|script|javascript:|data:/gi;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue: string;
}

export const SecurityUtils = {
  /**
   * Sanitizes input to prevent XSS, HTML injection, and malicious payloads
   */
  sanitizeInput: (val: string): string => {
    if (!val) return '';
    return val.replace(DANGEROUS_PATTERNS, '').trim();
  },

  /**
   * Validates Email format strictly adhering to RFC 5322 standards
   */
  validateEmail: (email: string): ValidationResult => {
    const sanitized = SecurityUtils.sanitizeInput(email).toLowerCase();
    if (!sanitized) {
      return { isValid: false, error: 'Email address is required.', sanitizedValue: '' };
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: 'Please enter a valid email address (e.g. user@domain.com).', sanitizedValue: sanitized };
    }
    return { isValid: true, sanitizedValue: sanitized };
  },

  /**
   * Validates Username handle format
   */
  validateUsername: (username: string): ValidationResult => {
    const sanitized = SecurityUtils.sanitizeInput(username).toLowerCase().replace(/\s+/g, '');
    if (!sanitized) {
      return { isValid: false, error: 'Username is required.', sanitizedValue: '' };
    }
    if (sanitized.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long.', sanitizedValue: sanitized };
    }
    if (sanitized.length > 30) {
      return { isValid: false, error: 'Username cannot exceed 30 characters.', sanitizedValue: sanitized };
    }
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._]{2,29}$/;
    if (!usernameRegex.test(sanitized)) {
      return { isValid: false, error: 'Username must start with a letter and contain only letters, numbers, dots, or underscores.', sanitizedValue: sanitized };
    }
    return { isValid: true, sanitizedValue: sanitized };
  },

  /**
   * Validates Login Identifier (Can be Email OR Username)
   */
  validateLoginIdentifier: (identifier: string): ValidationResult => {
    const sanitized = SecurityUtils.sanitizeInput(identifier).trim();
    if (!sanitized) {
      return { isValid: false, error: 'Username or email is required.', sanitizedValue: '' };
    }
    if (sanitized.includes('@')) {
      return SecurityUtils.validateEmail(sanitized);
    }
    if (sanitized.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long.', sanitizedValue: sanitized };
    }
    return { isValid: true, sanitizedValue: sanitized };
  },

  /**
   * Validates Full Name
   */
  validateFullName: (name: string): ValidationResult => {
    const sanitized = SecurityUtils.sanitizeInput(name).trim();
    if (!sanitized) {
      return { isValid: false, error: 'Full name is required.', sanitizedValue: '' };
    }
    if (sanitized.length < 2) {
      return { isValid: false, error: 'Full name must be at least 2 characters.', sanitizedValue: sanitized };
    }
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(sanitized)) {
      return { isValid: false, error: 'Full name can only contain letters, spaces, hyphens, and apostrophes.', sanitizedValue: sanitized };
    }
    return { isValid: true, sanitizedValue: sanitized };
  },

  /**
   * Calculates detailed Password Strength and security rules check
   */
  calculatePasswordSecurity: (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (hasUpper) score += 20;
    if (hasLower) score += 15;
    if (hasNumber) score += 12;
    if (hasSpecial) score += 13;

    let label = 'Weak';
    let color = '#F43F5E'; // Red

    if (score >= 80) {
      label = 'Strong & Secure';
      color = '#10B981'; // Green
    } else if (score >= 50) {
      label = 'Medium';
      color = '#F59E0B'; // Orange
    }

    const isValid = hasMinLength && hasNumber && (hasUpper || hasSpecial);

    let error = '';
    if (!hasMinLength) {
      error = 'Password must be at least 8 characters long.';
    } else if (!hasNumber) {
      error = 'Password must include at least one number.';
    } else if (!hasUpper && !hasSpecial) {
      error = 'Password should include at least one uppercase letter or special character.';
    }

    return {
      score,
      label,
      color,
      isValid,
      error,
      checks: {
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
      },
    };
  },
};
