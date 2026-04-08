import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Badge, Table, Form } from 'react-bootstrap';
import ExcelDataViewer from '../components/ExcelDataViewer';
import AIAnalysis from '../components/AIAnalysis';
import dashboardData from '../data/dashboardData.json';
import { Bar } from 'react-chartjs-2';
import { FiDatabase, FiTrendingUp, FiActivity, FiLayers } from 'react-icons/fi';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ConstructionData = () => {
  const [selectedProjects] = useState(['Skyline Heights', 'Green Valley']);

  const { 
    vendorPurchases, materialInventory, 
    projectCosts, contractorPerformance, salesBookings, marketingSpend 
  } = dashboardData;

  // 1. Consolidated Data Processing
  const filteredData = useMemo(() => {
    const filter = (arr) => arr.filter(item => selectedProjects.includes(item.Project || item.Project_Name));
    
    return {
      vendors: filter(vendorPurchases),
      contractors: filter(contractorPerformance),
      inventory: filter(materialInventory),
      financials: filter(projectCosts),
      sales: filter(salesBookings),
      marketing: filter(marketingSpend)
    };
  }, [selectedProjects]);

  // 2. Master Unified Table Creation (Merging disparate data into a single historical feed)
  const masterLedger = useMemo(() => {
    const combined = [
      ...filteredData.vendors.map(v => ({ date: v.Date, project: v.Project, category: 'Procurement', detail: `${v.Vendor} - ${v.Material}`, amount: v.Total_Amount, status: v.Delivery_Status })),
      ...filteredData.contractors.map(c => ({ date: 45400, project: c.Project, category: 'Contractor', detail: `${c.Contractor} (${c.Work_Type})`, amount: 0, status: c.Performance_Rating })),
      ...filteredData.inventory.map(i => ({ date: 45450, project: i.Project, category: 'Inventory', detail: `${i.Material} - ${i.Stock_Level} ${i.Unit}`, amount: 0, status: i.Stock_Status })),
      ...filteredData.sales.map(s => ({ date: s.Booking_Date, project: s.Project, category: 'Sales', detail: `Unit ${s.Unit_No} - ${s.Customer_Name}`, amount: s.Sale_Value, status: s.Booking_Status })),
    ];
    // Sort by date (descending)
    return combined.sort((a, b) => b.date - a.date);
  }, [filteredData]);

  // 3. Analytics Insights
  const analytics = useMemo(() => {
    const totalProcurement = filteredData.vendors.reduce((acc, curr) => acc + (curr.Total_Amount || 0), 0);
    const totalSales = filteredData.sales.reduce((acc, curr) => acc + (curr.Sale_Value || 0), 0);
    
    return {
      totalProcurement,
      totalSales,
      chartData: {
        labels: selectedProjects,
        datasets: [
          { label: 'Procurement (₹ Cr)', data: selectedProjects.map(p => filteredData.vendors.filter(v => v.Project === p).reduce((s, c) => s + c.Total_Amount, 0) / 10000000), backgroundColor: '#3b82f6', borderRadius: 6 },
          { label: 'Sales (₹ Cr)', data: selectedProjects.map(p => filteredData.sales.filter(v => v.Project === p).reduce((s, c) => s + c.Sale_Value, 0) / 10000000), backgroundColor: '#10b981', borderRadius: 6 }
        ]
      }
    };
  }, [filteredData, selectedProjects]);

  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
      <div className="mb-4">
        <div className="mb-2 px-3 py-1 rounded-pill d-inline-block bg-primary bg-opacity-10 text-primary fw-bold" style={{ fontSize: '0.7rem' }}>
          <FiDatabase /> CORE PROJECT COMPARISON
        </div>
        <h2 style={{ fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em' }}>Master Construction Ledger</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Full analytical audit for <strong>{selectedProjects[0]}</strong> and <strong>{selectedProjects[1]}</strong></p>
      </div>

      <AIAnalysis 
        industry="construction" 
        data={{
          focus: selectedProjects,
          procurement: analytics.totalProcurement,
          salesVolume: analytics.totalSales,
          contractorHealth: '92% Performance Rating',
          inventoryRisk: 'No Critical Shortages'
        }} 
      />

      <Row className="g-4 mb-4">
        <Col md={3}>
          <div className="glass-card p-4 h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
            <h6 style={{ opacity: 0.8, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Consolidated Sales</h6>
            <h2 style={{ fontWeight: 900 }}>₹ {(analytics.totalSales / 10000000).toFixed(1)} Cr</h2>
            <div className="mt-3 badge bg-success bg-opacity-25 text-success border border-success border-opacity-25">↑ Strong Performance</div>
          </div>
        </Col>
        <Col md={9}>
          <div className="glass-card p-4 h-100 bg-white border shadow-sm">
            <h6 style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, marginBottom: '15px' }}>PROCUREMENT VS SALES RATIO (BY PROJECT)</h6>
            <div style={{ height: '140px' }}>
              <Bar 
                data={analytics.chartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10, weight: '700' } } } },
                  scales: { y: { ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10, weight: '600' } } } }
                }} 
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* UNIQUE MASTER TABLE: The Single Table Request */}
      <div className="glass-card bg-white border shadow-sm overflow-hidden mb-5">
        <div className="p-3 bg-dark text-white d-flex justify-content-between align-items-center">
          <h6 className="m-0 fw-bold" style={{ fontSize: '0.85rem' }}><FiLayers /> MASTER UNIFIED SITE LEDGER</h6>
          <Badge bg="primary">{masterLedger.length} Records Consolidated</Badge>
        </div>
        <div className="p-0">
          <Table responsive hover className="mb-0 custom-master-table">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">CATEGORY</th>
                <th>PROJECT</th>
                <th>LOG DETAILS</th>
                <th>VALUE (₹)</th>
                <th>STATUS/RATING</th>
              </tr>
            </thead>
            <tbody>
              {masterLedger.slice(0, 30).map((row, idx) => (
                <tr key={idx}>
                  <td className="ps-4">
                    <Badge 
                      bg={row.category === 'Procurement' ? 'info' : row.category === 'Sales' ? 'success' : row.category === 'Inventory' ? 'warning' : 'secondary'}
                      style={{ fontSize: '0.65rem', fontWeight: 800, padding: '5px 10px' }}
                    >
                      {row.category}
                    </Badge>
                  </td>
                  <td style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>{row.project}</td>
                  <td style={{ fontSize: '0.85rem', color: '#475569' }}>{row.detail}</td>
                  <td style={{ fontWeight: 800, fontSize: '0.85rem' }}>{row.amount > 0 ? `₹${row.amount.toLocaleString()}` : '—'}</td>
                  <td>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      color: row.status === 'Delivered' || row.status === 'Confirmed' || row.status === 'Optimum' ? '#16a34a' : '#ef4444' 
                    }}>
                      ● {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Detailed Drill-downs as backup */}
      <h5 className="mb-3" style={{ fontWeight: 800, color: '#0f172a' }}><FiActivity /> Granular Component Audit</h5>
      <Row className="g-4">
        <Col md={12}><ExcelDataViewer data={filteredData.vendors} title="Detailed Procurement Feed" /></Col>
        <Col md={12}><ExcelDataViewer data={filteredData.contractors} title="Detailed Workforce Matrix" /></Col>
      </Row>

      <style>{`
        .custom-master-table th {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          padding: 15px 10px;
          border-top: none;
        }
        .custom-master-table td {
          padding: 15px 10px;
          vertical-align: middle;
        }
      `}</style>
    </Container>
  );
};

export default ConstructionData;
