import React from 'react';
import { Container } from 'react-bootstrap';
import SubcontractorPaymentTracker from '../components/SubcontractorPaymentTracker';

const SubcontractorPayments = () => (
  <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
    <SubcontractorPaymentTracker />
  </Container>
);

export default SubcontractorPayments;
