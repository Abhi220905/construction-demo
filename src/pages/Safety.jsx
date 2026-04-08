import React from 'react';
import { Container } from 'react-bootstrap';
import SafetyIncidentTracker from '../components/SafetyIncidentTracker';

const Safety = () => (
  <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
    <SafetyIncidentTracker />
  </Container>
);

export default Safety;
