import React, { useState, useEffect } from 'react';
import { Card, Badge } from 'react-bootstrap';
import {
  FiDollarSign,
  FiCalendar,
  FiAlertTriangle,
  FiCheckCircle,
  FiHome,
  FiUsers,
  FiChevronRight,
  FiSun,
  FiArrowRight,
  FiClock,
  FiShield,
  FiTrendingDown,
  FiFileText,
  FiXCircle
} from 'react-icons/fi';

/**
 * OwnerMorningBrief Component
 * 
 * A compact "daily briefing" card for the top of the Executive Dashboard.
 * Displays 6 KPI tiles in a responsive 2x3 grid and a horizontal scrollable
 * list of auto-generated red flag alert chips.
 * 
 * Mock Data Shape:
 * - kpiTiles: Array of { id, label, value, displayValue, unit, status, icon, trend }
 *   status: 'good' | 'warning' | 'critical'
 * - redFlags: Array of { id, message, category, severity, icon }
 *   severity: 'critical' | 'warning' | 'info'
 * 
 * No external data imports required — all data is hardcoded inside.
 * 
 * Dependencies: react-bootstrap, react-icons/fi
 */

// ─── Mock Data ───────────────────────────────────────────────────────────────

const TODAY = new Date();
const GREETING_HOUR = TODAY.getHours();
const getGreeting = () => {
  if (GREETING_HOUR < 12) return 'Good Morning';
  if (GREETING_HOUR < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const formatIndianCurrency = (num) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
};

const kpiTilesData = [
  {
    id: 'cash-available',
    label: 'Cash Available Today',
    value: 24500000,
    displayValue: formatIndianCurrency(24500000),
    unit: '',
    status: 'good', // > ₹20L is good
    icon: FiDollarSign,
    trend: '+₹3.2L from yesterday',
    trendDirection: 'up'
  },
  {
    id: 'next-milestone',
    label: 'Days to Next Milestone Payment',
    value: 4,
    displayValue: '4',
    unit: 'days',
    status: 'warning', // < 7 days is warning
    icon: FiCalendar,
    trend: 'Skyline Tower Phase 2',
    trendDirection: 'neutral'
  },
  {
    id: 'projects-at-risk',
    label: 'Projects At Risk',
    value: 2,
    displayValue: '2',
    unit: 'of 5',
    status: 'critical', // any > 0 is concerning
    icon: FiAlertTriangle,
    trend: 'Skyline & Green Valley',
    trendDirection: 'down'
  },
  {
    id: 'pending-approvals',
    label: 'Pending Approvals',
    value: 7,
    displayValue: '7',
    unit: 'items',
    status: 'warning', // > 5 is warning
    icon: FiCheckCircle,
    trend: '3 urgent (> 48hrs)',
    trendDirection: 'down'
  },
  {
    id: 'units-sold',
    label: 'Units Sold This Month',
    value: 12,
    displayValue: '12',
    unit: 'units',
    status: 'good', // on target
    icon: FiHome,
    trend: 'Target: 15 | 80% achieved',
    trendDirection: 'up'
  },
  {
    id: 'active-workers',
    label: 'Active Workers on Site',
    value: 387,
    displayValue: '387',
    unit: 'workers',
    status: 'good', // > 350 is healthy
    icon: FiUsers,
    trend: 'Across 5 sites today',
    trendDirection: 'neutral'
  }
];

const redFlagsData = [
  {
    id: 'rf-1',
    message: 'Skyline Tower project 12 days behind schedule',
    category: 'Schedule',
    severity: 'critical',
    icon: FiClock
  },
  {
    id: 'rf-2',
    message: 'RERA quarterly report due in 3 days',
    category: 'Compliance',
    severity: 'critical',
    icon: FiFileText
  },
  {
    id: 'rf-3',
    message: 'Cash runway < 20 days for Green Valley',
    category: 'Financial',
    severity: 'critical',
    icon: FiTrendingDown
  },
  {
    id: 'rf-4',
    message: 'PPE compliance dropped to 76% at Site 3',
    category: 'Safety',
    severity: 'warning',
    icon: FiShield
  },
  {
    id: 'rf-5',
    message: '₹18.5L contractor payment overdue (M/s Sharma)',
    category: 'Financial',
    severity: 'critical',
    icon: FiDollarSign
  },
  {
    id: 'rf-6',
    message: 'GST GSTR-3B filing due in 5 days',
    category: 'Compliance',
    severity: 'warning',
    icon: FiFileText
  },
  {
    id: 'rf-7',
    message: '3 equipment maintenance overdue by 4+ days',
    category: 'Operations',
    severity: 'warning',
    icon: FiAlertTriangle
  },
  {
    id: 'rf-8',
    message: '2 unit cancellation requests received today',
    category: 'Sales',
    severity: 'warning',
    icon: FiXCircle
  }
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const statusColors = {
  good: { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.06)', glow: 'rgba(34, 197, 94, 0.12)' },
  warning: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.06)', glow: 'rgba(245, 158, 11, 0.12)' },
  critical: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.06)', glow: 'rgba(239, 68, 68, 0.12)' }
};

const severityChipColors = {
  critical: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', dot: '#ef4444' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', dot: '#f59e0b' },
  info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', dot: '#2563eb' }
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
    padding: '24px',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  greeting: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  greetingIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.1rem',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
  },
  greetingText: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.2'
  },
  greetingDate: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500'
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '500',
    background: '#f1f5f9',
    padding: '4px 12px',
    borderRadius: '20px'
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'breathe 2s ease-in-out infinite'
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  tile: (status) => ({
    background: statusColors[status].bg,
    borderLeft: `4px solid ${statusColors[status].border}`,
    borderRadius: '10px',
    padding: '16px 14px',
    cursor: 'default',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    border: `1px solid ${statusColors[status].border}22`,
    borderLeftWidth: '4px',
    borderLeftColor: statusColors[status].border,
    minHeight: '100px'
  }),
  tileHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  tileIconWrap: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    fontSize: '0.85rem'
  },
  tileValue: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: '1.1',
    letterSpacing: '-0.02em'
  },
  tileUnit: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#64748b',
    marginLeft: '4px'
  },
  tileLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    marginTop: '4px',
    lineHeight: '1.3',
    textTransform: 'uppercase',
    letterSpacing: '0.03em'
  },
  tileTrend: {
    fontSize: '0.7rem',
    fontWeight: '500',
    color: '#94a3b8',
    marginTop: '6px',
    lineHeight: '1.2'
  },
  redFlagSection: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px'
  },
  redFlagHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  redFlagTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  redFlagCount: {
    background: '#ef4444',
    color: '#fff',
    borderRadius: '12px',
    padding: '1px 8px',
    fontSize: '0.7rem',
    fontWeight: '700',
    minWidth: '20px',
    textAlign: 'center'
  },
  redFlagScroll: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '8px',
    scrollbarWidth: 'thin',
    WebkitOverflowScrolling: 'touch',
    scrollSnapType: 'x mandatory'
  },
  redFlagChip: (severity) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '10px',
    background: severityChipColors[severity].bg,
    border: `1px solid ${severityChipColors[severity].border}`,
    whiteSpace: 'nowrap',
    fontSize: '0.78rem',
    fontWeight: '500',
    color: severityChipColors[severity].text,
    flexShrink: 0,
    scrollSnapAlign: 'start',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '220px',
    maxWidth: '320px'
  }),
  chipDot: (severity) => ({
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: severityChipColors[severity].dot,
    flexShrink: 0,
    animation: severity === 'critical' ? 'breathe 2s ease-in-out infinite' : 'none'
  }),
  chipCategory: (severity) => ({
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: severityChipColors[severity].dot,
    letterSpacing: '0.04em',
    flexShrink: 0
  }),
  chipMessage: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1
  },
  chipArrow: {
    flexShrink: 0,
    opacity: 0.5
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

const OwnerMorningBrief = () => {
  const [hoveredTile, setHoveredTile] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dateString = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const timeString = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const criticalCount = redFlagsData.filter(f => f.severity === 'critical').length;
  const warningCount = redFlagsData.filter(f => f.severity === 'warning').length;

  // Sort: critical first
  const sortedFlags = [...redFlagsData].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div style={styles.container} id="owner-morning-brief">
      {/* ── Decorative gradient accent ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #2563eb, #7c3aed, #f59e0b, #22c55e)',
        borderRadius: '12px 12px 0 0'
      }} />

      {/* ── Header ── */}
      <div style={styles.headerRow}>
        <div style={styles.greeting}>
          <div style={styles.greetingIcon}>
            <FiSun />
          </div>
          <div>
            <div style={styles.greetingText}>{getGreeting()}, AlgoVista</div>
            <div style={styles.greetingDate}>{dateString}</div>
          </div>
        </div>
        <div style={styles.liveIndicator}>
          <div style={styles.liveDot} />
          Live · {timeString}
        </div>
      </div>

      {/* ── 6 KPI Tiles (2×3 Grid) ── */}
      <div style={styles.tilesGrid}>
        {kpiTilesData.map((tile) => {
          const Icon = tile.icon;
          const colors = statusColors[tile.status];
          const isHovered = hoveredTile === tile.id;

          return (
            <div
              key={tile.id}
              style={{
                ...styles.tile(tile.status),
                ...(isHovered ? styles.tileHover : {}),
                boxShadow: isHovered ? `0 4px 16px ${colors.glow}` : 'none'
              }}
              onMouseEnter={() => setHoveredTile(tile.id)}
              onMouseLeave={() => setHoveredTile(null)}
            >
              <div style={{
                ...styles.tileIconWrap,
                background: `${colors.border}18`,
                color: colors.border
              }}>
                <Icon />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={styles.tileValue}>{tile.displayValue}</span>
                {tile.unit && <span style={styles.tileUnit}>{tile.unit}</span>}
              </div>
              <div style={styles.tileLabel}>{tile.label}</div>
              <div style={styles.tileTrend}>{tile.trend}</div>
            </div>
          );
        })}
      </div>

      {/* ── Red Flags Section ── */}
      <div style={styles.redFlagSection}>
        <div style={styles.redFlagHeader}>
          <div style={styles.redFlagTitle}>
            <FiAlertTriangle style={{ color: '#ef4444' }} />
            Red Flags Today
            <span style={styles.redFlagCount}>{sortedFlags.length}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {criticalCount > 0 && (
              <Badge
                bg=""
                style={{
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  padding: '3px 8px'
                }}
              >
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge
                bg=""
                style={{
                  background: '#fffbeb',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  padding: '3px 8px'
                }}
              >
                {warningCount} Warning
              </Badge>
            )}
          </div>
        </div>

        <div style={styles.redFlagScroll} className="red-flag-scroll">
          {sortedFlags.map((flag) => {
            const FlagIcon = flag.icon;
            return (
              <div
                key={flag.id}
                style={styles.redFlagChip(flag.severity)}
                title={flag.message}
              >
                <div style={styles.chipDot(flag.severity)} />
                <span style={styles.chipCategory(flag.severity)}>{flag.category}</span>
                <span style={styles.chipMessage}>{flag.message}</span>
                <FiChevronRight style={styles.chipArrow} size={14} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Inline CSS for scrollbar styling and animations ── */}
      <style>{`
        .red-flag-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .red-flag-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .red-flag-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .red-flag-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        @media (max-width: 576px) {
          #owner-morning-brief {
            padding: 16px !important;
          }
          #owner-morning-brief > div:nth-child(3) {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
        }
        
        @media (min-width: 577px) and (max-width: 768px) {
          #owner-morning-brief > div:nth-child(3) {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1200px) {
          #owner-morning-brief > div:nth-child(3) {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OwnerMorningBrief;
