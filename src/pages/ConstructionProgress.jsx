import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Table, Badge } from 'react-bootstrap';
import { FiTrendingUp, FiClock, FiActivity, FiArrowUpRight, FiLayers, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { Line, Doughnut, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import kpiData from '../data/constructionKpiData.json';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ConstructionProgress = () => {
  const { progressStatus, milestones } = kpiData;

  const chartOptionsDefault = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } }
    }
  };

  // 1. Schedule Adherence Line Chart
  const scheduleData = {
    labels: kpiData.monthlyScheduleVariance.labels,
    datasets: [
      { label: 'Planned', data: kpiData.monthlyScheduleVariance.planned, borderColor: '#cbd5e1', backgroundColor: 'transparent', borderWidth: 2, borderDash: [5, 5], tension: 0.4 },
      { label: 'Actual', data: kpiData.monthlyScheduleVariance.actual, borderColor: '#2563eb', backgroundColor: 'transparent', borderWidth: 3, tension: 0.4 }
    ]
  };

  // 2. Task Status Distribution (Original)
  const taskStatusData = {
    labels: Object.keys(progressStatus.taskStatus),
    datasets: [{
      data: Object.values(progressStatus.taskStatus),
      backgroundColor: ['#22c55e', '#3b82f6', '#94a3b8', '#ef4444', '#f59e0b'],
      borderWidth: 0
    }]
  };

  // 3. Task Priority (Merged from old dashboard)
  const priorityData = {
    labels: Object.keys(progressStatus.taskPriority),
    datasets: [{
      data: Object.values(progressStatus.taskPriority),
      backgroundColor: ['#ef4444', '#22c55e', '#f59e0b'],
      borderWidth: 0
    }]
  };

  // 4. Pending Items (Merged from old dashboard)
  const pendingData = {
    labels: progressStatus.pendingItems.labels,
    datasets: [{
      data: progressStatus.pendingItems.data,
      backgroundColor: ['#1e3a5f', '#3b82f6', '#60a5fa'],
      borderRadius: 4,
      barPercentage: 0.6
    }]
  };

  // 5. Task Timeline (Gantt-like bar chart merged from old dashboard)
  const timelineData = {
    labels: progressStatus.tasks.map(t => t.name),
    datasets: [{
      label: 'Duration (Days)',
      data: progressStatus.tasks.map(t => t.duration),
      backgroundColor: progressStatus.tasks.map((_, i) => i > 7 ? 'rgba(37, 99, 235, 0.2)' : 'var(--electric)'),
      borderRadius: 4,
      barPercentage: 0.7
    }]
  };

  return (
    <Container fluid className="p-4 pt-5" style={{ background: 'var(--surface-primary)', minHeight: '100vh' }}>
      <div className="mb-4 fade-in-up">
        <h2 style={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Site Progress Intelligence</h2>
        <div className="d-flex align-items-center gap-2 mt-1">
          <Badge bg="primary" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px' }}>Active Site</Badge>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '13px', fontWeight: 500 }}>{progressStatus.projectName}</span>
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <Row className="g-4 mb-4">
        {[
          { icon: <FiTrendingUp />, color: '#22c55e', label: 'OVERALL PROGRESS', value: `${progressStatus.percentageComplete}%`, bg: 'rgba(34, 197, 94, 0.1)' },
          { icon: <FiClock />, color: '#ef4444', label: 'CRITICAL OVERDUE', value: `${progressStatus.taskStatus.Overdue} Tasks`, bg: 'rgba(239, 68, 68, 0.1)' },
          { icon: <FiActivity />, color: '#3b82f6', label: 'SCHEDULE PERFORMANCE', value: '0.87 SPI', bg: 'rgba(59, 130, 246, 0.1)' },
          { icon: <FiLayers />, color: '#f59e0b', label: 'PENDING APPROVALS', value: progressStatus.pendingItems.data[0], bg: 'rgba(245, 158, 11, 0.1)' }
        ].map((card, i) => (
          <Col xl={3} md={6} key={i} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <Card className="glass-card p-3 border-0">
              <div className="d-flex align-items-center gap-3">
                <div style={{ background: card.bg, padding: '12px', borderRadius: '12px', color: card.color }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>{card.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>{card.value}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Labour Productivity Index Card */}
      <div className="glass-card p-4 mb-4 fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h6 className="text-uppercase m-0" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>
              Labour Productivity Index
            </h6>
            <p className="m-0 mt-1" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Output per man-day (sq ft of work completed per worker per day)
            </p>
          </div>
          <div className="d-flex align-items-center gap-4">
            <div className="text-center">
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#2563eb' }}>18.4</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)' }}>SQ FT / WORKER / DAY</div>
            </div>
            {/* 6-week trend sparkline (inline SVG) */}
            <div style={{ width: '160px', height: '48px' }}>
              <svg viewBox="0 0 160 48" width="160" height="48">
                {/* Grid lines */}
                <line x1="0" y1="12" x2="160" y2="12" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="24" x2="160" y2="24" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="36" x2="160" y2="36" stroke="#f1f5f9" strokeWidth="1" />
                {/* Sparkline: values [15.2, 16.8, 17.1, 16.5, 18.0, 18.4] mapped to Y */}
                <polyline
                  points="8,38 36,30 64,28 92,32 120,20 148,18"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data points */}
                {[[8,38],[36,30],[64,28],[92,32],[120,20],[148,18]].map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#2563eb" strokeWidth="2" />
                ))}
                {/* Labels */}
                <text x="8" y="47" fontSize="7" fill="#94a3b8" textAnchor="middle">W1</text>
                <text x="36" y="47" fontSize="7" fill="#94a3b8" textAnchor="middle">W2</text>
                <text x="64" y="47" fontSize="7" fill="#94a3b8" textAnchor="middle">W3</text>
                <text x="92" y="47" fontSize="7" fill="#94a3b8" textAnchor="middle">W4</text>
                <text x="120" y="47" fontSize="7" fill="#94a3b8" textAnchor="middle">W5</text>
                <text x="148" y="47" fontSize="7" fill="#94a3b8" textAnchor="middle">W6</text>
              </svg>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700 }}>
              <FiArrowUpRight size={14} /> +21% in 6 weeks
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <Row className="g-4 mb-4">
        <Col lg={8} className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="m-0 text-uppercase" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Monthly Schedule Adherence (%)</h6>
              <div className="d-flex gap-3">
                 <div className="d-flex align-items-center gap-2" style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#cbd5e1' }} /> PLANNED
                 </div>
                 <div className="d-flex align-items-center gap-2" style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#2563eb' }} /> ACTUAL
                 </div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={scheduleData} options={chartOptionsDefault} />
            </div>
          </div>
        </Col>
        <Col lg={4} className="fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Task Distribution</h6>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Doughnut data={taskStatusData} options={{ ...chartOptionsDefault, cutout: '82%' }} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)' }}>{progressStatus.percentageComplete}%</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)' }}>OVERALL</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Merged Detail Panels */}
      <Row className="g-4 mb-4">
        <Col lg={4} className="fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Task Priority Profile</h6>
            <div style={{ height: '220px' }}>
              <Pie data={priorityData} options={{ ...chartOptionsDefault, plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } } } }} />
            </div>
          </div>
        </Col>
        <Col lg={4} className="fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Pending Action Items</h6>
            <div style={{ height: '220px' }}>
              <Bar data={pendingData} options={{ ...chartOptionsDefault, scales: { ...chartOptionsDefault.scales, y: { ...chartOptionsDefault.scales.y, max: 8 } } }} />
            </div>
          </div>
        </Col>
        <Col lg={4} className="fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Budget Variance (Active)</h6>
            <div className="d-flex flex-column gap-3 mt-4">
              <div className="p-3 rounded-3" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309' }}>PLANNED SPEND</div>
                <div style={{ fontSize: '20px', fontWeight: 900 }}>₹{progressStatus.budget.Planned.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-3" style={{ background: 'rgba(15, 23, 42, 0.03)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)' }}>ACTUAL SPEND</div>
                <div style={{ fontSize: '20px', fontWeight: 900 }}>₹{progressStatus.budget.Actual.toLocaleString()}</div>
              </div>
              <div className="mt-2 text-center" style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                Cost Variance: <span style={{ color: '#ef4444', fontWeight: 800 }}>-₹14,300 (Over budget)</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Task Timeline / Gantt List */}
      <div className="glass-card p-4 mb-4 fade-in-up" style={{ animationDelay: '0.7s' }}>
        <h6 className="text-uppercase mb-4" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Project Phase Execution Timeline (Days)</h6>
        <div style={{ height: '350px' }}>
          <Bar data={timelineData} options={{ ...chartOptionsDefault, indexAxis: 'y' }} />
        </div>
      </div>

      {/* Milestone Lifecycle Table */}
      <div className="glass-card p-0 overflow-hidden fade-in-up" style={{ animationDelay: '0.8s' }}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
            <h6 className="m-0 text-uppercase" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Construction Milestones Lifecycle</h6>
            <Badge bg="primary" style={{ fontSize: '10px', padding: '5px 12px' }}>Current Phase: RCC Shell</Badge>
        </div>
        <Table borderless hover responsive className="mb-0 bg-white">
          <thead style={{ background: 'var(--surface-primary)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '16px', fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '16px', fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>MILESTONE NAME</th>
              <th style={{ padding: '16px', fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>BUDGET (EST)</th>
              <th style={{ padding: '16px', fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>ACTUAL COST</th>
              <th style={{ padding: '16px', fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>SITE MANAGER</th>
              <th style={{ padding: '16px', fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((m, idx) => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '18px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)' }}>#{m.id}</td>
                <td style={{ padding: '18px 16px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</td>
                <td style={{ padding: '18px 16px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>₹{m.budget.toLocaleString()}</td>
                <td style={{ padding: '18px 16px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>₹{m.actual.toLocaleString()}</td>
                <td style={{ padding: '18px 16px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.manager}</td>
                <td style={{ padding: '18px 16px' }}>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: m.status === 'success' ? '#22c55e' : m.status === 'warning' ? '#f59e0b' : '#ef4444',
                      boxShadow: `0 0 10px ${m.status === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: m.status === 'success' ? '#16a34a' : '#ef4444' }}>
                      {m.status === 'success' ? 'Stable' : 'Critical'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ConstructionProgress;
