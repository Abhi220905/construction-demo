import React, { useState } from 'react';
import { Row, Col, Table, Badge, OverlayTrigger, Tooltip as BsTooltip } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiHardDrive,
  FiInfo,
  FiClock,
  FiCheck,
  FiX
} from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

/**
 * SafetyIncidentTracker Component — MODULE 3
 *
 * Sections:
 * 1. Header KPI row: LTIFR, Days Since Last Incident, PPE Compliance %, Near Miss Reports
 * 2. Bar chart: Monthly incident count by type (6 months)
 * 3. Recent incidents log table
 * 4. Safety Score donut chart
 * 5. Daily Safety Checklist
 *
 * All data hardcoded. Indian construction context.
 *
 * Dependencies: react-bootstrap, react-chartjs-2, chart.js, react-icons/fi
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Mock Data ───────────────────────────────────────────────────────────────

const safetyKpis = {
  ltifr: 0.38,
  ltifrTarget: 0.5,
  daysSinceLastIncident: 14,
  ppeCompliancePercent: 82.4,
  nearMissReportsThisMonth: 7,
  totalManHoursWorked: 5260000,
  lostTimeInjuries: 2
};

// Monthly incidents by type for last 6 months
const monthlyIncidents = {
  months: ['Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026'],
  types: {
    'Fall from Height': [3, 2, 4, 1, 3, 1],
    'Equipment Injury': [2, 1, 3, 2, 1, 2],
    'Electrical': [1, 0, 1, 1, 2, 0],
    'Chemical Exposure': [0, 1, 0, 1, 0, 0],
    'Other': [2, 3, 1, 2, 1, 1]
  }
};

const recentIncidents = [
  { id: 'INC-041', date: '2026-04-05', site: 'Skyline Tower', type: 'Fall from Height', severity: 'High', worker: 'Rajesh Kumar', status: 'Investigated', description: 'Worker slipped from 3rd floor scaffolding. Safety harness prevented major injury.' },
  { id: 'INC-040', date: '2026-04-02', site: 'Green Valley Ph-2', type: 'Equipment Injury', severity: 'Medium', worker: 'Suresh Yadav', status: 'Closed', description: 'Minor hand injury while operating concrete mixer. First aid administered.' },
  { id: 'INC-039', date: '2026-03-28', site: 'Skyline Tower', type: 'Electrical', severity: 'High', worker: 'Mohammed Irfan', status: 'Pending', description: 'Electric shock due to exposed wiring near wet area. Immediate medical attention required.' },
  { id: 'INC-038', date: '2026-03-25', site: 'Sunrise Heights', type: 'Other', severity: 'Low', worker: 'Dinesh Patel', status: 'Closed', description: 'Minor back strain from lifting heavy material without proper technique.' },
  { id: 'INC-037', date: '2026-03-22', site: 'Green Valley Ph-2', type: 'Fall from Height', severity: 'Medium', worker: 'Anil Sharma', status: 'Investigated', description: 'Slipped on wet surface at ground level. Minor bruises.' },
  { id: 'INC-036', date: '2026-03-18', site: 'Skyline Tower', type: 'Chemical Exposure', severity: 'Medium', worker: 'Vikram Singh', status: 'Closed', description: 'Mild skin irritation from contact with waterproofing chemical without gloves.' },
  { id: 'INC-035', date: '2026-03-15', site: 'Sunrise Heights', type: 'Equipment Injury', severity: 'Low', worker: 'Ramprasad Gupta', status: 'Closed', description: 'Small cut while cutting rebar. Proper PPE was not worn.' },
  { id: 'INC-034', date: '2026-03-10', site: 'Lakeview Residency', type: 'Other', severity: 'Low', worker: 'Mahesh Joshi', status: 'Closed', description: 'Heat exhaustion during afternoon shift. Rest and hydration provided.' },
];

// PPE compliance breakdown
const ppeData = {
  compliant: 329,
  nonCompliant: 71,
  total: 400
};

const dailyChecklist = [
  { id: 1, item: 'Morning safety briefing conducted', completed: true, time: '06:30 AM' },
  { id: 2, item: 'Scaffolding inspection completed', completed: true, time: '07:00 AM' },
  { id: 3, item: 'Fire extinguishers checked & accessible', completed: true, time: '07:15 AM' },
  { id: 4, item: 'PPE compliance spot-check done', completed: true, time: '08:00 AM' },
  { id: 5, item: 'Electrical installations inspected', completed: false, time: 'Pending' },
  { id: 6, item: 'First aid kits restocked & verified', completed: true, time: '07:30 AM' },
  { id: 7, item: 'Heavy equipment safety tags verified', completed: false, time: 'Pending' },
  { id: 8, item: 'Emergency evacuation drill (weekly)', completed: true, time: '09:00 AM' },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
  padding: '20px',
  height: '100%'
};

const kpiCardColors = {
  ltifr: { border: safetyKpis.ltifr < safetyKpis.ltifrTarget ? '#22c55e' : '#ef4444', icon: FiActivity },
  daysSince: { border: safetyKpis.daysSinceLastIncident > 30 ? '#22c55e' : safetyKpis.daysSinceLastIncident > 7 ? '#f59e0b' : '#ef4444', icon: FiShield },
  ppe: { border: safetyKpis.ppeCompliancePercent >= 90 ? '#22c55e' : safetyKpis.ppeCompliancePercent >= 80 ? '#f59e0b' : '#ef4444', icon: FiHardDrive },
  nearMiss: { border: safetyKpis.nearMissReportsThisMonth > 10 ? '#ef4444' : '#f59e0b', icon: FiAlertTriangle }
};

const severityColors = {
  High: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  Medium: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  Low: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' }
};

const statusColors = {
  Investigated: { bg: 'rgba(37,99,235,0.1)', text: '#1e40af' },
  Pending: { bg: 'rgba(245,158,11,0.1)', text: '#d97706' },
  Closed: { bg: 'rgba(34,197,94,0.1)', text: '#16a34a' }
};

const thStyle = {
  padding: '12px 14px',
  fontSize: '0.7rem',
  fontWeight: 800,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '2px solid #e2e8f0',
  whiteSpace: 'nowrap'
};

const tdStyle = {
  padding: '12px 14px',
  fontSize: '0.82rem',
  fontWeight: 500,
  color: '#475569',
  verticalAlign: 'middle'
};

// ─── Component ───────────────────────────────────────────────────────────────

const SafetyIncidentTracker = () => {
  // Bar chart data
  const incidentBarData = {
    labels: monthlyIncidents.months,
    datasets: Object.entries(monthlyIncidents.types).map(([type, data], idx) => {
      const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#64748b'];
      return {
        label: type,
        data,
        backgroundColor: colors[idx] + 'CC',
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.85
      };
    })
  };

  const incidentBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 10, weight: '600' } }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        cornerRadius: 8,
        padding: 10,
        titleFont: { size: 11, weight: '700' },
        bodyFont: { size: 10 }
      }
    },
    scales: {
      x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' } },
      y: { stacked: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 }, color: '#94a3b8', stepSize: 2 } }
    }
  };

  // Donut chart for PPE
  const ppeDonutData = {
    labels: ['PPE Compliant', 'Non-Compliant'],
    datasets: [{
      data: [ppeData.compliant, ppeData.nonCompliant],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  const ppeDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} workers (${((ctx.raw / ppeData.total) * 100).toFixed(1)}%)`
        }
      }
    }
  };

  const completedChecks = dailyChecklist.filter(c => c.completed).length;
  const checklistPercent = ((completedChecks / dailyChecklist.length) * 100).toFixed(0);

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* ── Title ── */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiShield color="#2563eb" />
          Safety & Incident Tracker
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
          Site-wide safety monitoring · LTIFR tracking · PPE compliance · Incident logs
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <Row className="g-3 mb-4">
        {/* LTIFR */}
        <Col lg={3} sm={6}>
          <div style={{ ...cardStyle, borderLeft: `4px solid ${kpiCardColors.ltifr.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LTIFR</span>
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <BsTooltip>
                    <strong>LTIFR Formula:</strong><br />
                    (Lost Time Injuries × 1,000,000) ÷ Man-hours Worked<br />
                    = ({safetyKpis.lostTimeInjuries} × 1,000,000) ÷ {safetyKpis.totalManHoursWorked.toLocaleString('en-IN')}<br />
                    = {safetyKpis.ltifr}<br />
                    <strong>Target: &lt; {safetyKpis.ltifrTarget}</strong>
                  </BsTooltip>
                }
              >
                <span style={{ cursor: 'help' }}><FiInfo size={14} color="#94a3b8" /></span>
              </OverlayTrigger>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: safetyKpis.ltifr < safetyKpis.ltifrTarget ? '#16a34a' : '#dc2626' }}>
              {safetyKpis.ltifr}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
              Target: &lt; {safetyKpis.ltifrTarget} · {safetyKpis.ltifr < safetyKpis.ltifrTarget ? '✓ Within target' : '⚠ Above target'}
            </div>
          </div>
        </Col>

        {/* Days Since Last Incident */}
        <Col lg={3} sm={6}>
          <div style={{ ...cardStyle, borderLeft: `4px solid ${kpiCardColors.daysSince.border}` }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Days Since Last Incident</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
              {safetyKpis.daysSinceLastIncident}
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginLeft: '6px' }}>days</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
              Last: {recentIncidents[0].type} at {recentIncidents[0].site}
            </div>
          </div>
        </Col>

        {/* PPE Compliance */}
        <Col lg={3} sm={6}>
          <div style={{ ...cardStyle, borderLeft: `4px solid ${kpiCardColors.ppe.border}` }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PPE Compliance</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: safetyKpis.ppeCompliancePercent >= 90 ? '#16a34a' : safetyKpis.ppeCompliancePercent >= 80 ? '#d97706' : '#dc2626', marginTop: '8px' }}>
              {safetyKpis.ppeCompliancePercent.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
              {ppeData.compliant} of {ppeData.total} workers compliant
            </div>
          </div>
        </Col>

        {/* Near Miss Reports */}
        <Col lg={3} sm={6}>
          <div style={{ ...cardStyle, borderLeft: `4px solid ${kpiCardColors.nearMiss.border}` }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Near Miss Reports (Month)</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
              {safetyKpis.nearMissReportsThisMonth}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
              Proactive reporting encouraged
            </div>
          </div>
        </Col>
      </Row>

      {/* ── Charts Row: Incident Bar + Safety Score Donut ── */}
      <Row className="g-3 mb-4">
        <Col lg={8}>
          <div style={cardStyle}>
            <h6 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
              Monthly Incidents by Type (Last 6 Months)
            </h6>
            <div style={{ height: '320px' }}>
              <Bar data={incidentBarData} options={incidentBarOptions} />
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div style={cardStyle}>
            <h6 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
              Safety Score — PPE Compliance
            </h6>
            <div style={{ height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={ppeDonutData} options={ppeDonutOptions} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: safetyKpis.ppeCompliancePercent >= 80 ? '#16a34a' : '#dc2626' }}>
                  {safetyKpis.ppeCompliancePercent.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8' }}>OVERALL SCORE</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontWeight: 600, color: '#475569' }}>Compliant ({ppeData.compliant})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                <span style={{ fontWeight: 600, color: '#475569' }}>Non-Compliant ({ppeData.nonCompliant})</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* ── Recent Incidents Table ── */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h6 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recent Incident Log
          </h6>
          <Badge bg="" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
            {recentIncidents.filter(i => i.status === 'Pending').length} Pending Investigation
          </Badge>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table striped hover responsive className="mb-0" style={{ fontSize: '0.82rem' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Site</th>
                <th style={thStyle}>Incident Type</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Severity</th>
                <th style={thStyle}>Worker</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((inc) => {
                const sevStyle = severityColors[inc.severity];
                const statStyle = statusColors[inc.status];
                return (
                  <tr key={inc.id} style={inc.severity === 'High' ? { background: 'rgba(239,68,68,0.03)' } : {}}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>{inc.id}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{formatDate(inc.date)}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>{inc.site}</td>
                    <td style={tdStyle}>{inc.type}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: sevStyle.bg,
                        color: sevStyle.text,
                        border: `1px solid ${sevStyle.border}`
                      }}>
                        {inc.severity}
                      </span>
                    </td>
                    <td style={tdStyle}>{inc.worker}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: statStyle.bg,
                        color: statStyle.text
                      }}>
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      {/* ── Daily Safety Checklist ── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h6 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Daily Safety Checklist
            </h6>
            <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
              As of today · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div style={{
            background: parseInt(checklistPercent) === 100 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
            color: parseInt(checklistPercent) === 100 ? '#16a34a' : '#d97706',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            {completedChecks}/{dailyChecklist.length} Completed ({checklistPercent}%)
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '16px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${checklistPercent}%`,
            background: parseInt(checklistPercent) === 100 ? '#22c55e' : 'linear-gradient(90deg, #f59e0b, #22c55e)',
            borderRadius: '3px',
            transition: 'width 0.5s ease'
          }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
          {dailyChecklist.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: item.completed ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
                border: `1px solid ${item.completed ? '#d1fae5' : '#fecaca'}`,
                borderRadius: '8px',
                fontSize: '0.82rem'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: item.completed ? '#22c55e' : '#ef4444',
                color: '#fff',
                flexShrink: 0,
                fontSize: '0.7rem'
              }}>
                {item.completed ? <FiCheck size={13} /> : <FiX size={13} />}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.item}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SafetyIncidentTracker;
