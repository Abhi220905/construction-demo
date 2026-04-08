import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_SECTIONS = [
  {
    title: 'Main Menu',
    items: [
      { path: '/', label: 'Executive Summary', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|P9 22 9 12 15 12 15 22' },
      { path: '/progress', label: 'Site Progress', icon: 'M18 20V10|M12 20V4|M6 20v-6' },
      { path: '/safety', label: 'Safety & Incidents', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    ],
  },
  {
    title: 'Management',
    items: [
      { path: '/staff', label: 'Workforce', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|C9 7 4|M23 21v-2a4 4 0 00-3-3.87' },
      { path: '/projects', label: 'Project Portfolio', icon: 'R3 3 18 18 2|M9 3v18|M3 12h18' },
      { path: '/equipment', label: 'Equipment & Machinery', icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
      { path: '/kpi-dashboard', label: 'Key Point Indicator', icon: 'M3 3v18h18M7 14l3-3 3 2 5-5' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { path: '/vendors', label: 'Procurement', icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z|M3 6h18|M16 10a4 4 0 01-8 0' },
      { path: '/contractors', label: 'Contractors', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|P14 2 14 8 20 8' },
      { path: '/subcontractor-payments', label: 'Payment & LD', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2|M9 5a2 2 0 002 2h2a2 2 0 002-2|M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { path: '/inventory', label: 'Inventory', icon: 'M21 8l-9-4-9 4v8l9 4 9-4V8z|M3 8l9 4 9-4|M12 12v8' },
      { path: '/cash-flow', label: 'Cash Flow', icon: 'M12 1v22|M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
      { path: '/marketing', label: 'Marketing', icon: 'M17 21v-2a4 4 0 00-3-3.87|M9 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75|M8 3.13a4 4 0 010 7.75' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { path: '/profitability', label: 'Unit Profitability', icon: 'M12 2v20|M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
      { path: '/compliance', label: 'Legal & Compliance', icon: 'M9 11l3 3L22 4|M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
      { path: '/geography', label: 'Geography Dashboard', icon: 'M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z|M12 10 9 13 15 13' },
      { path: '/real-estate-analytics', label: 'Market Insights', icon: 'M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z|C12 10 3' },
      { path: '/forecast', label: 'Forecast', icon: 'M23 6l-9.5 9.5-5-5L1 18' },
    ],
  },
];

function NavIcon({ iconData }) {
  const parts = iconData.split('|');
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {parts.map((part, i) => {
        const p = part.trim();
        if (p.startsWith('C')) {
          const nums = p.slice(1).trim().split(/\s+/);
          return <circle key={i} cx={nums[0]} cy={nums[1]} r={nums[2]} />;
        }
        if (p.startsWith('R')) {
          const nums = p.slice(1).trim().split(/\s+/);
          return <rect key={i} x={nums[0]} y={nums[1]} width={nums[2]} height={nums[3]} rx={nums[4] || 0} />;
        }
        if (p.startsWith('P')) {
          return <polyline key={i} points={p.slice(1).trim().replace(/\s+/g, ' ')} />;
        }
        return <path key={i} d={p} />;
      })}
    </svg>
  );
}

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside style={{ ...styles.sidebar, width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}>
      <nav style={styles.nav}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} style={styles.section}>
            {!collapsed && (
              <div style={styles.sectionTitle}>
                {section.title}
              </div>
            )}
            {section.items.map((item, ii) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    ...styles.navItem,
                    ...(isActive ? styles.navItemActive : {}),
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '10px' : '9px 14px',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <span style={{ ...styles.navIcon, ...(isActive ? styles.navIconActive : {}) }}>
                    <NavIcon iconData={item.icon} />
                  </span>
                  {!collapsed && (
                    <span style={styles.navLabel}>{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: 'var(--header-height)',
    left: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, #1e3a5f 0%, #162d4a 40%, #0f1d32 100%)',
    zIndex: 900,
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'width 0.3s var(--ease-out-expo)',
    boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
  },
  nav: {
    padding: '12px 8px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  section: {
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'rgba(148, 163, 184, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '12px 14px 6px',
    animation: 'fadeIn 0.3s ease both',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '9px 14px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '12.5px',
    fontWeight: 500,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'left',
    animation: 'slideInLeft 0.3s var(--ease-out-expo) both',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  navItemActive: {
    background: 'rgba(37, 99, 235, 0.2)',
    color: '#ffffff',
    boxShadow: 'inset 3px 0 0 #3b82f6',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    opacity: 0.7,
  },
  navIconActive: {
    opacity: 1,
    color: '#60a5fa',
  },
  navLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export default Sidebar;
