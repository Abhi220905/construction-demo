import React, { useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Doughnut, Line } from 'react-chartjs-2';
import { MOCK_WORKERS } from '../data/mockData';

const Workers = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Role Distribution
  const roleCounts = MOCK_WORKERS.reduce((acc, w) => {
    acc[w.role] = (acc[w.role] || 0) + 1;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(roleCounts),
    datasets: [{
      data: Object.values(roleCounts),
      backgroundColor: ['#3b82f6', '#f59e0b', '#e11d48', '#059669', '#7c3aed', '#0ea5e9'],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: '#94a3b8' }, position: 'right' } }
  };

  const paginatedWorkers = MOCK_WORKERS.slice((page-1)*itemsPerPage, page*itemsPerPage);
  const totalPages = Math.ceil(MOCK_WORKERS.length / itemsPerPage);

  return (
    <Container fluid className="p-4 pt-5">
      <div className="mb-4">
        <h2 style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Workers Directory</h2>
        <p style={{ color: 'var(--text-tertiary)' }}>Managing {MOCK_WORKERS.length} personnel across all sites.</p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4" style={{ color: 'var(--text-primary)' }}>Roles Distribution</h5>
            <div style={{ height: '250px' }}>
              <Doughnut options={chartOptions} data={doughnutData} />
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4" style={{ color: 'var(--text-primary)' }}>Personnel Directory</h5>
            <Table responsive hover variant="dark" className="align-middle mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr>
                  <th style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>Name</th>
                  <th style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>Role</th>
                  <th style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>Site ID</th>
                  <th style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>Attendance</th>
                  <th style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWorkers.map(w => (
                  <tr key={w.id}>
                    <td style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-glass)' }}>{w.name}</td>
                    <td style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-glass)' }}>{w.role}</td>
                    <td style={{ color: 'var(--electric-bright)', borderBottom: '1px solid var(--border-glass)' }}>Site {w.siteId}</td>
                    <td style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-glass)' }}>{w.attendance}%</td>
                    <td style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <span className={`status-badge ₹{w.status === 'On Site' ? 'active' : 'warning'}`}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button 
                className="btn btn-sm btn-outline-light" 
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
              >Previous</button>
              <span style={{ color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
              <button 
                className="btn btn-sm btn-outline-light" 
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
              >Next</button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Workers;
