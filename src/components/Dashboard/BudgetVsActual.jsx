import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import data from '../../data/constructionKpiData.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const BudgetVsActual = () => {
  const { monthlyBudgetGraph, projectBudgetMeter, milestones } = data;

  // Monthly Budget Combo Chart
  const comboData = {
    labels: monthlyBudgetGraph.labels,
    datasets: [
      {
        type: 'bar',
        label: 'Monthly Construction',
        data: monthlyBudgetGraph.datasets.monthlyConstruction,
        backgroundColor: '#0284c7', // dark blue
        barPercentage: 0.6
      },
      {
        type: 'bar',
        label: 'Monthly Construction costs',
        data: monthlyBudgetGraph.datasets.monthlyConstructionCosts,
        backgroundColor: '#84cc16', // green
        barPercentage: 0.6
      },
      {
        type: 'line',
        label: 'Monthly Design Costs',
        data: monthlyBudgetGraph.datasets.monthlyDesignCosts,
        borderColor: '#38bdf8', // light blue
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: '#38bdf8',
        tension: 0.4
      }
    ]
  };

  const comboOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 10, font: { size: 11 } } },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        ticks: { callback: (value) => '₹' + value.toLocaleString() }
      }
    }
  };

  // Gauge Chart (Doughnut)
  const gaugeValue = projectBudgetMeter.current;
  const gaugeMax = projectBudgetMeter.max;
  const percentage = gaugeValue / gaugeMax;
  
  // To simulate the gauge colors (Green, Yellow, Red) based on percentage.
  // Actually, standard gauge meter has static sections.
  const gaugeData = {
    labels: ['Safe', 'Warning', 'Danger'],
    datasets: [{
      data: [60, 20, 20], // represents percentages of the full 180 degrees
      backgroundColor: ['#4ade80', '#fbbf24', '#ef4444'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
      cutout: '70%'
    }]
  };

  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  // Function to render status icons
  const renderStatus = (status) => {
    switch (status) {
      case 'success': return <span style={{ color: '#22c55e', fontSize: '1.2rem' }}>↓</span>;
      case 'warning': return <div style={{ width: '12px', height: '12px', backgroundColor: '#eab308', display: 'inline-block' }}></div>;
      case 'danger': return <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>↑</span>;
      default: return null;
    }
  };

  return (
    <div className="mb-5 bg-white p-4 rounded shadow-sm">
      <div className="mb-4">
         <h3 style={{ fontWeight: '300', color: '#334155' }}>Budget vs Actual cost comparison dashboard</h3>
         <p style={{ fontSize: '0.85rem', color: '#64748b' }}>This slide illustrates fact and figures relating to various project budgets of a company. It includes monthly budget graph, project budget meter and budget vs. actual costs chart.</p>
      </div>

      <Row className="g-4 mb-4">
        {/* Combo Chart */}
        <Col lg={8}>
          <div className="border rounded h-100 bg-light position-relative pt-4">
            <div 
              style={{
                position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#0284c7', color: 'white', padding: '5px 20px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold'
              }}
            >
              Monthly Budget Graph
            </div>
            <div style={{ height: '280px', padding: '20px' }}>
              <Bar data={comboData} options={comboOptions} />
            </div>
          </div>
        </Col>

        {/* Gauge Chart */}
        <Col lg={4}>
          <div className="border rounded h-100 bg-light position-relative pt-4 d-flex flex-column align-items-center justify-content-center">
             <div 
              style={{
                position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#0284c7', color: 'white', padding: '5px 20px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap'
              }}
            >
              Project Budget Meter
            </div>
            <div style={{ height: '180px', width: '100%', position: 'relative' }}>
               <Doughnut data={gaugeData} options={gaugeOptions} />
               {/* Arrow to point at current value could be complex, putting value in center instead */}
               <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', fontWeight: '700', fontSize: '1.2rem' }}>
                 {projectBudgetMeter.label}
               </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Milestones Table */}
      <Table bordered hover responsive style={{ fontSize: '0.9rem' }}>
        <thead style={{ backgroundColor: '#84cc16', color: 'white' }}>
          <tr>
            <th className="text-center" style={{ width: '50px' }}></th>
            <th>Milestones</th>
            <th>Budget</th>
            <th>Actual</th>
            <th>Manager</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((item, idx) => (
            <tr key={idx}>
              <td className="text-center align-middle">{renderStatus(item.status)}</td>
              <td className="align-middle">{item.name}</td>
              <td className="align-middle">₹{item.budget.toLocaleString()}</td>
              <td className="align-middle">₹{item.actual.toLocaleString()}</td>
              <td className="align-middle">{item.manager}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-center w-100" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
        This graph/chart is linked to excel, and changes automatically based on data.
      </div>
    </div>
  );
};

export default BudgetVsActual;
