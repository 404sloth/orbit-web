import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, User, Loader2, Sparkles, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string, refreshToken: string, user: { username: string; role: string; email?: string }) => void;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: '#dc3545'
  });

  // Password strength checker
  useEffect(() => {
    if (!isRegister || !password) {
      setPasswordStrength({ score: 0, feedback: [], color: '#dc3545' });
      return;
    }

    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('One uppercase letter');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('One lowercase letter');

    if (/\d/.test(password)) score++;
    else feedback.push('One number');

    if (['password', '123456', 'qwerty', 'admin', 'letmein'].includes(password.toLowerCase())) {
      score = 0;
      feedback.push('Password is too common');
    }

    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997'];
    setPasswordStrength({
      score,
      feedback,
      color: colors[Math.min(score, 3)]
    });
  }, [password, isRegister]);

  const validateForm = (): string | null => {
    if (!username.trim()) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';

    if (isRegister) {
      if (!email.trim()) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';

      if (passwordStrength.score < 3) return 'Password is too weak';
      if (password !== confirmPassword) return 'Passwords do not match';
    }

    if (!password) return 'Password is required';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const endpoint = isRegister ? 'http://localhost:8000/auth/register' : 'http://localhost:8000/auth/login';

      let response;
      if (isRegister) {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            password,
            email: email.trim(),
            role: 'USER'
          }),
        });

        if (response.ok) {
          setSuccess('Account created successfully! Please login.');
          setIsRegister(false);
          setPassword('');
          setConfirmPassword('');
          setEmail('');
          setLoading(false);
          return;
        }
      } else {
        const formData = new FormData();
        formData.append('username', username.trim());
        formData.append('password', password);

        response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Authentication failed');
      }

      const data = await response.json();

      if (!isRegister) {
        // Store tokens securely
        if (rememberMe) {
          localStorage.setItem('refreshToken', data.refresh_token);
        }

        // Fetch user profile
        const userResponse = await fetch('http://localhost:8000/auth/me', {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await userResponse.json();
        onLogin(data.access_token, data.refresh_token || '', userData);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setShowPassword(false);
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={cardStyle}
      >
        <div style={logoSectionStyle}>
          <div style={logoIconStyle}>
            <Shield size={32} color="#1a73e8" />
          </div>
          <h1 style={titleStyle}>
            {isRegister ? 'Create Account' : 'Executive Gateway'}
          </h1>
          <p style={subtitleStyle}>
            {isRegister
              ? 'Join the secure AI orchestration platform'
              : 'AI-First Strategic Orchestration Panel'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <div style={inputWrapperStyle}>
              <User size={18} style={iconStyle} />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {isRegister && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <div style={inputWrapperStyle}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
          )}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={inputWrapperStyle}>
              <Lock size={18} style={iconStyle} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isRegister && password && (
              <div style={passwordStrengthStyle}>
                <div style={{
                  ...passwordStrengthBarStyle,
                  backgroundColor: passwordStrength.color,
                  width: `${(passwordStrength.score / 5) * 100}%`
                }} />
                <div style={passwordFeedbackStyle}>
                  {passwordStrength.feedback.map((item, index) => (
                    <span key={index} style={passwordFeedbackItemStyle}>
                      <XCircle size={12} style={{ marginRight: 4 }} />
                      {item}
                    </span>
                  ))}
                  {passwordStrength.score >= 3 && (
                    <span style={{ ...passwordFeedbackItemStyle, color: '#28a745' }}>
                      <CheckCircle size={12} style={{ marginRight: 4 }} />
                      Strong password
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {isRegister && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={inputWrapperStyle}>
                <Lock size={18} style={iconStyle} />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {!isRegister && (
            <div style={checkboxGroupStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={checkboxStyle}
                />
                <span style={checkboxTextStyle}>Remember me</span>
              </label>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={errorStyle}
              >
                <AlertTriangle size={16} style={{ marginRight: 8 }} />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={successStyle}
              >
                <CheckCircle size={16} style={{ marginRight: 8 }} />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || (isRegister && passwordStrength.score < 3)}
            style={{
              ...buttonStyle,
              opacity: loading || (isRegister && passwordStrength.score < 3) ? 0.6 : 1,
              cursor: loading || (isRegister && passwordStrength.score < 3) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={20} />
                {isRegister ? 'Creating Account...' : 'Authenticating...'}
              </>
            ) : (
              <>
                <Sparkles size={20} />
                {isRegister ? 'Create Account' : 'Secure Access'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            style={switchModeButtonStyle}
          >
            {isRegister
              ? 'Already have an account? Sign in'
              : 'New to the platform? Create account'
            }
          </button>
        </form>

        {!isRegister && (
          <div style={demoCredentialsStyle}>
            <p style={{ margin: 0, fontSize: 11, color: '#5f6368', textAlign: 'center' }}>
              <strong>Demo Access:</strong> admin / admin123
            </p>
          </div>
        )}

        <div style={footerStyle}>
          <div style={dividerStyle} />
          <p style={footerTextStyle}>Secured by H-CoPilot RSA-256 Engine</p>
        </div>
      </motion.div>
    </div>
  );
};

// Styles

const containerStyle: React.CSSProperties = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8f9fa',
  fontFamily: 'Inter, sans-serif',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 420,
  padding: '48px 40px',
  background: '#ffffff',
  borderRadius: 32,
  boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
  border: '1px solid #f1f3f4',
};

const logoSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 40,
};

const logoIconStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  background: '#e8f0fe',
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: '#202124',
  letterSpacing: '-0.03em',
  marginBottom: 8,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#5f6368',
  fontWeight: 500,
};

const formStyle: React.CSSProperties = {
  display: 'grid',
  gap: 24,
};

const inputGroupStyle: React.CSSProperties = {
  display: 'grid',
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: '#3c4043',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const inputWrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  color: '#9aa0a6',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px 14px 48px',
  background: '#f8f9fa',
  border: '1px solid #f1f3f4',
  borderRadius: 16,
  fontSize: 15,
  color: '#202124',
  outline: 'none',
  transition: 'border 0.2s',
};

const buttonStyle: React.CSSProperties = {
  padding: '16px',
  background: '#1a73e8',
  color: '#ffffff',
  border: 'none',
  borderRadius: 16,
  fontSize: 15,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  cursor: 'pointer',
  boxShadow: '0 8px 16px rgba(26,115,232,0.2)',
};

const errorStyle: React.CSSProperties = {
  color: '#d93025',
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'center',
  background: '#fce8e6',
  padding: '10px',
  borderRadius: 12,
};

const footerStyle: React.CSSProperties = {
  marginTop: 40,
  textAlign: 'center',
};

const dividerStyle: React.CSSProperties = {
  height: 1,
  background: '#f1f3f4',
  marginBottom: 20,
};

const footerTextStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#bdc1c6',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const passwordToggleStyle: React.CSSProperties = {
  position: 'absolute',
  right: 16,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#5f6368',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
};

const passwordStrengthStyle: React.CSSProperties = {
  marginTop: 12,
};

const passwordStrengthBarStyle: React.CSSProperties = {
  height: 6,
  background: '#f1f3f4',
  borderRadius: 3,
  marginBottom: 8,
  transition: 'all 0.3s ease',
};

const passwordFeedbackStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 12,
};

const passwordFeedbackItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  color: '#d93025',
};

const checkboxGroupStyle: React.CSSProperties = {
  marginTop: 4,
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  userSelect: 'none',
};

const checkboxStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  cursor: 'pointer',
  accentColor: '#1a73e8',
};

const checkboxTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#5f6368',
};

const successStyle: React.CSSProperties = {
  color: '#0f9d58',
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'center',
  background: '#e6f4ea',
  padding: '10px',
  borderRadius: 12,
};

const switchModeButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: 'transparent',
  color: '#1a73e8',
  border: '1px solid #d3d3d3',
  borderRadius: 16,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
  marginTop: 12,
};

const demoCredentialsStyle: React.CSSProperties = {
  marginTop: 20,
  padding: 12,
  background: '#f8f9fa',
  borderRadius: 12,
  border: '1px solid #f1f3f4',
};
