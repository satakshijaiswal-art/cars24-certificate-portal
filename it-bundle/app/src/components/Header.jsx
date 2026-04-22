import { useState } from 'react';
import { User, LogOut } from 'lucide-react';

export default function Header({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header 
      style={{ 
        height: '60px',
        backgroundColor: '#FFFFFF',
        padding: '24px 120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Cars24 Logo - Left Side */}
      <img 
        src="/cars24-logo.png" 
        alt="Cars24" 
        style={{ height: '20px' }}
      />

      {/* Profile Icon - Right Side */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="hover:opacity-80 transition-all"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title={user?.name || 'Profile'}
        >
          <User size={20} color="#333333" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div 
            style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              minWidth: '200px',
              overflow: 'hidden',
              zIndex: 101
            }}
          >
            {/* User Info */}
            <div 
              style={{
                padding: '16px',
                borderBottom: '1px solid #e0e0e0'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                {user?.email || ''}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                setShowDropdown(false);
                onLogout();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#ff4757',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
