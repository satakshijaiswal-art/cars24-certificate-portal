import { useState } from 'react';

const base = import.meta.env.BASE_URL;

export default function LoginPage({ onLogin }) {
  const [showSSOPage, setShowSSOPage] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailLogin = (e) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    const namePart = email.split('@')[0].replace(/[._-]+/g, ' ');
    const name = namePart.replace(/\b\w/g, (c) => c.toUpperCase());
    onLogin({ email, name });
  };

  // Google SSO Page
  if (showSSOPage) {
    return (
      <div 
        style={{ 
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '450px',
            padding: '48px',
          }}
        >
          {/* Google Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <svg width="75" height="24" viewBox="0 0 75 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z" fill="#4285F4"/>
              <path d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z" fill="#EA4335"/>
              <path d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54 0 2.02-1.36 3.5-3.1 3.5z" fill="#4285F4"/>
              <path d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z" fill="#FBBC05"/>
              <path d="M58 .24h2.51v17.57H58z" fill="#34A853"/>
              <path d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z" fill="#EA4335"/>
            </svg>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '24px', fontWeight: '400', color: '#202124', textAlign: 'center', marginBottom: '8px' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '16px', color: '#5f6368', textAlign: 'center', marginBottom: '32px' }}>
            to continue to Certificate Platform
          </p>

          <form onSubmit={handleEmailLogin}>
            <input
              type="email"
              autoFocus
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
              placeholder="Email or phone"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: emailError ? '2px solid #d93025' : '1px solid #dadce0',
                borderRadius: '4px',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '8px',
              }}
            />
            {emailError && (
              <div style={{ color: '#d93025', fontSize: '12px', marginBottom: '8px' }}>{emailError}</div>
            )}
            <p style={{ fontSize: '14px', color: '#1a73e8', marginBottom: '40px', cursor: 'default' }}>
              Use your work or personal Gmail
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowSSOPage(false)}
                style={{
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#1a73e8',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  background: '#1a73e8',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        backgroundColor: '#1c1c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Background with 10% opacity */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${base}background.svg)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '800px',
          opacity: 0.05,
          filter: 'brightness(0) invert(1)',
          zIndex: 0,
        }}
      />
      <div 
        style={{
          backgroundColor: '#252525',
          borderRadius: '16px',
          padding: '48px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={`${base}cars24-logo.png`}
            alt="Cars24"
            style={{ height: '22px', filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* Title */}
        <h1 
          style={{ 
            color: '#FFFFFF', 
            fontSize: '24px', 
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          Certificate Platform
        </h1>

        {/* Google SSO Button - Only Login Option */}
        <button
          type="button"
          onClick={() => setShowSSOPage(true)}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: '#4736FE',
            border: 'none',
            borderRadius: '14px',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#3a2bd4';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#4736FE';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          Sign in with Google
        </button>

        {/* Google Sign-in Badge */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <svg width="16" height="16" viewBox="0 0 75 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z" fill="#4285F4"/>
            </svg>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Powered by Google</span>
          </div>
        </div>
      </div>
    </div>
  );
}
