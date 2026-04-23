export default function Header({ user }) {
  return (
    <header
      style={{
        height: '60px',
        backgroundColor: '#FFFFFF',
        padding: '0 120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Cars24 Logo */}
      <img
        src={import.meta.env.BASE_URL + 'cars24-logo-dark.png'}
        alt="Cars24"
        style={{ height: '28px', objectFit: 'contain' }}
        crossOrigin="anonymous"
      />

      {/* Team name — no dropdown, no logout */}
      <span style={{ fontSize: '13px', fontWeight: '500', color: '#555' }}>
        {user?.name || 'Cars24 Team'}
      </span>
    </header>
  );
}
