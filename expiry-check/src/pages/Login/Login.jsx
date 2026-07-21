import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import { login } from '../../services/authService';

export default function Login() {
  const navigate  = useNavigate();
  const { t }     = useTranslation();
  const { isRTL } = useLanguage();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to server. Please check your connection.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in"
      style={{ background: 'var(--color-surface-muted)' }}
    >
      {/* Top-right controls */}
      <div
        className="fixed top-4 flex items-center gap-2"
        style={{ right: isRTL ? 'auto' : '1rem', left: isRTL ? '1rem' : 'auto' }}
      >
        <ThemeToggle compact />
        <LanguageSwitcher compact />
      </div>

      <main className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-primary)', boxShadow: '0 8px 24px rgba(0,108,73,0.25)' }}
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
            >
              inventory_2
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-heading)' }}>
            {t('login.title')}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: 'var(--color-outline)' }}>
            {t('login.subtitle')}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--color-background-pure)',
            border:     '1px solid var(--color-border-subtle)',
            boxShadow:  'var(--shadow-card-md)',
          }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-heading)' }}>
            {t('login.welcome')}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-outline)' }}>
            {t('login.sign_in_prompt')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off" noValidate>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-body)' }}>
                {t('login.email')}
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute top-1/2 -translate-y-1/2"
                  style={{
                    color:    'var(--color-outline)',
                    fontSize: '18px',
                    left:     isRTL ? 'auto' : '0.75rem',
                    right:    isRTL ? '0.75rem' : 'auto',
                  }}
                >
                  mail
                </span>
                <input
                  type="email"
                  name="expiry-check-email"
                  autoComplete="new-password"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.email_ph')}
                  required
                  className="w-full py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    paddingLeft:  isRTL ? '1rem' : '2.5rem',
                    paddingRight: isRTL ? '2.5rem' : '1rem',
                    background:   'var(--color-surface-muted)',
                    border:       '1px solid var(--color-border-subtle)',
                    color:        'var(--color-text-body)',
                    fontFamily:   'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-secondary)';
                    e.target.style.boxShadow   = '0 0 0 3px rgba(0,88,190,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border-subtle)';
                    e.target.style.boxShadow   = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-body)' }}>
                  {t('login.password')}
                </label>
                <button type="button" className="text-xs font-semibold" style={{ color: 'var(--color-secondary)' }}>
                  {t('login.forgot')}
                </button>
              </div>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute top-1/2 -translate-y-1/2"
                  style={{
                    color:    'var(--color-outline)',
                    fontSize: '18px',
                    left:     isRTL ? 'auto' : '0.75rem',
                    right:    isRTL ? '0.75rem' : 'auto',
                  }}
                >
                  lock
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="expiry-check-password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.password_ph')}
                  required
                  className="w-full py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    paddingLeft:  isRTL ? '2.5rem' : '2.5rem',
                    paddingRight: isRTL ? '2.5rem' : '2.5rem',
                    background:   'var(--color-surface-muted)',
                    border:       '1px solid var(--color-border-subtle)',
                    color:        'var(--color-text-body)',
                    fontFamily:   'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-secondary)';
                    e.target.style.boxShadow   = '0 0 0 3px rgba(0,88,190,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border-subtle)';
                    e.target.style.boxShadow   = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    color: 'var(--color-outline)',
                    left:  isRTL ? '0.75rem' : 'auto',
                    right: isRTL ? 'auto'    : '0.75rem',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {showPw ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: 'var(--color-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-body)' }}>
                {t('login.keep_signed_in')}
              </span>
            </label>

            {/* Error message */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm animate-fade-in"
                style={{
                  background:  'var(--color-error-container)',
                  color:       'var(--color-on-error-container)',
                  border:      '1px solid var(--color-error)',
                }}
              >
                <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: '18px' }}>
                  error
                </span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                background: 'var(--color-primary)',
                color:      'var(--color-on-primary)',
                boxShadow:  '0 4px 12px rgba(0,108,73,0.25)',
                opacity:    loading ? 0.75 : 1,
                cursor:     loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = '1'; }}
            >
              {loading && (
                <span
                  className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  style={{ display: 'inline-block' }}
                />
              )}
              {loading ? t('common.loading') : t('login.sign_in')}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <span className="text-sm" style={{ color: 'var(--color-outline)' }}>
              {t('login.no_account')}{' '}
            </span>
            <Link
              to="/register"
              className="text-sm font-semibold hover:underline"
              style={{ color: 'var(--color-secondary)' }}
            >
              {t('login.register')}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--color-outline)' }}>
          {t('login.security_note')}{' '}
          <span className="font-semibold cursor-pointer hover:underline" style={{ color: 'var(--color-secondary)' }}>
            {t('login.contact_it')}
          </span>
        </p>
      </main>
    </div>
  );
}
