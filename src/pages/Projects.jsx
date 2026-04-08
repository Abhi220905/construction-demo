import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Nav, Tab, ProgressBar, Modal, Button } from 'react-bootstrap';
import { FiMapPin, FiCalendar, FiDollarSign, FiUser, FiArrowRight, FiInfo } from 'react-icons/fi';
import projectsData from '../data/projectsData.json';

const Projects = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const tabs = ['all', 'current', 'completed', 'upcoming'];
  
  const getFilteredProjects = () => {
    if (activeTab === 'all') {
      return [...projectsData.current, ...projectsData.completed, ...projectsData.upcoming];
    }
    return projectsData[activeTab];
  };

  const renderProjectCard = (project) => (
    <Card className="glass-card h-100 overflow-hidden" style={{ border: '1px solid var(--border-light)' }}>
      <div style={{ 
        height: '160px', 
        backgroundImage: `url(${project.image})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative',
        backgroundColor: '#e2e8f0'
      }}>
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <Badge bg={project.status === 'Completed' ? 'success' : project.status === 'Planning' ? 'info' : 'primary'} style={{ fontSize: '10px', padding: '5px 10px', borderRadius: '6px', border: 'none' }}>
            {project.status}
          </Badge>
        </div>
      </div>
      <Card.Body className="p-4">
        <h5 className="mb-2" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{project.name}</h5>
        <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          <FiMapPin size={14} color="var(--electric)" />
          <span>{project.location}</span>
        </div>
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)' }}>
            <span>PROGRESS</span>
            <span>{project.progress}%</span>
          </div>
          <ProgressBar now={project.progress} variant={project.progress === 100 ? 'success' : 'primary'} style={{ height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.05)' }} />
        </div>
        <Row className="g-3 mb-4">
          <Col xs={6}>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '4px' }}>BUDGET</div>
            <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 700 }}>{project.budget}</div>
          </Col>
          <Col xs={6}>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '4px' }}>SITE LEAD</div>
            <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 700 }}>{project.manager}</div>
          </Col>
        </Row>
        <button onClick={() => handleShowDetails(project)} className="w-100 d-flex align-items-center justify-content-center gap-2" style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--electric)', fontSize: '12.5px', fontWeight: 700 }}>
          View Details <FiArrowRight size={14} />
        </button>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="p-4 pt-5" style={{ background: 'var(--surface-primary)', minHeight: '100vh' }}>
      <div className="mb-4">
        <h2 style={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Project Lifecycle Portfolio</h2>
        <p style={{ color: 'var(--text-tertiary)' }}>Historical audit and forecast planning for all construction assets</p>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav className="mb-4 p-1 glass-card shadow-sm" style={{ width: 'fit-content', border: 'none', gap: '4px', background: 'white', borderRadius: '12px' }}>
          {tabs.map(key => (
            <Nav.Item key={key}>
              <Nav.Link eventKey={key} style={{ padding: '8px 24px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, transition: 'all 0.2s', background: activeTab === key ? 'var(--electric)' : 'transparent', color: activeTab === key ? 'white' : 'var(--text-tertiary)', border: 'none', textTransform: 'capitalize' }}>
                {key} Projects
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey={activeTab}>
            <Row className="g-4">
              {getFilteredProjects().map(p => (
                <Col xl={4} md={6} key={p.id}>
                  {renderProjectCard(p)}
                </Col>
              ))}
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {selectedProject && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered style={{ backdropFilter: 'blur(10px)' }}>
          <Modal.Header closeButton className="border-0 p-4 pb-0">
            <Modal.Title style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '22px' }}>{selectedProject.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 p-md-5">
            <Row className="g-4">
              <Col md={12}>
                <div style={{ height: '260px', backgroundImage: `url(${selectedProject.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '20px', marginBottom: '24px', boxShadow: 'var(--shadow-lg)' }} />
              </Col>
              <Col md={8}>
                <h6 className="text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px' }}>Project Overview</h6>
                <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{selectedProject.description}</p>
                <div className="mt-4 p-4 bg-light rounded-4 d-flex align-items-center gap-4 border">
                  <FiInfo size={28} color="var(--electric)" />
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)' }}>CURRENT STATUS</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedProject.status === 'Completed' ? 'Operations & Handover' : 'Structural Systems (Active)'}</div>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-4 border rounded-4 mb-4 bg-white shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiDollarSign size={18} color="var(--emerald)" />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>TOTAL COST</span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{selectedProject.budget}</div>
                </div>
                <div className="p-4 border rounded-4 mb-4 bg-white shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiUser size={18} color="var(--electric)" />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>MANAGER</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{selectedProject.manager}</div>
                </div>
                <div className="p-4 border rounded-4 bg-white shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiCalendar size={18} color="var(--amber)" />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>COMPLETION</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{selectedProject.end_date}</div>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default Projects;
