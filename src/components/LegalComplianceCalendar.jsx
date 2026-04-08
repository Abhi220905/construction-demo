import React, { useState, useMemo } from 'react';
import { Row, Col, Table, Badge, Button } from 'react-bootstrap';
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiUser,
  FiCheck,
  FiRotateCcw
} from 'react-icons/fi';

/**
 * LegalComplianceCalendar Component — MODULE 4
 * Integrated with session-based status overrides
 */

const currentMonth = 3; // April (0-indexed)
const currentYear = 2026;

const complianceItems = [
  { id: 1, name: 'RERA Quarterly Progress Report', frequency: 'Quarterly', responsible: 'Priya Sharma (Legal)', months: [2, 5, 8, 11], statuses: ['completed', 'upcoming', 'upcoming', 'upcoming'] },
  { id: 2, name: 'GST GSTR-1 Filing', frequency: 'Monthly', responsible: 'Accounts Dept', months: [0,1,2,3,4,5,6,7,8,9,10,11], statuses: ['completed','completed','completed','due-soon','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming'] },
  { id: 3, name: 'GST GSTR-3B Filing', frequency: 'Monthly', responsible: 'Accounts Dept', months: [0,1,2,3,4,5,6,7,8,9,10,11], statuses: ['completed','completed','completed','due-soon','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming'] },
  { id: 4, name: 'TDS Quarterly Return (194C, 194I)', frequency: 'Quarterly', responsible: 'CA – M/s Patel & Associates', months: [2, 5, 8, 11], statuses: ['completed', 'upcoming', 'upcoming', 'upcoming'] },
  { id: 5, name: 'BOCW Welfare Fund Contribution', frequency: 'Quarterly', responsible: 'HR Dept', months: [2, 5, 8, 11], statuses: ['completed', 'upcoming', 'upcoming', 'upcoming'] },
  { id: 6, name: 'EPF Monthly Challan', frequency: 'Monthly', responsible: 'HR – Rahul Verma', months: [0,1,2,3,4,5,6,7,8,9,10,11], statuses: ['completed','completed','completed','overdue','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming'] },
  { id: 7, name: 'ESI Monthly Challan', frequency: 'Monthly', responsible: 'HR – Rahul Verma', months: [0,1,2,3,4,5,6,7,8,9,10,11], statuses: ['completed','completed','completed','due-soon','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming'] },
  { id: 8, name: 'Professional Tax Filing', frequency: 'Half-yearly', responsible: 'Accounts Dept', months: [5, 11], statuses: ['upcoming', 'upcoming'] },
  { id: 9, name: 'Fire NOC Renewal', frequency: 'Annual', responsible: 'Admin – Vikram Singh', months: [6], statuses: ['upcoming'] },
  { id: 10, name: 'Labour License Renewal', frequency: 'Annual', responsible: 'Legal – Priya Sharma', months: [4], statuses: ['upcoming'] },
  { id: 11, name: 'Environmental Clearance Review', frequency: 'Annual', responsible: 'Environmental Officer', months: [7], statuses: ['upcoming'] },
  { id: 12, name: 'Building Plan Approval Status', frequency: 'As needed', responsible: 'Architect – Studio A', months: [1, 3], statuses: ['completed', 'due-soon'] },
  { id: 13, name: 'Occupation Certificate Tracking', frequency: 'Milestone', responsible: 'Project Manager', months: [9], statuses: ['upcoming'] },
  { id: 14, name: 'Factory/Site Inspector Visit Log', frequency: 'Quarterly', responsible: 'Site Manager – Each Site', months: [2, 5, 8, 11], statuses: ['completed', 'upcoming', 'upcoming', 'upcoming'] },
  { id: 15, name: 'Workmen Compensation Insurance Renewal', frequency: 'Annual', responsible: 'Insurance Broker – LIC', months: [5], statuses: ['upcoming'] },
  { id: 16, name: 'CLRA License (Contract Labour)', frequency: 'Annual', responsible: 'Legal Dept', months: [3], statuses: ['overdue'] },
  { id: 17, name: 'Pollution Control Board Consent', frequency: 'Annual', responsible: 'Environmental Officer', months: [10], statuses: ['upcoming'] },
  { id: 18, name: 'Structural Audit Report', frequency: 'As needed', responsible: 'Structural Consultant', months: [2, 8], statuses: ['completed', 'upcoming'] },
];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const statusConfig = {
  completed: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'Completed', icon: '✓' },
  'due-soon': { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Due ≤7 days', icon: '!' },
  overdue: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'Overdue', icon: '✕' },
  upcoming: { color: '#2563eb', bg: 'rgba(37,99,235,0.15)', label: 'Upcoming', icon: '○' }
};

const LegalComplianceCalendar = () => {
  // tracks manual overrides to the mock data
  const [overriddenStatuses, setOverriddenStatuses] = useState({});

  const getItemStatus = (itemId, monthIdx, originalStatus) => {
    return overriddenStatuses[`${itemId}-${monthIdx}`] || originalStatus;
  };

  // Calculate stats based on overrides
  const { totalItemsThisYear, completedCount } = useMemo(() => {
    let total = 0;
    let completed = 0;
    complianceItems.forEach(item => {
      item.months.forEach((m, idx) => {
        total++;
        if (getItemStatus(item.id, m, item.statuses[idx]) === 'completed') {
          completed++;
        }
      });
    });
    return { totalItemsThisYear: total, completedCount: completed };
  }, [overriddenStatuses]);

  const complianceScore = ((completedCount / totalItemsThisYear) * 100).toFixed(1);

  // Build upcoming items list (next 30 days and overdue)
  const upcomingItemsList = useMemo(() => {
    const list = [];
    complianceItems.forEach(item => {
      item.months.forEach((m, idx) => {
        const originalStatus = item.statuses[idx];
        const status = getItemStatus(item.id, m, originalStatus);
        
        // Show if in current month, next month, or currently overdue/due-soon
        if (m === currentMonth || m === currentMonth + 1 || status === 'overdue' || status === 'due-soon' || status === 'completed') {
           // But only if it's recent (not from months ago unless overdue)
           const isRelevant = m === currentMonth || m === currentMonth + 1 || originalStatus === 'overdue';
           
           if (isRelevant) {
            const dueDate = new Date(currentYear, m, m === currentMonth ? 15 : 20);
            list.push({
              ...item,
              dueMonth: m,
              originalStatus,
              itemStatus: status,
              dueDateStr: dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            });
           }
        }
      });
    });
    return list.sort((a, b) => {
      const order = { overdue: 0, 'due-soon': 1, upcoming: 2, completed: 3 };
      return order[a.itemStatus] - order[b.itemStatus];
    });
  }, [overriddenStatuses]);

  const handleToggleStatus = (itemId, month, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'overdue' : 'completed'; 
    setOverriddenStatuses(prev => ({
      ...prev,
      [`${itemId}-${month}`]: nextStatus
    }));
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div className="mb-4">
        <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiCalendar color="#2563eb" /> Legal & Compliance Calendar
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Real-time tracking of RERA, Tax, and Labour Law filings</p>
      </div>

      {/* Compliance Score */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={{ fontWeight: 700, color: '#1e293b' }}>Operational Compliance Score</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#22c55e' }}>{complianceScore}%</span>
        </div>
        <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${complianceScore}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #10b981)', borderRadius: '6px', transition: 'width 1s ease-out' }} />
        </div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          {/* Calendar Grid */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <Table responsive borderless size="sm">
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px', fontSize: '0.7rem', color: '#64748b' }}>COMPLIANCE ITEM</th>
                  {monthNames.map(m => <th key={m} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b' }}>{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {complianceItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600, fontSize: '0.75rem' }}>{item.name}</td>
                    {monthNames.map((_, mIdx) => {
                      const occIdx = item.months.indexOf(mIdx);
                      const status = occIdx !== -1 ? getItemStatus(item.id, mIdx, item.statuses[occIdx]) : null;
                      const cfg = status ? statusConfig[status] : null;
                      return (
                        <td key={mIdx} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          {cfg && <span style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} title={cfg.label} />}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>

        <Col lg={4}>
          {/* Actionable List */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div className="p-3 bg-light border-bottom fw-bold" style={{ fontSize: '0.8rem', color: '#64748b' }}>NEXT 30 DAYS & OVERDUE</div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {upcomingItemsList.map((item, idx) => {
                const cfg = statusConfig[item.itemStatus];
                return (
                  <div key={idx} className="p-3 border-bottom d-flex gap-3 align-items-start">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, marginTop: '6px' }} />
                    <div className="flex-grow-1">
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Due: {item.dueDateStr}</div>
                      
                      <div className="mt-2 d-flex gap-2">
                        {item.itemStatus !== 'completed' ? (
                          <Button 
                            size="sm" 
                            variant="success" 
                            style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px' }}
                            onClick={() => handleToggleStatus(item.id, item.dueMonth, item.itemStatus)}
                          >
                            <FiCheck /> MARK DONE
                          </Button>
                        ) : (
                          <div className="d-flex align-items-center gap-2">
                            <Badge bg="success" style={{ fontSize: '0.6rem' }}>COMPLETED</Badge>
                            <Button 
                              variant="link" 
                              className="p-0 text-danger" 
                              style={{ fontSize: '0.65rem', fontWeight: 700, textDecoration: 'none' }}
                              onClick={() => handleToggleStatus(item.id, item.dueMonth, item.itemStatus)}
                            >
                              <FiRotateCcw /> UNMARK
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LegalComplianceCalendar;
