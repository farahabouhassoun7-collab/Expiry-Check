import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import { register } from '../../services/authService';

export default function Register() {
  const navigate  = useNavigate();
  const { t }     = useTranslation();
  const { isRTL } = useLanguage();

  const [fullName,       setFullName]       = useState('');
  const [email,          setEmail]          = useState('');
  const [password,       setPassword]       = useState('');
  const [confirmPass,    setConfirmPass]    = useState('');
  const [showPw,         setShowPw]         = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPass) {
      setError(t('register.pass_mismatch'));
      return;
    }

    setLoading(true);
    try {
      const parts = fullName.trim().split(/\s+/);
      const firstName = parts[0] || '';
      const lastName  = parts.slice(1).join(' ') || '';
      await register({ firstName, lastName, email: email.trim(), password });
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
            {t('register.title')}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: 'var(--color-outline)' }}>
            {t('register.subtitle')}
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
            {t('register.welcome')}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-outline)' }}>
            {t('register.sign_up_prompt')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-body)' }}>
                {t('register.full_name')}
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
                  person
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('register.full_name_ph')}
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

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-body)' }}>
                {t('register.email')}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('register.email_ph')}
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
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-body)' }}>
                {t('register.password')}
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
                  lock
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('register.password_ph')}
                  required
                  minLength={8}
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

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-body)' }}>
                {t('register.confirm_password')}
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
                  lock
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder={t('register.confirm_password_ph')}
                  required
                  minLength={8}
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
              </div>
            </div>

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
              {loading ? t('common.loading') : t('register.sign_up')}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <span className="text-sm" style={{ color: 'var(--color-outline)' }}>
              {t('register.already_have_account')}{' '}
            </span>
            <Link
              to="/login"
              className="text-sm font-semibold hover:underline"
              style={{ color: 'var(--color-secondary)' }}
            >
              {t('register.sign_in')}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--color-outline)' }}>
          {t('register.security_note')}{' '}
          <span className="font-semibold cursor-pointer hover:underline" style={{ color: 'var(--color-secondary)' }}>
            {t('register.contact_it')}
          </span>
        </p>
      </main>
    </div>
  );
}
