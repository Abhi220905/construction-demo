import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import dashboardData from '../data/dashboardData.json';
import CashFlowProjection from '../components/CashFlowProjection';

// Helper to convert excel sequential date integer to JS Date
const excelDateToJSDate = (excelDate) => {
  return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
};

const Forecast = () => {
  // Aggregate Historical Sales Data (Grouping by Month-Year)
  const monthlyRevenue = {};
  dashboardData.salesBookings.forEach(booking => {
    if (booking.Unit_Value && booking.Date) {
      let d;
      if (typeof booking.Date === 'number') {
        d = excelDateToJSDate(booking.Date);
      } else {
        d = new Date(booking.Date); // fallback if standard string
      }
      
      if (!isNaN(d.getTime())) {
        const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' }).replace(' ', '-');
        monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (booking.Unit_Value / 10000000); // Cr
      }
    }
  });

  // Since static data might be sparse or tightly grouped, we construct the sequence
  // mimicking the image line shape with historical and forecast values
  const allLabels = ['Jan-24', 'Feb-24', 'Mar-24', 'Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25'];
  
  const historicalData = [];
  const forecastData = [];

  allLabels.forEach((label, i) => {
    // Inject real aggregated numbers if they exist, otherwise blend into the mock smooth curve
    const actual = monthlyRevenue[label];
    
    // The curve presented is approx 18 -> 22 -> 27 -> 20 -> 19 -> 17 -> 20 -> 19 -> 17 -> 12
    const mockHistSequence = [19, 23, 27, 21, 20, 17, 19, 18, 16, 12, null, null, null];
    const mockForeSequence = [null, null, null, null, null, null, null, null, null, 12, 14, 13, 12];

    if (i < 10) {
      // It's a historical month
      historicalData.push(actual || mockHistSequence[i]);
      forecastData.push(null);
    } else {
      // It's a forecast month
      historicalData.push(null);
      forecastData.push(mockForeSequence[i]);
    }
  });
  
  // Overlap the boundary node linking the two lines
  historicalData[9] = 12; 
  forecastData[9] = 12;

  const lineData = {
    labels: allLabels,
    datasets: [
      {
        label: 'Historical',
        data: historicalData,
        borderColor: '#3b82f6', // Solid Blue
        backgroundColor: '#ffffff',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.4, // Smooth curve
        fill: false,
      },
      {
        label: 'Forecast',
        data: forecastData,
        borderColor: '#ef4444', // Red
        borderWidth: 2,
        borderDash: [5, 5], // Dashed
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#ef4444',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.4,
        fill: false,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45, color: '#94a3b8' } },
      y: { min: 0, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#64748b' } }
    }
  };

  // Trend Cards data exactly as in the image
  const cards = [
    { title: 'Trend', value: 'Declining', sub: '₹1.19 Cr/month', border: '#eab308', titleColor: '#a16207' }, // Yellow
    { title: 'Q1 2025 Projected', value: '₹37.5 Cr', sub: '~43 bookings', border: '#3b82f6', titleColor: '#1d4ed8' }, // Blue
    { title: 'Revenue at Risk', value: '₹3.0 Cr', sub: 'From cancellations', border: '#ef4444', titleColor: '#b91c1c' } // Red
  ];

  return (
    <Container fluid className="p-4 pt-5" style={{ minHeight: '100vh' }}>
      <div className="mb-4">
        <h2 style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Financial Forecasts</h2>
        <p style={{ color: '#64748b' }}>Consolidated Sales projections and 90-Day Cash Flow analysis</p>
      </div>

      {/* Cash Flow Forecast Integrated */}
      <div className="mb-5">
        <CashFlowProjection />
      </div>

      <div className="bg-white rounded p-4 shadow-sm mb-4" style={{ border: '1px solid #e2e8f0', minHeight: '400px' }}>
        <h6 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Sales Revenue Forecast (₹ Cr)</h6>
        <div style={{ height: '300px' }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <Row className="g-4">
        {cards.map((card, i) => (
          <Col md={4} key={i}>
            <div 
              className="bg-white rounded p-3 shadow-sm d-flex flex-column h-100" 
              style={{
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${card.border}`,
                backgroundColor: i === 0 ? '#fefce8' : i === 1 ? '#eff6ff' : '#fef2f2'
              }}
            >
              <p className="m-0 mb-1" style={{ fontSize: '0.85rem', color: '#64748b' }}>{card.title}</p>
              <h4 className="m-0" style={{ fontWeight: '700', color: card.titleColor }}>{card.value}</h4>
              <p className="m-0 mt-1" style={{ fontSize: '0.85rem', color: '#475569' }}>{card.sub}</p>
            </div>
          </Col>
        ))}
      </Row>

      {/* Revenue at Risk Breakdown */}
      <div className="bg-white rounded p-4 shadow-sm mt-4" style={{ border: '1px solid #e2e8f0' }}>
        <h6 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#ef4444' }}>⚠</span> Revenue at Risk — Detailed Breakdown
        </h6>
        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '10px 12px', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '10px 12px', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'left' }}>Details</th>
              <th style={{ padding: '10px 12px', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Amount (₹)</th>
              <th style={{ padding: '10px 12px', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>Impact</th>
            </tr>
          </thead>
          <tbody>
            {[
              { category: 'Cancelled Bookings', details: '5 units across Sunrise Heights & Green Valley', amount: 18500000, impact: 'High' },
              { category: 'Delayed Collections', details: '12 buyers with overdue milestone payments (>30 days)', amount: 8200000, impact: 'Medium' },
              { category: 'Disputed Amounts', details: '2 buyer disputes on carpet area measurement', amount: 3300000, impact: 'Medium' },
              { category: 'Pending Registration', details: '4 units with delayed registration agreement', amount: 5800000, impact: 'Low' },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{row.category}</td>
                <td style={{ padding: '12px', color: '#475569' }}>{row.details}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#dc2626', textAlign: 'right' }}>
                  ₹{(row.amount / 100000).toFixed(1)}L
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                    background: row.impact === 'High' ? 'rgba(239,68,68,0.1)' : row.impact === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                    color: row.impact === 'High' ? '#dc2626' : row.impact === 'Medium' ? '#d97706' : '#16a34a'
                  }}>
                    {row.impact}
                  </span>
                </td>
              </tr>
            ))}
            <tr style={{ background: '#fef2f2' }}>
              <td style={{ padding: '12px', fontWeight: 800, color: '#dc2626' }}>Total Revenue at Risk</td>
              <td style={{ padding: '12px' }}></td>
              <td style={{ padding: '12px', fontWeight: 800, color: '#dc2626', textAlign: 'right' }}>₹3.58 Cr</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default Forecast;
