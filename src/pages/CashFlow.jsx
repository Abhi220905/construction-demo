import React from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import cfData from '../data/cashFlowData.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Title, Tooltip, Legend);

const formatCurrency = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const CashFlow = () => {
  const { summary, monthlyFlow, operational, quarterlyBreakdown, realMarketBenchmarks, paymentSchedule } = cfData;

  // Net cash per month
  const netMonthly = monthlyFlow.inflow.map((v, i) => v - monthlyFlow.outflow[i]);

  // --- Charts ---
  const flowChartData = {
    labels: monthlyFlow.labels,
    datasets: [
      { label: 'Inflow', data: monthlyFlow.inflow, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)', fill: true, tension: 0.4, borderWidth: 2.5 },
      { label: 'Outflow', data: monthlyFlow.outflow, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.06)', fill: true, tension: 0.4, borderWidth: 2.5 },
    ]
  };
  const flowChartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 }, callback: (v) => formatCurrency(v) } }
    }
  };

  // Operational breakdown
  const opColors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#6366f1', '#a5b4fc'];
  const opChartData = {
    labels: operational.categories,
    datasets: [
      { label: 'Actual', data: operational.amounts, backgroundColor: opColors, borderRadius: 6, barPercentage: 0.5 },
      { label: 'Budget', data: operational.budget, backgroundColor: opColors.map(c => c + '44'), borderRadius: 6, barPercentage: 0.5 }
    ]
  };
  const opChartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` } }
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 9 }, callback: (v) => formatCurrency(v) } },
      y: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' } } }
    }
  };

  // Real market benchmark grouped bar
  const benchmarkData = {
    labels: realMarketBenchmarks.labels,
    datasets: [
      { label: 'Cost / Sq Ft (₹)', data: realMarketBenchmarks.costPerSqFt, backgroundColor: '#ef4444', borderRadius: 4, barPercentage: 0.6 },
      { label: 'Revenue / Sq Ft (₹)', data: realMarketBenchmarks.revenuePerSqFt, backgroundColor: '#22c55e', borderRadius: 4, barPercentage: 0.6 }
    ]
  };
  const benchmarkOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${ctx.raw.toLocaleString()}` } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 }, callback: (v) => `₹${v.toLocaleString()}` } }
    }
  };

  // Operational doughnut
  const opDonutData = {
    labels: operational.categories,
    datasets: [{
      data: operational.amounts,
      backgroundColor: opColors,
      borderWidth: 0
    }]
  };

  const statusIcon = (s) => {
    if (s === 'Paid') return <FiCheckCircle size={14} color="#22c55e" />;
    if (s === 'Overdue') return <FiAlertCircle size={14} color="#ef4444" />;
    if (s === 'Pending') return <FiClock size={14} color="#f59e0b" />;
    return <FiClock size={14} color="#94a3b8" />;
  };

  const statusBadgeBg = (s) => {
    if (s === 'Paid') return { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' };
    if (s === 'Overdue') return { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' };
    if (s === 'Pending') return { bg: 'rgba(245,158,11,0.1)', color: '#d97706' };
    return { bg: 'rgba(148,163,184,0.1)', color: '#64748b' };
  };

  return (
    <Container fluid className="p-4 pt-5" style={{ background: 'var(--surface-primary)', minHeight: '100vh' }}>
      <div className="mb-4 fade-in-up">
        <h2 style={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Cash Flow & Financial Operations</h2>
        <p style={{ color: 'var(--text-tertiary)' }}>Real-time cash position, operational expenditure tracking, and market-adjusted financial intelligence</p>
      </div>

      {/* Summary KPI Cards */}
      <Row className="g-4 mb-4">
        {[
          { label: 'TOTAL INFLOW', value: formatCurrency(summary.totalInflow), icon: <FiTrendingUp />, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
          { label: 'TOTAL OUTFLOW', value: formatCurrency(summary.totalOutflow), icon: <FiTrendingDown />, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
          { label: 'NET CASH FLOW', value: formatCurrency(summary.netCashFlow), icon: <FiDollarSign />, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
          { label: 'CLOSING BALANCE', value: formatCurrency(summary.closingBalance), icon: <FiArrowUpRight />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
        ].map((card, i) => (
          <Col xl={3} md={6} key={i} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <Card className="glass-card p-3 border-0">
              <div className="d-flex align-items-center gap-3">
                <div style={{ background: card.bg, padding: '12px', borderRadius: '12px', color: card.color, fontSize: '20px' }}>{card.icon}</div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>{card.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)' }}>{card.value}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Secondary metrics row */}
      <Row className="g-4 mb-4">
        <Col md={4} className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-3 d-flex justify-content-between align-items-center">
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)' }}>OPENING BALANCE</div>
              <div style={{ fontSize: '16px', fontWeight: 900 }}>{formatCurrency(summary.openingBalance)}</div>
            </div>
            <FiArrowUpRight color="#22c55e" size={20} />
          </div>
        </Col>
        <Col md={4} className="fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="glass-card p-3 d-flex justify-content-between align-items-center">
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)' }}>MONTHLY BURN RATE</div>
              <div style={{ fontSize: '16px', fontWeight: 900 }}>{summary.burnRate}</div>
            </div>
            <FiArrowDownRight color="#ef4444" size={20} />
          </div>
        </Col>
        <Col md={4} className="fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card p-3 d-flex justify-content-between align-items-center">
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)' }}>CASH RUNWAY</div>
              <div style={{ fontSize: '16px', fontWeight: 900 }}>{summary.runway}</div>
            </div>
            <FiClock color="#f59e0b" size={20} />
          </div>
        </Col>
      </Row>

      {/* Monthly Flow + Operational Breakdown */}
      <Row className="g-4 mb-4">
        <Col lg={8} className="fade-in-up" style={{ animationDelay: '0.35s' }}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Monthly Inflow vs Outflow</h6>
            <div style={{ height: '320px' }}>
              <Line data={flowChartData} options={flowChartOpts} />
            </div>
          </div>
        </Col>
        <Col lg={4} className="fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Expense Allocation</h6>
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Doughnut data={opDonutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '78%', plugins: { legend: { display: false } } }} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 900 }}>₹2.22Cr</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)' }}>TOTAL OPEX</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Operational Cost Breakdown - Horizontal */}
      <div className="glass-card p-4 mb-4 fade-in-up" style={{ animationDelay: '0.45s' }}>
        <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Operational Expenditure: Actual vs Budget</h6>
        <div style={{ height: '320px' }}>
          <Bar data={opChartData} options={opChartOpts} />
        </div>
      </div>

      {/* Real Market Benchmark + Quarterly Table */}
      <Row className="g-4 mb-4">
        <Col lg={7} className="fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Summarised Real Market Data — Cost vs Revenue (₹/Sq Ft)</h6>
            <div style={{ height: '300px' }}>
              <Bar data={benchmarkData} options={benchmarkOpts} />
            </div>
          </div>
        </Col>
        <Col lg={5} className="fade-in-up" style={{ animationDelay: '0.55s' }}>
          <div className="glass-card p-0 overflow-hidden h-100">
            <div className="p-4 pb-2">
              <h6 className="text-uppercase m-0" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Quarterly Cash Summary</h6>
            </div>
            <Table borderless responsive className="mb-0">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <th style={thStyle}>Quarter</th>
                  <th style={thStyle}>Inflow</th>
                  <th style={thStyle}>Outflow</th>
                  <th style={thStyle}>Net</th>
                </tr>
              </thead>
              <tbody>
                {quarterlyBreakdown.map((q, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={tdStyleBold}>{q.quarter}</td>
                    <td style={{ ...tdStyle, color: '#16a34a' }}>{formatCurrency(q.inflow)}</td>
                    <td style={{ ...tdStyle, color: '#dc2626' }}>{formatCurrency(q.outflow)}</td>
                    <td style={tdStyleBold}>{formatCurrency(q.net)}</td>
                  </tr>
                ))}
                <tr style={{ background: 'rgba(37,99,235,0.04)' }}>
                  <td style={{ ...tdStyleBold, color: 'var(--electric)' }}>FY26 Total</td>
                  <td style={{ ...tdStyleBold, color: '#16a34a' }}>{formatCurrency(summary.totalInflow)}</td>
                  <td style={{ ...tdStyleBold, color: '#dc2626' }}>{formatCurrency(summary.totalOutflow)}</td>
                  <td style={{ ...tdStyleBold, color: 'var(--electric)' }}>{formatCurrency(summary.netCashFlow)}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Payment Schedule */}
      <div className="glass-card p-0 overflow-hidden fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
          <h6 className="m-0 text-uppercase" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Vendor Payment Schedule</h6>
          <Badge bg="primary" style={{ fontSize: '10px', padding: '5px 12px' }}>{paymentSchedule.filter(p => p.status === 'Overdue').length} Overdue</Badge>
        </div>
        <Table borderless hover responsive className="mb-0 bg-white">
          <thead style={{ background: 'var(--surface-primary)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Vendor</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentSchedule.map(pmt => {
              const badge = statusBadgeBg(pmt.status);
              return (
                <tr key={pmt.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--text-tertiary)' }}>{pmt.id}</td>
                  <td style={{ ...tdStyleBold }}>{pmt.vendor}</td>
                  <td style={{ ...tdStyleBold }}>{formatCurrency(pmt.amount)}</td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{pmt.due}</td>
                  <td style={{ padding: '16px' }}>
                    <div className="d-flex align-items-center gap-2">
                      {statusIcon(pmt.status)}
                      <span style={{ fontSize: '11px', fontWeight: 700, color: badge.color, background: badge.bg, padding: '3px 10px', borderRadius: '6px' }}>{pmt.status}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

const thStyle = { padding: '14px 16px', fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.3px' };
const tdStyle = { padding: '16px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 };
const tdStyleBold = { padding: '16px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' };

export default CashFlow;
