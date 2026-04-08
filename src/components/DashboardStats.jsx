import React from 'react';
import { Row, Col } from 'react-bootstrap';
import dashboardData from '../data/dashboardData.json';

const formatCurrency = (value) => {
  if (value >= 10000000) {
    return '₹' + (value / 10000000).toFixed(2) + ' Cr';
  } else if (value >= 100000) {
    return '₹' + (value / 100000).toFixed(1) + ' L';
  }
  return '₹' + value.toLocaleString('en-IN');
};

const DashboardStats = () => {
  // 1. Total Procurement
  const totalProcurement = dashboardData.vendorPurchases.reduce((acc, curr) => acc + (curr.Total_Amount || 0), 0);
  
  // 2. Price Variance Loss - usually positive variance in Project Costs
  // Filter for 'Over Budget' or similar, calculating Variance
  const priceVarianceLoss = dashboardData.projectCosts
    .filter(c => c.Variance > 0)
    .reduce((acc, curr) => acc + (curr.Variance || 0), 0);

  // 3. Idle Inventory
  const idleInventory = dashboardData.materialInventory.reduce((acc, curr) => acc + (curr.Idle_Stock_Value || 0), 0);

  // 4. Wasted Commission
  const wastedCommission = dashboardData.brokerPerformance.reduce((acc, curr) => acc + (curr.Commission_on_Cancelled || 0), 0);

  const stats = [
    { title: 'Total Procurement', value: formatCurrency(totalProcurement), sub: '', type: 'normal' },
    { title: 'Price Variance Loss', value: formatCurrency(priceVarianceLoss), sub: '↓ Recoverable', type: 'alert' },
    { title: 'Idle Inventory', value: formatCurrency(idleInventory), sub: '↓ Cash blocked', type: 'alert' },
    { title: 'Wasted Commission', value: formatCurrency(wastedCommission), sub: '↓ On cancellations', type: 'alert' },
  ];

  return (
    <Row className="g-4 mb-4">
      {stats.map((stat, idx) => (
        <Col md={3} key={idx}>
          <div 
            className="p-4 bg-white rounded shadow-sm d-flex flex-column justify-content-center"
            style={{
              height: '110px',
              borderLeft: stat.type === 'alert' ? '4px solid #ef4444' : '4px solid #e2e8f0',
              color: '#334155'
            }}
          >
            <p className="m-0 mb-1" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{stat.title}</p>
            <h3 className="m-0" style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.6rem' }}>{stat.value}</h3>
            {stat.sub && (
              <p className="m-0 mt-1" style={{ fontSize: '0.8rem', color: '#ef4444' }}>{stat.sub}</p>
            )}
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;
