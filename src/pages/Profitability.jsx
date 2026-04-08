import React from 'react';
import { Container } from 'react-bootstrap';
import ProfitabilityAnalyzer from '../components/ProfitabilityAnalyzer';

const Profitability = () => (
  <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
    <ProfitabilityAnalyzer />
  </Container>
);

export default Profitability;
