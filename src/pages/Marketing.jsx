import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import ExcelDataViewer from '../components/ExcelDataViewer';
import dashboardData from '../data/dashboardData.json';

const Marketing = () => {
  // Ordered channels to match the intended report layout
  const channels = [
    'Referral Program', 
    'Exhibition', 
    'Broker Incentives', 
    'Newspaper', 
    'Hoardings', 
    'Digital Ads'
  ];

  // Extract Marketing Data specifically grouping by Channel
  const channelData = {};
  dashboardData.marketingSpend.forEach(row => {
    // Robust normalization for casing/spacing if needed
    const channelName = row.Channel ? row.Channel.trim() : 'Unknown';
    if (!channelData[channelName]) {
      channelData[channelName] = { costPerConv: [], convRate: [] };
    }
    channelData[channelName].costPerConv.push(row.Cost_Per_Conversion || 0);
    channelData[channelName].convRate.push(row['Conversion_Rate_%'] || 0);
  });

  const getAverage = (arr) => arr.length ? arr.reduce((a,b)=>a+b, 0) / arr.length : 0;
  
  const avgCosts = channels.map(c => channelData[c] ? getAverage(channelData[c].costPerConv) : 0);
  const avgRates = channels.map(c => channelData[c] ? getAverage(channelData[c].convRate) : 0);

  // Map exact colors to mimic image
  const costColors = channels.map(c => {
    if (c.includes('Referral') || c.includes('Broker')) return '#22c55e'; // Green
    if (c.includes('Exhibition') || c.includes('Digital')) return '#f59e0b'; // Orange
    return '#ef4444'; // Red (Newspaper/Hoardings)
  });

  const chartOptionsCommon = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  const costDataConfig = {
    labels: channels.map(c => c.split(' ')[0]), // Shorten labels for horizontal display (Referral, Broker, etc.)
    datasets: [{
      data: avgCosts,
      backgroundColor: costColors,
      barPercentage: 0.7,
      borderRadius: 4
    }]
  };

  const costOptions = {
    ...chartOptionsCommon,
    indexAxis: 'y', // Makes it Horizontal
    scales: {
      x: { 
        grid: { color: 'rgba(0,0,0,0.04)' }, 
        ticks: { color: '#64748b', font: { size: 11 } } 
      },
      y: { 
        grid: { display: false }, 
        ticks: { color: '#475569', font: { weight: '600', size: 11 } } 
      }
    }
  };

  const rateDataConfig = {
    labels: channels.map(c => c.split(' ')[0]),
    datasets: [{
      data: avgRates,
      backgroundColor: '#2563eb', // All blue matching Satyamev theme highlights
      barPercentage: 0.6,
      borderRadius: 4
    }]
  };

  const rateOptions = {
    ...chartOptionsCommon,
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { color: '#64748b', font: { size: 11 } } 
      },
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)' }, 
        ticks: { color: '#64748b', font: { size: 11 } } 
      }
    }
  };

  return (
    <Container fluid className="p-4 pt-5" style={{ background: 'var(--surface-primary)', minHeight: '100vh' }}>
      <div className="mb-4">
        <h2 style={{ fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Marketing & Acquisitions</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Analyze channel performance, conversion costs, and lead metrics</p>
      </div>

      <Row className="g-4 mb-5">
        <Col md={6}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-slate-400 text-uppercase mb-4" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px' }}>Cost Per Conversion by Channel (₹)</h6>
            <div style={{ height: '320px' }}>
              <Bar data={costDataConfig} options={costOptions} />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="glass-card p-4 h-100">
            <h6 className="text-slate-400 text-uppercase mb-4" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px' }}>Conversion Rate by Channel (%)</h6>
            <div style={{ height: '320px' }}>
              <Bar data={rateDataConfig} options={rateOptions} />
            </div>
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <ExcelDataViewer data={dashboardData.marketingSpend} title="Channel Deployment Raw Data" />
      </div>
    </Container>
  );
};

export default Marketing;
