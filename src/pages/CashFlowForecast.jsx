import React from 'react';
import { Container } from 'react-bootstrap';
import CashFlowProjection from '../components/CashFlowProjection';

const CashFlowForecast = () => (
  <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
    <CashFlowProjection />
  </Container>
);

export default CashFlowForecast;
