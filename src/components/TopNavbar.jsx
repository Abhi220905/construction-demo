import React from 'react';
import { FiMenu, FiRefreshCw, FiLogOut } from 'react-icons/fi';

const TopNavbar = ({ collapsed, onToggle }) => {
  const handleRefresh = () => {
    // Standard Satyamev refresh behavior: reload current page to sync with latest data
    window.location.reload();
  };

  return (
    <header style={styles.header}>
      {/* Left: toggle + branding */}
      <div style={styles.left}>
        <button style={styles.toggleBtn} onClick={onToggle} title="Toggle sidebar">
          <FiMenu size={18} />
        </button>
        <div style={styles.brand}>
          <div style={styles.brandLogo}>
            <img src="/logo.png" alt="AlgoVista Logo" style={styles.logoImg} />
            <div>
              <div style={styles.brandTitle}>AlgoVista Construction Group</div>
              <div style={styles.brandSub}>Executive Analytics Dashboard</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: status + actions */}
      <div style={styles.right}>
        <div style={styles.syncWrap}>
          <div style={styles.syncDot} />
          <span style={styles.syncText}>Connected</span>
        </div>

        <div style={styles.langGroup}>
          <button style={{ ...styles.langBtn, ...styles.langBtnActive }}>EN</button>
          <button style={styles.langBtn}>HI</button>
        </div>

        <button 
          style={styles.refreshBtn} 
          onClick={handleRefresh}
          title="Refresh Data"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>

        {/* User badge + logout */}
        <div style={styles.userBadge}>
          <div style={styles.avatar}>A</div>
          <button style={styles.logoutBtn} title="Sign out">
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height)',
    background: '#ffffff',
    borderBottom: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 1000,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    gap: '16px',
    transition: 'all 0.3s var(--ease-out-expo)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.15s',
    flexShrink: 0,
  },
  brand: {
    minWidth: 0,
  },
  brandLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoImg: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    objectFit: 'contain',
  },
  brandTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  brandSub: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 500,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  syncWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  syncDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#059669',
    flexShrink: 0,
    animation: 'breathe 2s infinite',
  },
  syncText: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  langGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '3px',
  },
  langBtn: {
    padding: '4px 9px',
    borderRadius: '5px',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  langBtnActive: {
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#ffffff',
    background: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 700,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '8px',
    background: '#fef2f2',
    color: '#e11d48',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
};

export default TopNavbar;
