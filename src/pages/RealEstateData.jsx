import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import ExcelDataViewer from '../components/ExcelDataViewer';
import AIAnalysis from '../components/AIAnalysis';
import dashboardData from '../data/dashboardData.json';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const RealEstateData = () => {
  const { realEstateAnalytics } = dashboardData;
  const sheetNames = Object.keys(realEstateAnalytics);
  const [activeTab, setActiveTab] = useState(sheetNames[0] || '');

  // Analytics for Real Estate
  const analytics = useMemo(() => {
    const valuationSheet = (realEstateAnalytics['1. Valuation & Pricing'] || []).filter(row => Object.keys(row).length > 2);
    const dataRows = valuationSheet.filter(row => row['__EMPTY_2'] !== undefined && typeof row['__EMPTY_2'] === 'number');

    const avgPrice = dataRows.reduce((acc, curr) => acc + (Number(curr['__EMPTY_1'] || 0)), 0) / (dataRows.length || 1);
    const avgYield = dataRows.reduce((acc, curr) => acc + (Number(curr['__EMPTY_2'] || 0)), 0) / (dataRows.length || 1);

    const topYieldLabels = dataRows.slice(0, 5).map(v => v['DATA ANALYTICS IN REAL ESTATE - VALUATION & PRICING'] || 'Unknown');
    const topYieldData = dataRows.slice(0, 5).map(v => Number(v['__EMPTY_2'] || 0));

    return {
      avgPricePerSqFt: avgPrice > 0 ? avgPrice.toLocaleString('en-IN') : '24,500',
      avgYield: avgYield > 0 ? avgYield.toFixed(2) : '3.8',
      yieldChartData: {
        labels: topYieldLabels.length > 0 ? topYieldLabels : ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'],
        datasets: [{
          label: 'Rental Yield (%)',
          data: topYieldData.length > 0 ? topYieldData : [2.5, 3.2, 4.1, 3.8, 4.5],
          backgroundColor: 'var(--emerald)',
          borderRadius: 8,
          barThickness: 24,
          hoverBackgroundColor: 'var(--emerald-glow)'
        }]
      }
    };
  }, [realEstateAnalytics]);

  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
      <div className="mb-4 d-flex justify-content-between align-items-end fade-in-up">
        <div>
          <div 
            className="mb-2 px-3 py-1 rounded-pill d-inline-block" 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              backgroundColor: 'rgba(5, 150, 105, 0.1)', 
              color: 'var(--emerald)',
              border: '1px solid var(--emerald-glow)'
            }}
          >
            MARKET INTELLIGENCE
          </div>
          <h2 style={{ fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Real Estate Market Insights</h2>
          <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>Dynamic market analysis and raw sheet data</p>
        </div>
      </div>

      {/* AI Analysis Integration */}
      <AIAnalysis 
        industry="real-estate" 
        data={{
          marketYield: analytics.avgYield,
          avgPrice: analytics.avgPricePerSqFt,
          valuationSamples: realEstateAnalytics['1. Valuation & Pricing']?.slice(0, 5),
          demandTrends: realEstateAnalytics['5. Demand & Absorption']?.slice(0, 5)
        }} 
      />

      <Row className="g-4 mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Col md={3}>
          <div className="glass-card p-4 h-100">
            <h6 style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em' }}>Avg Market Yield</h6>
            <h2 style={{ fontWeight: '800', color: 'var(--emerald)' }}>{analytics.avgYield}%</h2>
            <div className="mt-2" style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--emerald)' }}>↑ 0.4% from Last Year</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="glass-card p-4 h-100">
            <h6 style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em' }}>Avg Price/SqFt</h6>
            <h2 style={{ fontWeight: '800', color: 'var(--text-primary)' }}>₹ {analytics.avgPricePerSqFt}</h2>
            <div className="mt-2" style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Tier 1 & 2 Composite</div>
          </div>
        </Col>
        <Col md={6}>
          <div className="glass-card p-4 h-100">
            <h6 style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '24px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em' }}>Yield Comparisons (Top Locations)</h6>
            <div style={{ height: '140px' }}>
              <Bar 
                data={analytics.yieldChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } },
                  scales: { 
                    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: 'var(--text-tertiary)' } },
                    y: { grid: { color: 'var(--border-light)' }, ticks: { font: { size: 11 }, color: 'var(--text-tertiary)', callback: (v) => v + '%' } } 
                  }
                }} 
              />
            </div>
          </div>
        </Col>
      </Row>

      <div className="glass-card overflow-hidden fade-in-up" style={{ animationDelay: '0.2s', border: '1px solid var(--border-light)' }}>
        <Tabs
          id="real-estate-data-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="admin-tabs px-3 pt-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-light)' }}
        >
          {sheetNames.map(name => (
            <Tab eventKey={name} title={name.split('. ').pop()} key={name}>
              <div className="p-4">
                <ExcelDataViewer data={realEstateAnalytics[name]} title={name} />
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>

      <style>
        {`
          .admin-tabs .nav-link {
            border: none !important;
            color: var(--text-tertiary) !important;
            font-weight: 700;
            font-size: 0.9rem;
            padding: 16px 24px !important;
            transition: all 0.3s var(--ease-out-expo);
            border-bottom: 3px solid transparent !important;
            background: transparent !important;
          }
          .admin-tabs .nav-link.active {
            color: var(--emerald) !important;
            border-bottom: 3px solid var(--emerald) !important;
          }
          .admin-tabs .nav-link:hover:not(.active) {
            color: var(--text-primary) !important;
            background-color: var(--surface-hover) !important;
          }
          .nav-tabs { 
            border-bottom: none !important; 
            flex-wrap: nowrap !important;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .nav-tabs::-webkit-scrollbar { display: none; }
        `}
      </style>
    </Container>
  );
};

export default RealEstateData;
