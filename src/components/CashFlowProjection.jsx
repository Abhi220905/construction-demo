import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiAlertTriangle,
  FiShield,
  FiInfo
} from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

/**
 * CashFlowProjection Component — MODULE 2
 *
 * A full-width 90-day (13-week) cash flow projection chart with:
 * - Conservative / Realistic / Optimistic scenario toggle
 * - Line chart: projected inflows vs outflows with "Cash Gap" shaded zone
 * - Summary table: Week, Inflows, Outflows, Net Position, Status (Surplus/Deficit)
 *
 * All mock data is hardcoded. Currency in ₹ (Indian Rupees).
 *
 * Dependencies: react-bootstrap, react-chartjs-2, chart.js, react-icons/fi
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatINR = (val) => {
  if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

// ─── 13-Week Mock Data (Realistic Construction Company) ─────────────────────

const weekLabels = [
  'W1 (Apr 7)', 'W2 (Apr 14)', 'W3 (Apr 21)', 'W4 (Apr 28)',
  'W5 (May 5)', 'W6 (May 12)', 'W7 (May 19)', 'W8 (May 26)',
  'W9 (Jun 2)', 'W10 (Jun 9)', 'W11 (Jun 16)', 'W12 (Jun 23)', 'W13 (Jun 30)'
];

// Inflows: milestone payments, new bookings, collections
// Outflows: contractor payments, materials, EMI, salaries, GST/TDS
const scenarioData = {
  conservative: {
    inflows:  [2800000, 1200000, 900000, 4500000, 1800000, 700000, 3200000, 1100000, 850000, 5200000, 1500000, 600000, 2900000],
    outflows: [3200000, 2800000, 2400000, 3600000, 2900000, 2700000, 3100000, 2500000, 2800000, 3400000, 2600000, 3000000, 3800000],
    description: 'Assumes delayed milestone payments, slower bookings, and higher material costs.'
  },
  realistic: {
    inflows:  [3500000, 1800000, 1400000, 5200000, 2500000, 1200000, 4100000, 1800000, 1500000, 6000000, 2200000, 1100000, 3800000],
    outflows: [3000000, 2500000, 2200000, 3400000, 2700000, 2500000, 2900000, 2300000, 2600000, 3200000, 2400000, 2800000, 3500000],
    description: 'Based on current run-rate with expected milestone collections on schedule.'
  },
  optimistic: {
    inflows:  [4200000, 2500000, 2000000, 6100000, 3200000, 1800000, 5000000, 2500000, 2200000, 7000000, 3000000, 1700000, 4600000],
    outflows: [2800000, 2300000, 2000000, 3200000, 2500000, 2300000, 2700000, 2100000, 2400000, 3000000, 2200000, 2600000, 3200000],
    description: 'Assumes accelerated sales, early milestone payments, and negotiated vendor discounts.'
  }
};

// Inflow/outflow category breakdown tooltips
const inflowCategories = 'Milestone payments from buyers · New booking advances · Pending collections · Interest income';
const outflowCategories = 'Contractor RA bills · Material purchases · EMI/Loan payments · Salary & payroll · GST/TDS filings · Site overhead';

// ─── Styles ──────────────────────────────────────────────────────────────────

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
  padding: '20px',
  height: '100%'
};

const kpiCardStyle = (borderColor) => ({
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  borderLeft: `4px solid ${borderColor}`,
  padding: '18px 16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
});

const toggleStyles = {
  active: {
    background: '#2563eb',
    color: '#fff',
    border: '1px solid #2563eb',
    fontWeight: 700,
    fontSize: '0.8rem',
    padding: '6px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s ease'
  },
  inactive: {
    background: '#f8fafc',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    fontWeight: 600,
    fontSize: '0.8rem',
    padding: '6px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

const CashFlowProjection = () => {
  const [scenario, setScenario] = useState('realistic');

  const currentData = scenarioData[scenario];

  // Calculate derived data
  const weeklyData = useMemo(() => {
    return weekLabels.map((label, i) => {
      const inflow = currentData.inflows[i];
      const outflow = currentData.outflows[i];
      const net = inflow - outflow;
      return {
        week: label,
        inflow,
        outflow,
        net,
        status: net >= 0 ? 'Surplus' : 'Deficit',
        cumulative: currentData.inflows.slice(0, i + 1).reduce((a, b) => a + b, 0) -
                    currentData.outflows.slice(0, i + 1).reduce((a, b) => a + b, 0)
      };
    });
  }, [currentData]);

  // Summary KPIs
  const totalInflows = currentData.inflows.reduce((a, b) => a + b, 0);
  const totalOutflows = currentData.outflows.reduce((a, b) => a + b, 0);
  const netPosition = totalInflows - totalOutflows;
  const deficitWeeks = weeklyData.filter(w => w.status === 'Deficit').length;
  const maxDeficit = Math.min(...weeklyData.map(w => w.net));
  const peakSurplus = Math.max(...weeklyData.map(w => w.net));

  // ── Chart data ──
  // Build "Cash Gap" zones — shaded red area where outflows > inflows
  const cashGapData = weeklyData.map(w => w.net < 0 ? w.outflow : null);
  const cashGapInflowLine = weeklyData.map(w => w.net < 0 ? w.inflow : null);

  const chartData = {
    labels: weekLabels.map(l => l.replace(/\(.*\)/, '').trim()),
    datasets: [
      {
        label: 'Inflows',
        data: currentData.inflows,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        borderWidth: 2.5,
        tension: 0.35,
        fill: false,
        pointRadius: 4,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        order: 1
      },
      {
        label: 'Outflows',
        data: currentData.outflows,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderWidth: 2.5,
        tension: 0.35,
        fill: false,
        pointRadius: 4,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        order: 2
      },
      {
        label: 'Cash Gap Zone',
        data: currentData.outflows.map((out, i) => {
          const inf = currentData.inflows[i];
          return out > inf ? out : inf;
        }),
        borderColor: 'transparent',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderWidth: 0,
        tension: 0.35,
        fill: {
          target: {
            value: 0
          },
          above: 'transparent',
          below: 'transparent'
        },
        pointRadius: 0,
        order: 3
      },
      {
        label: 'Net Position',
        data: weeklyData.map(w => w.net),
        borderColor: '#2563eb',
        backgroundColor: (ctx) => {
          if (!ctx.chart.chartArea) return 'rgba(37, 99, 235, 0.1)';
          const gradient = ctx.chart.ctx.createLinearGradient(0, ctx.chart.chartArea.top, 0, ctx.chart.chartArea.bottom);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
          gradient.addColorStop(1, 'rgba(37, 99, 235, 0.01)');
          return gradient;
        },
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: weeklyData.map(w => w.net >= 0 ? '#22c55e' : '#ef4444'),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        order: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 16,
          font: { size: 11, weight: '600' },
          filter: (item) => item.text !== 'Cash Gap Zone'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { size: 12, weight: '700' },
        bodyFont: { size: 11 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            if (ctx.dataset.label === 'Cash Gap Zone') return null;
            return `${ctx.dataset.label}: ${formatINR(ctx.raw)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10, weight: '600' },
          color: '#94a3b8'
        }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: {
          font: { size: 10, weight: '500' },
          color: '#94a3b8',
          callback: (v) => formatINR(v)
        }
      }
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            90-Day Cash Flow Projection
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
            {currentData.description}
          </p>
        </div>

        {/* Scenario Toggle */}
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          {['conservative', 'realistic', 'optimistic'].map(s => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              style={scenario === s ? toggleStyles.active : toggleStyles.inactive}
            >
              {s === 'conservative' && '🛡️ '}
              {s === 'realistic' && '📊 '}
              {s === 'optimistic' && '🚀 '}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <div style={kpiCardStyle('#22c55e')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiTrendingUp color="#22c55e" size={16} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Projected Inflows</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{formatINR(totalInflows)}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{inflowCategories.split('·')[0].trim()}</div>
          </div>
        </Col>
        <Col md={3} sm={6}>
          <div style={kpiCardStyle('#ef4444')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiTrendingDown color="#ef4444" size={16} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Projected Outflows</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{formatINR(totalOutflows)}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Contractors · Materials · EMI</div>
          </div>
        </Col>
        <Col md={3} sm={6}>
          <div style={kpiCardStyle(netPosition >= 0 ? '#22c55e' : '#ef4444')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiDollarSign color={netPosition >= 0 ? '#22c55e' : '#ef4444'} size={16} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net 90-Day Position</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: netPosition >= 0 ? '#16a34a' : '#dc2626' }}>{formatINR(netPosition)}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{netPosition >= 0 ? 'Healthy position' : 'Funding gap identified'}</div>
          </div>
        </Col>
        <Col md={3} sm={6}>
          <div style={kpiCardStyle(deficitWeeks > 4 ? '#ef4444' : deficitWeeks > 2 ? '#f59e0b' : '#22c55e')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiAlertTriangle color={deficitWeeks > 4 ? '#ef4444' : deficitWeeks > 2 ? '#f59e0b' : '#22c55e'} size={16} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deficit Weeks</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{deficitWeeks} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>of 13</span></div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Max deficit: {formatINR(maxDeficit)}</div>
          </div>
        </Col>
      </Row>

      {/* ── Chart ── */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h6 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Weekly Inflows vs Outflows — {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario
          </h6>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Inflows
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /> Outflows
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 8, height: 3, background: '#2563eb', display: 'inline-block', borderRadius: 2 }} /> Net
            </span>
          </div>
        </div>
        <div style={{ height: '380px', position: 'relative' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* ── Weekly Breakdown Table ── */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h6 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Weekly Breakdown
          </h6>
          <Badge
            bg=""
            style={{
              background: deficitWeeks > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
              color: deficitWeeks > 0 ? '#dc2626' : '#16a34a',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px'
            }}
          >
            {deficitWeeks} Deficit Week{deficitWeeks !== 1 ? 's' : ''} Identified
          </Badge>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table striped hover responsive className="mb-0" style={{ fontSize: '0.82rem' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
              <tr>
                <th style={thStyle}>Week</th>
                <th style={thStyle}>Inflows (₹)</th>
                <th style={thStyle}>Outflows (₹)</th>
                <th style={thStyle}>Net Position (₹)</th>
                <th style={thStyle}>Cumulative (₹)</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((w, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: '#0f172a' }}>{w.week}</td>
                  <td style={{ ...tdStyle, color: '#16a34a' }}>{formatINR(w.inflow)}</td>
                  <td style={{ ...tdStyle, color: '#dc2626' }}>{formatINR(w.outflow)}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: w.net >= 0 ? '#16a34a' : '#dc2626' }}>
                    {w.net >= 0 ? '+' : ''}{formatINR(w.net)}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: w.cumulative >= 0 ? '#16a34a' : '#dc2626' }}>
                    {formatINR(w.cumulative)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 12px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: w.status === 'Surplus' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: w.status === 'Surplus' ? '#16a34a' : '#dc2626'
                    }}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ background: '#f8fafc', fontWeight: 800 }}>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#2563eb' }}>90-Day Total</td>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#16a34a' }}>{formatINR(totalInflows)}</td>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#dc2626' }}>{formatINR(totalOutflows)}</td>
                <td style={{ ...tdStyle, fontWeight: 800, color: netPosition >= 0 ? '#16a34a' : '#dc2626' }}>{formatINR(netPosition)}</td>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#2563eb' }}>—</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: netPosition >= 0 ? 'rgba(37,99,235,0.1)' : 'rgba(239,68,68,0.1)',
                    color: netPosition >= 0 ? '#2563eb' : '#dc2626'
                  }}>
                    {netPosition >= 0 ? 'Net Surplus' : 'Net Deficit'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    </div>
  );
};

// ── Table styles ──
const thStyle = {
  padding: '12px 16px',
  fontSize: '0.7rem',
  fontWeight: 800,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '2px solid #e2e8f0',
  whiteSpace: 'nowrap'
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '0.82rem',
  fontWeight: 500,
  color: '#475569',
  verticalAlign: 'middle'
};

export default CashFlowProjection;
