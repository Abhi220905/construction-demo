import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { MOCK_REPORTS } from '../data/mockData';
import { FiAlertCircle, FiCheckCircle, FiClock, FiCloudRain, FiFile } from 'react-icons/fi';

const iconMap = {
  'Safety Incident': <FiAlertCircle size={20} color="var(--rose)" />,
  'Progress Update': <FiCheckCircle size={20} color="var(--emerald)" />,
  'Material Shortage': <FiClock size={20} color="var(--amber)" />,
  'Weather Delay': <FiCloudRain size={20} color="#0ea5e9" />,
  'Inspection': <FiFile size={20} color="var(--electric-bright)" />,
};

const Reports = () => {
  const latestReports = MOCK_REPORTS.slice(0, 10);
  
  // Reports by Type
  const typeCounts = MOCK_REPORTS.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(typeCounts),
    datasets: [{
      label: 'Filed Reports',
      data: Object.values(typeCounts),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    }]
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { display: false } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <Container fluid className="p-4 pt-5">
      <div className="mb-4">
        <h2 style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Site Reports</h2>
        <p style={{ color: 'var(--text-tertiary)' }}>Total {MOCK_REPORTS.length} reports logged in the system.</p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={5}>
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4" style={{ color: 'var(--text-primary)' }}>Reports by Type</h5>
            <div style={{ height: '300px' }}>
              <Bar options={chartOptions} data={barData} />
            </div>
          </div>
        </Col>
        <Col md={7}>
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4" style={{ color: 'var(--text-primary)' }}>Recent Logs</h5>
            <div className="d-flex flex-column gap-3" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {latestReports.map(report => (
                <div key={report.id} className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      {iconMap[report.type]}
                      <h6 className="m-0" style={{ color: 'var(--text-primary)' }}>{report.title}</h6>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{report.date}</span>
                  </div>
                  <div className="d-flex gap-3 mt-2" style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>By: <span style={{ color: 'var(--text-primary)' }}>{report.author}</span></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Severity: <span style={{ color: report.severity === 'High' ? 'var(--rose)' : 'var(--text-primary)' }}>{report.severity}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
