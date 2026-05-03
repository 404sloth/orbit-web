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
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            style={{ 
              ...logoIconStyle, 
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, #1557b0 100%)',
              color: '#fff',
              boxShadow: '0 8px 25px rgba(26, 115, 232, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                x: [-30, 60],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ 
                position: 'absolute', 
                top: 0, left: 0, width: '20%', height: '100%', 
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'skewX(-20deg)'
              }}
            />
            <Sparkles size={28} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ ...titleStyle, letterSpacing: '-0.02em', fontWeight: 700 }}
          >
            Orbit <span style={{ fontWeight: 400, opacity: 0.6 }}>Executive</span>
          </motion.h1>
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
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center' }}>
              <strong>Demo Access:</strong> admin / admin123
            </p>
          </div>
        )}
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
  background: 'var(--bg-sidebar)',
  fontFamily: 'Inter, sans-serif',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 400,
  padding: '40px',
  background: 'var(--bg-main)',
  borderRadius: 8,
  boxShadow: '0 1px 3px 0 rgba(60,64,67,.30), 0 4px 8px 3px rgba(60,64,67,.15)',
  border: '1px solid var(--border-light)',
};

const logoSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 40,
};

const logoIconStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  background: 'var(--brand-light)',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 500,
  color: 'var(--text-primary)',
  marginBottom: 8,
  fontFamily: "'Google Sans', sans-serif"
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  fontWeight: 400,
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
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: 4,
};

const inputWrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  color: 'var(--text-tertiary)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px 12px 48px',
  background: 'var(--bg-main)',
  border: '1px solid var(--border-light)',
  borderRadius: 4,
  fontSize: 14,
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border 0.2s',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px',
  background: 'var(--brand-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  cursor: 'pointer',
  boxShadow: '0 1px 2px 0 rgba(60,64,67,.30)',
};

const errorStyle: React.CSSProperties = {
  color: 'var(--accent-red)',
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'center',
  background: 'var(--accent-red-light)',
  padding: '10px',
  borderRadius: 12,
};

const footerStyle: React.CSSProperties = {
  marginTop: 40,
  textAlign: 'center',
};

const dividerStyle: React.CSSProperties = {
  height: 1,
  background: 'var(--border-subtle)',
  marginBottom: 20,
};

const footerTextStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const passwordToggleStyle: React.CSSProperties = {
  position: 'absolute',
  right: 16,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
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
  background: 'var(--border-subtle)',
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
  color: 'var(--accent-red)',
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
  accentColor: 'var(--brand-primary)',
};

const checkboxTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-secondary)',
};

const successStyle: React.CSSProperties = {
  color: '#0f9d58',
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'center',
  background: 'var(--accent-green-light)',
  padding: '10px',
  borderRadius: 12,
};

const switchModeButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  background: 'transparent',
  color: 'var(--brand-primary)',
  border: '1px solid var(--border-light)',
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s',
  marginTop: 8,
};

const demoCredentialsStyle: React.CSSProperties = {
  marginTop: 20,
  padding: 12,
  background: 'var(--bg-sidebar)',
  borderRadius: 12,
  border: '1px solid var(--border-subtle)',
};
