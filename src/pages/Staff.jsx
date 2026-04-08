import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup } from 'react-bootstrap';
import { FiSearch, FiMail, FiCheckCircle, FiClock, FiAlertCircle, FiUser, FiBriefcase } from 'react-icons/fi';
import staffData from '../data/staffData.json';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDept, setActiveDept] = useState('All');

  const departments = ['All', ...new Set(staffData.map(s => s.dept))];

  const filteredStaff = useMemo(() => {
    return staffData.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = activeDept === 'All' || s.dept === activeDept;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, activeDept]);

  return (
    <Container fluid className="p-4 pt-5" style={{ background: 'var(--surface-primary)', minHeight: '100vh' }}>
      <div className="mb-4 fade-in-up">
        <h2 style={{ fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Workforce Directory</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage and monitor project personnel across all active sites</p>
      </div>

      {/* Filters */}
      <Row className="mb-4 g-3 fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Col lg={4}>
          <InputGroup className="glass-card" style={{ border: 'none' }}>
            <InputGroup.Text style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)' }}>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search staff by name or role..."
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col lg={8}>
          <div className="d-flex gap-2 overflow-auto pb-2">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  background: activeDept === dept ? 'var(--electric)' : 'var(--surface-card)',
                  color: activeDept === dept ? 'white' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Staff Grid */}
      <Row className="g-4">
        {filteredStaff.map((person, idx) => (
          <Col xl={3} lg={4} md={6} key={person.id} className="fade-in-up" style={{ animationDelay: `${0.1 + idx * 0.05}s` }}>
            <Card className="glass-card h-100" style={{ border: '1px solid var(--border-light)' }}>
              <Card.Body className="p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--ocean), var(--electric))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '15px'
                  }}>
                    {person.avatar}
                  </div>
                  <div>
                    <h6 className="mb-1" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{person.name}</h6>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{person.role}</span>
                  </div>
                </div>

                <div className="flex-grow-1">
                  <div className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <FiBriefcase size={14} color="var(--electric)" />
                    <span>{person.dept}</span>
                  </div>
                  <div className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <FiClock size={14} color="var(--amber)" />
                    <span>{person.experience} Exp.</span>
                  </div>
                  <div className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <FiMail size={14} color="var(--text-tertiary)" />
                    <span className="text-truncate">{person.email}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <Badge
                    bg={person.status === 'On-Site' ? 'success' : person.status === 'Available' ? 'primary' : 'warning'}
                    style={{
                      fontSize: '10px',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      background: person.status === 'On-Site' ? 'rgba(74, 222, 128, 0.1)' : person.status === 'Available' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: person.status === 'On-Site' ? '#ffffffff' : person.status === 'Available' ? '#ffffffff' : '#ffffffff',
                      border: 'none'
                    }}
                  >
                    {person.status}
                  </Badge>
                  <button style={{ border: 'none', background: 'transparent', color: 'var(--electric)', padding: 0 }}>
                    <FiUser size={16} />
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Staff;
