import React from 'react';
import { Container } from 'react-bootstrap';
import LegalComplianceCalendar from '../components/LegalComplianceCalendar';

const Compliance = () => (
  <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
    <LegalComplianceCalendar />
  </Container>
);

export default Compliance;
