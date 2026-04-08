import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Bar } from 'react-chartjs-2';
import { MOCK_SITES } from '../data/mockData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Sites = () => {
  // Aggregate data for Chart
  const statusCounts = MOCK_SITES.reduce((acc, site) => {
    acc[site.status] = (acc[site.status] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      label: 'Number of Sites',
      data: Object.values(statusCounts),
      backgroundColor: ['#3b82f6', '#f59e0b', '#e11d48'],
    }]
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <Container fluid className="p-4 pt-5">
      <div className="mb-4">
        <h2 style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Sites & Maps</h2>
        <p style={{ color: 'var(--text-tertiary)' }}>Geographical distribution of all {MOCK_SITES.length} sites.</p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={8}>
          <div className="glass-card p-3 h-100" style={{ minHeight: '500px' }}>
            <MapContainer center={[22.0, 72.0]} zoom={6} style={{ height: '100%', width: '100%', borderRadius: '10px' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-tiles-dark"
              />
              {MOCK_SITES.map((site) => (
                <Marker key={site.id} position={[site.lat, site.lng]}>
                  <Popup>
                    <strong>{site.name}</strong><br/>
                    Status: {site.status}<br/>
                    Progress: {site.progress}%<br/>
                    Workers: {site.workersAssigned}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Col>
        <Col md={4}>
          <div className="glass-card p-4 h-100 d-flex flex-column">
            <h5 className="mb-4" style={{ color: 'var(--text-primary)' }}>Site Status Overview</h5>
            <div className="flex-grow-1" style={{ minHeight: '200px' }}>
              <Bar options={chartOptions} data={barData} />
            </div>
            <div className="mt-4">
              <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Top Active Sites</h5>
              {MOCK_SITES.filter(s => s.status === 'Active').sort((a,b) => b.progress - a.progress).slice(0,4).map(site => (
                <div key={site.id} className="d-flex justify-content-between mb-2 pb-2 border-bottom border-secondary">
                  <span style={{ color: 'var(--text-secondary)' }}>{site.name}</span>
                  <span style={{ color: 'var(--emerald)' }}>{site.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Sites;
