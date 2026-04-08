import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ExcelDataViewer from '../components/ExcelDataViewer';
import dashboardData from '../data/dashboardData.json';

const Vendors = () => {
  const [selectedProject, setSelectedProject] = useState('All');
  
  // Get unique projects from procurement data
  const projects = ['All', ...new Set(dashboardData.vendorPurchases.map(item => item.Project))];
  
  const filteredData = selectedProject === 'All' 
    ? dashboardData.vendorPurchases 
    : dashboardData.vendorPurchases.filter(item => item.Project === selectedProject);

  return (
    <Container fluid className="p-4 pt-5" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <Row className="align-items-center mb-4">
        <Col md={8}>
          <h2 style={{ fontWeight: '800', color: '#1e293b', letterSpacing: '-0.025em', margin: 0 }}>Procurement & Vendors</h2>
          <p className="text-slate-500 mb-0">Manage and filter all purchase orders across project sites</p>
        </Col>
        <Col md={4} className="text-end">
          <div className="d-inline-block text-start" style={{ minWidth: '200px' }}>
            <Form.Label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Filter by Project</Form.Label>
            <Form.Select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}
            >
              {projects.map(p => <option key={p} value={p}>{p}</option>)}
            </Form.Select>
          </div>
        </Col>
      </Row>
      
      <div style={{ minHeight: '600px' }}>
        <ExcelDataViewer data={filteredData} title={`Vendor Procurement Ledger ${selectedProject !== 'All' ? `— ${selectedProject}` : ''}`} />
      </div>
    </Container>
  );
};

export default Vendors;
