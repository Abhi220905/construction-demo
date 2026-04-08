import React from 'react';
import { Container } from 'react-bootstrap';
import EquipmentTracker from '../components/EquipmentTracker';

const Equipment = () => (
  <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
    <EquipmentTracker />
  </Container>
);

export default Equipment;
