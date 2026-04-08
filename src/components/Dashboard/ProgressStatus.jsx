import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import data from '../../data/constructionKpiData.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ProgressStatus = () => {
  const { progressStatus } = data;

  // Task Status (Doughnut)
  const statusLabels = Object.keys(progressStatus.taskStatus);
  const statusData = {
    labels: statusLabels,
    datasets: [{
      data: Object.values(progressStatus.taskStatus),
      backgroundColor: ['#f59e0b', '#fbbf24', '#e2e8f0', '#94a3b8', '#64748b'], // orange, yellow, and grays
      borderWidth: 1
    }]
  };
  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'left', labels: { usePointStyle: true, boxWidth: 10, font: { size: 10 } } } }
  };

  // Task Priority (Pie)
  const priorityData = {
    labels: Object.keys(progressStatus.taskPriority),
    datasets: [{
      data: Object.values(progressStatus.taskPriority),
      backgroundColor: ['#ef4444', '#84cc16', '#fbbf24'],
      borderWidth: 1
    }]
  };
  const priorityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'left', labels: { usePointStyle: true, boxWidth: 10, font: { size: 10 } } } }
  };

  // Pending Items (Bar)
  const pendingData = {
    labels: progressStatus.pendingItems.labels,
    datasets: [{
      data: progressStatus.pendingItems.data,
      backgroundColor: ['#1e293b', '#f59e0b', '#fb923c'],
      barPercentage: 0.5
    }]
  };
  const pendingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { min: 0, max: 6, ticks: { stepSize: 1 } }
    }
  };

  // Budget (Horizontal Bar)
  const budgetData = {
    labels: ['Planned', 'Actual'],
    datasets: [{
      data: [progressStatus.budget.Planned, progressStatus.budget.Actual],
      backgroundColor: ['#f59e0b', '#1e293b'],
      barPercentage: 0.8
    }]
  };
  const budgetOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { min: 0, max: 100000, ticks: { callback: (val) => val.toLocaleString() } },
      y: { grid: { display: false } }
    }
  };

  // Simulate Timeline Chart with floating bars (approximate layout)
  const timelineData = {
    labels: progressStatus.tasks.map(t => t.name),
    datasets: [{
      label: 'Duration',
      data: progressStatus.tasks.map(t => [t.id, t.id + (t.duration / 5)]), // Approx visually 
      backgroundColor: progressStatus.tasks.map((_, i) => i > 7 ? '#94a3b8' : '#f59e0b'), // Grey for later tasks
      barPercentage: 0.8,
      categoryPercentage: 1.0,
      borderRadius: 2
    }]
  };
  
  const timelineOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        min: 0, 
        max: 20, 
        grid: { color: '#e2e8f0' },
        ticks: { display: false }
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#334155' }
      }
    }
  };

  return (
    <div className="mb-5 bg-white p-4 rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
      <h3 style={{ fontWeight: '700', color: '#0f172a' }}>Construction project progress status dashboard</h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
        This slide showcase dashboard of construction project progress to analyses the project in effective manner. It includes elements such as task timeline, task status, task priorities, budget and pending items.
      </p>

      {/* Badges */}
      <Row className="mb-4 justify-content-center g-4 mt-2">
        <Col md="auto">
          <div className="px-5 py-2 text-center shadow-sm" style={{ backgroundColor: '#fef3c7', borderRadius: '10px', border: '1px solid #fcd34d', fontWeight: 'bold' }}>
            <span style={{ marginRight: '10px' }}>🏗️</span> Project name- {progressStatus.projectName}
          </div>
        </Col>
        <Col md="auto">
          <div className="px-5 py-2 text-center shadow-sm" style={{ backgroundColor: '#fef3c7', borderRadius: '10px', border: '1px solid #fcd34d', fontWeight: 'bold' }}>
            <span style={{ marginRight: '10px' }}>⏱️</span> Status – {progressStatus.percentageComplete}% completed
          </div>
        </Col>
      </Row>

      {/* Timeline Section */}
      <div className="border rounded p-3 mb-4">
        <h6 className="text-center" style={{ fontWeight: 'bold' }}>Task timeline</h6>
        <div className="d-flex justify-content-between mt-3 text-muted" style={{ fontSize: '0.75rem', paddingLeft: '150px' }}>
          <span>12/31</span><span>02/05</span><span>02/08</span><span>02/15</span><span>02/18</span><span>02/25</span><span>02/30</span><span>03/05</span><span>03/09</span><span>03/15</span><span>03/20</span>
        </div>
        <div style={{ height: '300px' }}>
          <Bar data={timelineData} options={timelineOptions} />
        </div>
      </div>

      {/* 4 Bottom Panels */}
      <Row className="g-3">
        <Col md={3}>
          <div className="border rounded p-3 h-100 position-relative">
            <h6 className="text-center" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Task status %</h6>
            <div style={{ height: '160px', marginTop: '10px' }}>
              <Doughnut data={statusData} options={statusOptions} />
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className="border rounded p-3 h-100 position-relative">
            <h6 className="text-center" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Task priority %</h6>
            <div style={{ height: '160px', marginTop: '10px' }}>
              <Pie data={priorityData} options={priorityOptions} />
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className="border rounded p-3 h-100">
            <h6 className="text-center" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Pending items</h6>
            <div style={{ height: '160px', marginTop: '10px' }}>
               <Bar data={pendingData} options={pendingOptions} />
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className="border rounded p-3 h-100">
            <h6 className="text-center" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Budget</h6>
            <div style={{ height: '160px', marginTop: '10px' }}>
              <Bar data={budgetData} options={budgetOptions} />
            </div>
          </div>
        </Col>
      </Row>
      
      <div className="text-center w-100 mt-3" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
        This graph/chart is linked to excel, and changes automatically based on data. Just left click on it and select "Edit Data".
      </div>
    </div>
  );
};

export default ProgressStatus;
