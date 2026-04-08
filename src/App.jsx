import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Dashboard from './pages/Dashboard';
import Marketing from './pages/Marketing';
import Forecast from './pages/Forecast';
import Inventory from './pages/Inventory';
import Vendors from './pages/Vendors';
import Contractors from './pages/Contractors';
import RealEstateData from './pages/RealEstateData';
import Staff from './pages/Staff';
import Projects from './pages/Projects';
import ConstructionProgress from './pages/ConstructionProgress';
import CashFlow from './pages/CashFlow';
import Safety from './pages/Safety';
import Compliance from './pages/Compliance';
import Profitability from './pages/Profitability';
import Equipment from './pages/Equipment';
import SubcontractorPayments from './pages/SubcontractorPayments';
import Geography from './pages/Geography';
import ProjectKpi from './components/Dashboard/ProjectKpi';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-primary)' }}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div 
        className="main-content"
        style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          transition: 'margin-left 0.3s var(--ease-out-expo)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TopNavbar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div 
          className="p-0 flex-grow-1"
          style={{ paddingBottom: '40px' }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/progress" element={<ConstructionProgress />} />
            <Route path="/cash-flow" element={<CashFlow />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/contractors" element={<Contractors />} />
            <Route path="/subcontractor-payments" element={<SubcontractorPayments />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/profitability" element={<Profitability />} />
            <Route path="/real-estate-analytics" element={<RealEstateData />} />
            <Route path="/geography" element={<Geography />} />
            <Route path='/kpi-dashboard' element={<ProjectKpi/>}/>  
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
