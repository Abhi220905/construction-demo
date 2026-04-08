import React from 'react';
import { Container } from 'react-bootstrap';
import OwnerMorningBrief from '../components/Dashboard/OwnerMorningBrief';
import BudgetVsActual from '../components/Dashboard/BudgetVsActual';
import ProjectKpi from '../components/Dashboard/ProjectKpi';
import SmartAlertEngine from '../components/SmartAlertEngine';
import AIAnalysis from '../components/AIAnalysis';
import kpiData from '../data/constructionKpiData.json';

const Dashboard = () => {
  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
      <div className="mb-4 fade-in-up">
        <h2 style={{ color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '-0.02em' }}>Executive Dashboard</h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>Comprehensive real-time overview of construction site operations</p>
      </div>

      {/* AI Analysis Integration */}
      <AIAnalysis
        industry="construction"
        data={{
          project: kpiData.progressStatus.projectName,
          completion: kpiData.progressStatus.percentageComplete,
          budgetUsage: kpiData.percentageOfTotalBudget,
          criticalKpis: kpiData.kpiDefinitions.filter(k => k.status === 'Critical')
        }}
      />

      {/* Owner Morning Brief — top-of-dashboard daily briefing */}
      <div className="fade-in-up">
        <OwnerMorningBrief />
      </div>


      <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
        <BudgetVsActual />
      </div>

      {/* <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
        <ProjectKpi />
      </div> */}
      
      {/* Smart Alert Engine — collapsible notification panel */}
      <div className="fade-in-up" style={{ animationDelay: '0.05s' }}>
        <SmartAlertEngine />
      </div>

    </Container>
  );
};

export default Dashboard;
