import React, { useMemo } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import dashboardData from '../../data/dashboardData.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const ProjectKpi = () => {
  const { projectCosts, contractorPerformance, brokerPerformance, materialInventory } = dashboardData;

  // 1. Budget Usage by Category
  const budgetByCategory = useMemo(() => {
    const cats = { Labor: 0, Materials: 0, Equipment: 0, Contractor: 0 };
    const actuals = { Labor: 0, Materials: 0, Equipment: 0, Contractor: 0 };
    let totalBudget = 0;
    projectCosts.forEach(item => {
      const c = item.Cost_Category;
      if (cats[c] !== undefined) {
        cats[c] += item.Budgeted_Amount || 0;
        actuals[c] += item.Actual_Amount || 0;
        totalBudget += item.Budgeted_Amount || 0;
      }
    });
    return { cats, actuals, totalBudget };
  }, [projectCosts]);

  const budgetDoughnutData = {
    labels: ['Labor', 'Materials', 'Equipment', 'Contractor'],
    datasets: [{
      data: [
        budgetByCategory.cats.Labor, 
        budgetByCategory.cats.Materials, 
        budgetByCategory.cats.Equipment, 
        budgetByCategory.cats.Contractor
      ],
      backgroundColor: ['#0f766e', '#ea580c', '#334155', '#ca8a04'],
      borderWidth: 2,
      borderColor: '#fff',
      cutout: '70%',
    }]
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } }
    }
  };

  // 2. Project Schedule Variance (Planned vs Actual Days)
  const scheduleData = useMemo(() => {
    const projMap = {};
    contractorPerformance.forEach(item => {
      if (!projMap[item.Project]) projMap[item.Project] = { planned: 0, actual: 0 };
      projMap[item.Project].planned += item.Planned_Days || 0;
      projMap[item.Project].actual += item.Actual_Days || 0;
    });
    const labels = Object.keys(projMap);
    return {
      labels,
      planned: labels.map(l => projMap[l].planned),
      actual: labels.map(l => projMap[l].actual)
    };
  }, [contractorPerformance]);

  const scheduleBarData = {
    labels: scheduleData.labels,
    datasets: [
      {
        label: 'Planned Days',
        data: scheduleData.planned,
        backgroundColor: '#0f766e',
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: 'Actual Days',
        data: scheduleData.actual,
        backgroundColor: '#ea580c',
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  };
  const scheduleBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } } },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (value) => value + ' days' } }
    }
  };

  // 3. Project Cost Overruns
  const costOverrunsDataMap = useMemo(() => {
    const projMap = {};
    projectCosts.forEach(item => {
      if (!projMap[item.Project]) projMap[item.Project] = { planned: 0, actual: 0, variance: 0 };
      projMap[item.Project].planned += item.Budgeted_Amount || 0;
      projMap[item.Project].actual += item.Actual_Amount || 0;
      projMap[item.Project].variance += item.Variance || 0;
    });
    const labels = Object.keys(projMap);
    return {
      labels,
      planned: labels.map(l => projMap[l].planned),
      actual: labels.map(l => projMap[l].actual),
      variance: labels.map(l => projMap[l].variance)
    };
  }, [projectCosts]);

  const costOverrunsData = {
    labels: costOverrunsDataMap.labels,
    datasets: [
      {
        label: 'Planned Cost (₹)',
        data: costOverrunsDataMap.planned.map(v => v/100000), // in lakhs
        borderColor: '#0f766e',
        borderWidth: 2,
        tension: 0,
        fill: false,
      },
      {
        label: 'Actual Cost (₹)',
        data: costOverrunsDataMap.actual.map(v => v/100000),
        borderColor: '#ea580c',
        borderWidth: 2,
        tension: 0,
        fill: false,
      },
      {
        label: 'Variance (₹)',
        data: costOverrunsDataMap.variance.map(v => v/100000),
        borderColor: '#ef4444',
        borderWidth: 2,
        tension: 0,
        fill: false,
        borderDash: [5, 5]
      }
    ]
  };
  const costOverrunsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } } },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (value) => value + ' L' } }
    }
  };

  // 4. Dynamic KPIs calculation
  const totalVariance = costOverrunsDataMap.variance.reduce((a, b) => a + b, 0);
  const totalDelay = contractorPerformance.reduce((acc, curr) => acc + (curr.Delay_Days || 0), 0);
  const idleValue = materialInventory.reduce((acc, curr) => acc + (curr.Idle_Stock_Value || 0), 0);

  // CPI & SPI (Earned Value metrics) — mock EV data based on project costs
  const totalPlannedValue = costOverrunsDataMap.planned.reduce((a, b) => a + b, 0);
  const totalActualCost = costOverrunsDataMap.actual.reduce((a, b) => a + b, 0);
  // Earned Value = Planned Value × % complete (assume ~72% avg completion)
  const earnedValue = totalPlannedValue * 0.72;
  const cpi = totalActualCost > 0 ? (earnedValue / totalActualCost) : 1;
  const spi = totalPlannedValue > 0 ? (earnedValue / totalPlannedValue) : 1;
  
  const dynamicKpis = [
    { kpi: "Cost Variance", definition: "Total deviation from budget", target: "₹ 0", current: `₹ ${(totalVariance/100000).toFixed(2)} L`, status: totalVariance > 0 ? "Critical" : "Stable", trend: totalVariance > 0 ? "Declining" : "Stable" },
    { kpi: "Schedule Delay", definition: "Total combined delay days across contracts", target: "0 Days", current: `${totalDelay} Days`, status: "At Risk", trend: "Declining" },
    { kpi: "Idle Inventory", definition: "Value of unused stock blocking capital", target: "₹ 0", current: `₹ ${(idleValue/100000).toFixed(2)} L`, status: idleValue > 50000 ? "Critical" : "At Risk", trend: "Stable" },
    { kpi: "CPI", definition: "Cost Performance Index: Earned Value ÷ Actual Cost. >1 = under budget", target: "> 1.0", current: cpi.toFixed(2), status: cpi >= 1 ? "Stable" : cpi >= 0.9 ? "At Risk" : "Critical", trend: cpi >= 1 ? "Stable" : "Declining" },
    { kpi: "SPI", definition: "Schedule Performance Index: Earned Value ÷ Planned Value. >1 = ahead", target: "> 1.0", current: spi.toFixed(2), status: spi >= 1 ? "Stable" : spi >= 0.85 ? "At Risk" : "Critical", trend: spi >= 1 ? "Stable" : "Declining" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return '#fca5a5';
      case 'At Risk': return '#fef08a';
      case 'Stable': return '#bbf7d0';
      default: return 'transparent';
    }
  };

  const getPercentage = (val, total) => total > 0 ? ((val / total) * 100).toFixed(1) + '%' : '0%';

  return (
    <div className="mb-5 bg-white p-4 rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
      <h3 className="mb-4 text-center" style={{ fontWeight: '700', color: '#0f172a' }}>Real-time Construction KPI Dashboard</h3>
      
      <Row className="mb-4">
        <Col lg={5}>
          <div className="text-center h-100 d-flex flex-column" style={{ minHeight: '300px' }}>
            <h5 style={{ color: '#64748b' }}>Percentage<br/>of Total Budget</h5>
            <div className="flex-grow-1 position-relative mt-3">
              <Doughnut data={budgetDoughnutData} options={doughnutOptions} />
            </div>
          </div>
        </Col>
        <Col lg={7}>
          <div className="mb-4" style={{ height: '220px' }}>
            <h5 className="text-center" style={{ color: '#64748b' }}>Project Schedule Variance</h5>
            <Bar data={scheduleBarData} options={scheduleBarOptions} />
          </div>
          <div style={{ height: '220px' }}>
            <h5 className="text-center" style={{ color: '#64748b' }}>Cost Overruns (in Lakhs)</h5>
            <Line data={costOverrunsData} options={costOverrunsOptions} />
          </div>
        </Col>
      </Row>

      <Row className="g-3" style={{ fontSize: '0.8rem' }}>
        {/* Table 1: Budget Usage */}
        <Col lg={4}>
          <h6 style={{ fontSize: '0.9rem', color: '#334155' }}>Budget Usage</h6>
          <Table size="sm" bordered hover>
            <thead className="bg-light text-muted">
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Actual</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {['Labor', 'Materials', 'Equipment', 'Contractor'].map(cat => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>₹ {(budgetByCategory.cats[cat]/100000).toFixed(2)}L</td>
                  <td>₹ {(budgetByCategory.actuals[cat]/100000).toFixed(2)}L</td>
                  <td>{getPercentage(budgetByCategory.cats[cat], budgetByCategory.totalBudget)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <h6 className="mt-3" style={{ fontSize: '0.9rem', color: '#334155' }}>Contract Schedule Variance</h6>
          <Table size="sm" bordered hover>
            <thead className="bg-light text-muted">
              <tr>
                <th>Project</th>
                <th>Planned Days</th>
                <th>Actual Days</th>
                <th>Delay</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.labels.map((proj, idx) => (
                <tr key={idx}>
                  <td>{proj}</td>
                  <td>{scheduleData.planned[idx]}</td>
                  <td>{scheduleData.actual[idx]}</td>
                  <td style={{ color: scheduleData.actual[idx] > scheduleData.planned[idx] ? '#ef4444' : 'inherit' }}>
                    {scheduleData.actual[idx] - scheduleData.planned[idx]}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        
        {/* Table 2: Cost Overruns */}
        <Col lg={4}>
          <h6 style={{ fontSize: '0.9rem', color: '#334155' }}>Cost Overruns by Project</h6>
          <Table size="sm" bordered hover>
            <thead className="bg-light text-muted">
              <tr>
                <th>Project</th>
                <th>Budget (Lakhs)</th>
                <th>Actual (Lakhs)</th>
                <th>Variance (Lakhs)</th>
              </tr>
            </thead>
            <tbody>
              {costOverrunsDataMap.labels.map((proj, idx) => (
                <tr key={idx}>
                  <td>{proj}</td>
                  <td>₹ {(costOverrunsDataMap.planned[idx] / 100000).toFixed(2)}</td>
                  <td>₹ {(costOverrunsDataMap.actual[idx] / 100000).toFixed(2)}</td>
                  <td style={{ color: costOverrunsDataMap.variance[idx] > 0 ? '#ef4444' : '#22c55e' }}>
                    {costOverrunsDataMap.variance[idx] > 0 ? '+' : ''}{(costOverrunsDataMap.variance[idx] / 100000).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        
        {/* Table 3: System Generated KPIs - Summarized */}
        <Col lg={4}>
          <div className="table-responsive">
            <h6 style={{ fontSize: '0.9rem', color: '#334155' }}>Executive Summary KPIs</h6>
            <Table size="sm" bordered hover className="mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th style={{ fontSize: '10px' }}>KPI</th>
                  <th style={{ fontSize: '10px' }}>Value</th>
                  <th style={{ fontSize: '10px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {dynamicKpis.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontSize: '11px', fontWeight: 600 }}>{item.kpi}</td>
                    <td style={{ fontSize: '11px', fontWeight: 700 }}>{item.current}</td>
                    <td style={{ 
                      backgroundColor: getStatusColor(item.status), 
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '4px'
                    }}>
                      {item.status.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectKpi;
