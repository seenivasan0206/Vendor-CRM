/**
 * Zenve Zippy - Enterprise Authentication Service
 * Ready-to-connect API integration with Spring Boot backend (/api/auth/*)
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/auth';

const ROLE_AUTHORITY_MAP = {
  ADMIN: 'ROLE_ADMIN',
  PROCUREMENT_MANAGER: 'ROLE_MANAGER',
  PURCHASE_OFFICER: 'ROLE_STAFF',
};

const getHttpErrorMessage = (status, payload, fallbackMessage) => {
  if (payload?.message) return payload.message;
  if (status === 401) {
    return 'Invalid email or password. Please check your credentials.';
  }
  if (status === 403) {
    return 'Your account does not have permission to access this portal.';
  }
  if (status === 502 || status === 503 || status === 504) {
    return `Backend server is not running on port 8080 (HTTP ${status}). Please start the Vendor-backend Spring Boot API to authenticate.`;
  }
  return `${fallbackMessage} (HTTP ${status}).`;
};

export const authService = {
  /**
   * Authenticate user against Spring Boot backend POST /api/auth/login
   * @param {Object} params
   * @param {string} params.usernameOrEmail
   * @param {string} params.password
   * @param {string} params.selectedRole
   * @param {boolean} params.rememberMe
   */
  async login({ usernameOrEmail, password, selectedRole, rememberMe = false }) {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: usernameOrEmail.trim(),
          password,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: getHttpErrorMessage(response.status, payload, 'Authentication failed'),
        };
      }

      const loginData = payload?.data;
      if (!payload?.success || !loginData?.accessToken) {
        return {
          success: false,
          message: payload?.message || 'Unexpected response format from authentication server.',
        };
      }

      // Verify user authorities against selected role if roles are returned
      const expectedAuthority = ROLE_AUTHORITY_MAP[selectedRole];
      const userRoles = Array.isArray(loginData.roles) ? loginData.roles : [];
      if (expectedAuthority && userRoles.length > 0 && !userRoles.includes(expectedAuthority)) {
        return {
          success: false,
          message: `This account is not authorized for the ${selectedRole.replace('_', ' ')} role.`,
        };
      }

      const userProfile = {
        id: loginData.id,
        username: loginData.username,
        email: loginData.email,
        fullName: loginData.fullName,
        roles: userRoles,
        activeRole: selectedRole,
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('zenve_access_token', loginData.accessToken);
      storage.setItem('zenve_user', JSON.stringify(userProfile));

      if (rememberMe) {
        localStorage.setItem('zenve_remembered_email', usernameOrEmail.trim());
        localStorage.setItem('zenve_remembered_role', selectedRole);
      } else {
        localStorage.removeItem('zenve_remembered_email');
        localStorage.removeItem('zenve_remembered_role');
      }

      return {
        success: true,
        message: payload.message || 'Login successful',
        user: userProfile,
        accessToken: loginData.accessToken,
      };
    } catch (error) {
      return {
        success: false,
        isNetworkError: true,
        message:
          'Unable to reach the authentication server. Please verify the backend service is running and try again.',
        error,
      };
    }
  },

  /**
   * Ready-to-connect password recovery API request
   * @param {string} email
   */
  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const payload = await response.json().catch(() => null);
      if (response.ok) {
        return {
          success: true,
          message: payload?.message || 'Password recovery instructions sent to your email.',
        };
      }

      return {
        success: false,
        message: getHttpErrorMessage(response.status, payload, 'Unable to process reset request'),
      };
    } catch {
      return {
        success: false,
        isNetworkError: true,
        message: 'Unable to reach the password recovery service. Please try again when the backend is online.',
      };
    }
  },

  getRememberedCredentials() {
    return {
      email: localStorage.getItem('zenve_remembered_email') || '',
      role: localStorage.getItem('zenve_remembered_role') || 'ADMIN',
    };
  },

  getCurrentUser() {
    try {
      const raw =
        localStorage.getItem('zenve_user') ||
        sessionStorage.getItem('zenve_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('zenve_access_token');
    localStorage.removeItem('zenve_user');
    sessionStorage.removeItem('zenve_access_token');
    sessionStorage.removeItem('zenve_user');
  },

  getToken() {
    return (
      localStorage.getItem('zenve_access_token') ||
      sessionStorage.getItem('zenve_access_token')
    );
  },
};

