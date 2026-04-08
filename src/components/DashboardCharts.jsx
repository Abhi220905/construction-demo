import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import dashboardData from '../data/dashboardData.json';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const DashboardCharts = () => {
  // --- Chart 1: Project Budget vs Actual ---
  const projectMap = {};
  dashboardData.projectCosts.forEach(item => {
    if (!projectMap[item.Project]) {
      projectMap[item.Project] = { budget: 0, actual: 0 };
    }
    projectMap[item.Project].budget += (item.Budgeted_Amount || 0);
    projectMap[item.Project].actual += (item.Actual_Amount || 0);
  });
  
  const projects = Object.keys(projectMap);
  const budgets = projects.map(p => projectMap[p].budget / 10000000); // in Cr
  const actuals = projects.map(p => projectMap[p].actual / 10000000);

  const barData = {
    labels: projects,
    datasets: [
      {
        label: 'Budget',
        data: budgets,
        backgroundColor: '#3b82f6', // blue from image
        barPercentage: 0.8,
        categoryPercentage: 0.8
      },
      {
        label: 'Actual',
        data: actuals,
        backgroundColor: '#ef4444', // red from image
        barPercentage: 0.8,
        categoryPercentage: 0.8
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } }
    },
    scales: {
      x: { grid: { display: false } },
      y: { min: 0, title: { display: false } }
    }
  };

  // --- Chart 2: Delivery Status ---
  const deliveryCounts = { Delivered: 0, 'In Transit': 0, Delayed: 0 };
  dashboardData.vendorPurchases.forEach(item => {
    const status = item.Delivery_Status || 'Unknown';
    if (deliveryCounts[status] !== undefined) deliveryCounts[status]++;
    else deliveryCounts[status] = 1;
  });

  const pieData = {
    labels: ['Delivered', 'In Transit', 'Delayed'],
    datasets: [
      {
        data: [
          deliveryCounts['Delivered'] || 0,
          deliveryCounts['In Transit'] || 0,
          deliveryCounts['Delayed'] || 0
        ],
        backgroundColor: [
          '#22c55e', // Green
          '#f59e0b', // Yellow/Orange
          '#ef4444'  // Red
        ],
        borderWidth: 1,
        borderColor: '#fff'
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  return (
    <Row className="g-4">
      <Col md={7}>
        <div className="bg-white rounded p-4 shadow-sm h-100" style={{ border: '1px solid #e2e8f0', minHeight: '350px' }}>
          <h6 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>Project Budget vs Actual (₹ Cr)</h6>
          <div style={{ height: '250px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </Col>
      <Col md={5}>
        <div className="bg-white rounded p-4 shadow-sm h-100" style={{ border: '1px solid #e2e8f0', minHeight: '350px', position: 'relative' }}>
          <h6 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>Delivery Status</h6>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
          
          {/* Custom Labels to somewhat mimic the image style */}
          <div style={{ position: 'absolute', top: '100px', left: '10%', color: '#22c55e', fontSize: '0.85rem' }}>
            Delivered: {deliveryCounts['Delivered']}
          </div>
          <div style={{ position: 'absolute', bottom: '60px', left: '20%', color: '#f59e0b', fontSize: '0.85rem' }}>
            In Transit: {deliveryCounts['In Transit']}
          </div>
          <div style={{ position: 'absolute', top: '160px', right: '10%', color: '#ef4444', fontSize: '0.85rem' }}>
            Delayed: {deliveryCounts['Delayed']}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default DashboardCharts;
