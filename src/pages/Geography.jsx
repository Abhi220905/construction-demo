import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Table } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import OwnerMorningBrief from '../components/Dashboard/OwnerMorningBrief';
import AIAnalysis from '../components/AIAnalysis';
import SmartAlertEngine from '../components/SmartAlertEngine';
import kpiData from '../data/constructionKpiData.json';

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    projectName: 'Aravali Business Park, Phase-II',
    country: 'India',
    state: 'Haryana',
    city: 'Gurugram',
    lat: 28.4595,
    lng: 77.0266,
    complianceStatus: 'Compliant'
  },
  {
    id: 2,
    projectName: 'Skyline Heights Residency',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    complianceStatus: 'Pending'
  },
  {
    id: 3,
    projectName: 'Metro Plaza Commercial Center',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Noida',
    lat: 28.5355,
    lng: 77.3910,
    complianceStatus: 'Compliant'
  },
  {
    id: 4,
    projectName: 'Sunrise Towers',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    lat: 19.0760,
    lng: 72.8777,
    complianceStatus: 'Issue'
  },
  {
    id: 5,
    projectName: 'Green Valley Apartments',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    lat: 12.9716,
    lng: 77.5946,
    complianceStatus: 'Compliant'
  },
  {
    id: 6,
    projectName: 'Ocean View Condos',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
    complianceStatus: 'Pending'
  },
  // Gujarat Ahmedabad Projects
  {
    id: 7,
    projectName: 'Ahmedabad Central Mall',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    complianceStatus: 'Compliant'
  },
  {
    id: 8,
    projectName: 'Gujarat Tech Park',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    lat: 23.0300,
    lng: 72.5800,
    complianceStatus: 'Compliant'
  },
  {
    id: 9,
    projectName: 'Sabarmati Riverfront Development',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    lat: 23.0600,
    lng: 72.5800,
    complianceStatus: 'Pending'
  },
  {
    id: 10,
    projectName: 'Ahmedabad Metro Station Complex',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    lat: 23.0400,
    lng: 72.5600,
    complianceStatus: 'Issue'
  },
  {
    id: 11,
    projectName: 'GIFT City Phase III',
    country: 'India',
    state: 'Gujarat',
    city: 'Gandhinagar',
    lat: 23.1600,
    lng: 72.6400,
    complianceStatus: 'Compliant'
  }
];

const Geography = ({ projects = mockProjects }) => {
  const [filters, setFilters] = useState({
    country: 'India',
    state: '',
    city: ''
  });

  // Get unique values for dropdowns
  const countries = useMemo(() => [...new Set(projects.map(p => p.country))], [projects]);
  const states = useMemo(() => {
    const filtered = projects.filter(p => !filters.country || p.country === filters.country);
    return [...new Set(filtered.map(p => p.state))];
  }, [projects, filters.country]);
  const cities = useMemo(() => {
    const filtered = projects.filter(p =>
      (!filters.country || p.country === filters.country) &&
      (!filters.state || p.state === filters.state)
    );
    return [...new Set(filtered.map(p => p.city))];
  }, [projects, filters.country, filters.state]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      (!filters.country || p.country === filters.country) &&
      (!filters.state || p.state === filters.state) &&
      (!filters.city || p.city === filters.city)
    );
  }, [projects, filters]);

  // KPI calculations
  const kpis = useMemo(() => {
    const total = filteredProjects.length;
    const compliant = filteredProjects.filter(p => p.complianceStatus === 'Compliant').length;
    const pending = filteredProjects.filter(p => p.complianceStatus === 'Pending').length;
    const issues = filteredProjects.filter(p => p.complianceStatus === 'Issue').length;
    return { total, compliant, pending, issues };
  }, [filteredProjects]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'country' && { state: '', city: '' }),
      ...(field === 'state' && { city: '' })
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Compliant': return '#059669';
      case 'Pending': return '#f59e0b';
      case 'Issue': return '#e11d48';
      default: return '#64748b';
    }
  };

  const heatmapData = useMemo(() => {
    const counts = {};
    filteredProjects.forEach(project => {
      counts[project.city] = (counts[project.city] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([city, value]) => ({ city, value }));
  }, [filteredProjects]);

  const maxHeatValue = heatmapData[0]?.value || 1;
  const getHeatColor = (value) => {
    const ratio = value / maxHeatValue;
    if (ratio >= 0.8) return '#dc2626';
    if (ratio >= 0.55) return '#f97316';
    if (ratio >= 0.3) return '#facc15';
    return '#34d399';
  };

  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh', backgroundColor: 'var(--surface-primary)' }}>
      <div className="mb-4 fade-in-up">
        <h2 style={{ color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '-0.02em' }}>Geography Dashboard</h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>Geographic overview of construction projects and compliance status</p>
      </div>

      {/* Owner Morning Brief — geography-focused briefing */}
      {/* <div className="fade-in-up">
        <OwnerMorningBrief />
      </div> */}

      {/* AI Analysis Integration for Geography */}
      <AIAnalysis
        industry="construction"
        data={{
          project: filteredProjects.length > 0 ? filteredProjects[0].projectName : "Multiple Projects",
          completion: kpis.compliant / kpis.total * 100,
          budgetUsage: 75, // Mock data
          criticalKpis: [
            { name: 'Compliance Rate', value: `${((kpis.compliant / kpis.total) * 100).toFixed(1)}%`, status: kpis.compliant / kpis.total > 0.7 ? 'Good' : 'Critical' },
            { name: 'Projects at Risk', value: kpis.issues, status: kpis.issues > 0 ? 'Critical' : 'Good' }
          ]
        }}
      />

      {/* Smart Alert Engine — geography-specific alerts */}
      {/* <div className="fade-in-up" style={{ animationDelay: '0.05s' }}>
        <SmartAlertEngine />
      </div> */}

      {/* Filters and KPI Cards Row */}
      <Row className="mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Col xl={7} lg={8}>
          <Card className="bg-white rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
            <Card.Body className="p-4">
              <h5 className="mb-3" style={{ color: '#0f172a', fontWeight: '700' }}>Location Filters</h5>
              <Row className="gy-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Country</Form.Label>
                    <Form.Select
                      value={filters.country}
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                      style={{ borderRadius: '14px', borderColor: '#e2e8f0', minHeight: '48px', backgroundColor: '#f8fafc' }}
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>State</Form.Label>
                    <Form.Select
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                      disabled={!filters.country}
                      style={{ borderRadius: '14px', borderColor: '#e2e8f0', minHeight: '48px', backgroundColor: '#f8fafc' }}
                    >
                      <option value="">All States</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>City</Form.Label>
                    <Form.Select
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      disabled={!filters.state}
                      style={{ borderRadius: '14px', borderColor: '#e2e8f0', minHeight: '48px', backgroundColor: '#f8fafc' }}
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={5} lg={4}>
          <Row className="g-3">
            <Col xs={12}>
              <Card className="bg-white rounded shadow-sm" style={{ border: '1px solid #e2e8f0', minHeight: '138px' }}>
                <Card.Body className="p-4 d-flex flex-column justify-content-center">
                  <p className="mb-2" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Total Projects</p>
                  <h2 className="mb-0" style={{ fontWeight: '800', color: '#0f172a' }}>{kpis.total}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Row className="g-3">
                <Col xs={4}>
                  <Card className="bg-white rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                    <Card.Body className="p-3 text-center">
                      <p className="mb-1" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Compliant</p>
                      <h4 className="mb-0" style={{ fontWeight: '800', color: '#059669' }}>{kpis.compliant}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={4}>
                  <Card className="bg-white rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                    <Card.Body className="p-3 text-center">
                      <p className="mb-1" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Pending</p>
                      <h4 className="mb-0" style={{ fontWeight: '800', color: '#f59e0b' }}>{kpis.pending}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={4}>
                  <Card className="bg-white rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                    <Card.Body className="p-3 text-center">
                      <p className="mb-1" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Issues</p>
                      <h4 className="mb-0" style={{ fontWeight: '800', color: '#e11d48' }}>{kpis.issues}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Map + Heatmap Panel */}
      <Row className="mb-4 fade-in-up" style={{ animationDelay: '0.15s' }}>
        <Col xl={6} lg={12} className="mb-3 mb-xl-0">
          <Card className="shadow-sm" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid rgba(226, 232, 240, 0.9)', backgroundColor: '#ffffff' }}>
            <Card.Body className="p-0">
              <div style={{ height: '440px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <MapContainer
                  center={[22.2587, 71.1924]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  {filteredProjects.map(project => (
                    <Marker key={project.id} position={[project.lat, project.lng]}>
                      <Popup>
                        <strong>{project.projectName}</strong><br />
                        {project.city}, {project.state}<br />
                        Status: <span style={{ color: getStatusColor(project.complianceStatus) }}>{project.complianceStatus}</span>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={12}>
          <Card className="shadow-sm" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid rgba(226, 232, 240, 0.9)', backgroundColor: '#ffffff' }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h5 className="mb-1" style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Heatmap Insights</h5>
                  <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Project density by city with compliance risk intensity.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {heatmapData.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)' }}>No heatmap data available.</div>
                ) : heatmapData.map((entry, index) => (
                  <div key={entry.city} style={{ display: 'grid', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{entry.city}</span>
                      <span style={{ fontWeight: '700', color: getHeatColor(entry.value) }}>{entry.value}</span>
                    </div>
                    <div style={{ height: '10px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                      <div style={{ width: `${(entry.value / maxHeatValue) * 100}%`, height: '100%', borderRadius: '999px', background: getHeatColor(entry.value) }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '10px' }}>Intensity Scale</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {['Low', 'Medium', 'High', 'Critical'].map((label, index) => {
                    const colors = ['#34d399', '#facc15', '#f97316', '#dc2626'];
                    return (
                      <div key={label} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '999px', background: colors[index] }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Data Table */}
      <Row className="fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Col>
          <Card className="bg-white rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
            <Card.Body className="p-4">
              <h5 className="mb-3" style={{ color: '#0f172a', fontWeight: '700' }}>Project Details</h5>
              <div style={{ overflowX: 'auto' }}>
                <Table hover responsive style={{ borderRadius: 'var(--radius-md)' }}>
                  <thead style={{ backgroundColor: 'var(--surface-muted)' }}>
                    <tr>
                      <th style={{ border: 'none', padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Project Name</th>
                      <th style={{ border: 'none', padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Country</th>
                      <th style={{ border: 'none', padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>State</th>
                      <th style={{ border: 'none', padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>City</th>
                      <th style={{ border: 'none', padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map(project => (
                      <tr key={project.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{project.projectName}</td>
                        <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{project.country}</td>
                        <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{project.state}</td>
                        <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{project.city}</td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              backgroundColor: `${getStatusColor(project.complianceStatus)}20`,
                              color: getStatusColor(project.complianceStatus),
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                            }}
                          >
                            {project.complianceStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Geography;