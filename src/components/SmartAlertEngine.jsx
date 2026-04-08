import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { FiDollarSign, FiClock, FiShield, FiAlertTriangle, FiTrendingUp, FiChevronDown, FiChevronUp, FiEye, FiX, FiCheck, FiBell } from 'react-icons/fi';

const categoryConfig = {
  Financial: { icon: FiDollarSign, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  Schedule: { icon: FiClock, color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
  Compliance: { icon: FiShield, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  Safety: { icon: FiAlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  Sales: { icon: FiTrendingUp, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' }
};

const sevConfig = {
  Critical: { bg:'#fef2f2', border:'#fecaca', text:'#991b1b', dot:'#ef4444' },
  Warning: { bg:'#fffbeb', border:'#fde68a', text:'#92400e', dot:'#f59e0b' },
  Info: { bg:'#eff6ff', border:'#bfdbfe', text:'#1e40af', dot:'#2563eb' }
};

const alertsData = [
  { id:1, category:'Financial', severity:'Critical', title:'Budget Overrun > 10%', description:'Skyline Tower project costs have exceeded budget by 14.2%. Current overrun: ₹2.84 Cr against ₹19.8 Cr budget.', timestamp:'2 hours ago', rule:'Budget overrun > 10%' },
  { id:2, category:'Financial', severity:'Critical', title:'Cash Runway < 20 Days', description:'Green Valley Phase 2 has only 16 days of cash runway remaining. Immediate collection follow-up required.', timestamp:'3 hours ago', rule:'Cash runway < 20 days' },
  { id:3, category:'Financial', severity:'Warning', title:'Collection Efficiency Below Target', description:'Overall collection efficiency at 67.3% — below 70% threshold. ₹1.8 Cr in delayed receivables.', timestamp:'5 hours ago', rule:'Collection efficiency < 70%' },
  { id:4, category:'Schedule', severity:'Critical', title:'Project Delay > 7 Days', description:'Skyline Tower is 12 days behind schedule on RCC work. Critical path milestone at risk.', timestamp:'1 hour ago', rule:'Project delay > 7 days' },
  { id:5, category:'Schedule', severity:'Warning', title:'Milestone Missed — Plumbing Rough-In', description:'Green Valley Phase 2 missed plumbing rough-in milestone by 3 days. Cascading impact on interior work.', timestamp:'6 hours ago', rule:'Milestone missed' },
  { id:6, category:'Compliance', severity:'Warning', title:'GSTR-3B Filing Due in 5 Days', description:'April GSTR-3B filing deadline approaching. Accounts team to finalize input tax credit reconciliation.', timestamp:'Today, 9:00 AM', rule:'Compliance due within 7 days' },
  { id:7, category:'Compliance', severity:'Critical', title:'EPF Challan Overdue', description:'March EPF monthly challan is overdue by 4 days. Penalty of ₹12,500 may apply. HR to process immediately.', timestamp:'Yesterday', rule:'Compliance item overdue' },
  { id:8, category:'Compliance', severity:'Warning', title:'CLRA License Renewal Overdue', description:'Contract Labour Registration Act license renewal overdue. Operations may face regulatory notice.', timestamp:'2 days ago', rule:'Compliance item overdue' },
  { id:9, category:'Safety', severity:'Critical', title:'PPE Compliance Below 80%', description:'Site 3 (Sunrise Heights) PPE compliance at 76.2%. 19 workers found without proper safety gear during spot check.', timestamp:'4 hours ago', rule:'PPE compliance < 80%' },
  { id:10, category:'Safety', severity:'Warning', title:'LTIFR Approaching Threshold', description:'Current LTIFR at 0.38 (target < 0.5). Two lost-time injuries in last quarter require root-cause analysis.', timestamp:'1 day ago', rule:'LTIFR above threshold' },
  { id:11, category:'Sales', severity:'Warning', title:'Cancellation Rate Above 10%', description:'Sunrise Heights has 12.5% cancellation rate this quarter. 5 units cancelled out of 40 booked.', timestamp:'Yesterday', rule:'Cancellation rate > 10%' },
  { id:12, category:'Sales', severity:'Info', title:'Unsold Units > 60% in Phase 3', description:'Green Valley Phase 3 has 68% units unsold. Consider revised pricing strategy or broker incentive push.', timestamp:'2 days ago', rule:'Units unsold > 60%' },
  { id:13, category:'Financial', severity:'Warning', title:'Contractor Payment Overdue', description:'M/s Sharma Constructions has ₹18.5L pending payment beyond 30-day term. May impact site progress.', timestamp:'3 hours ago', rule:'Payment overdue > 30 days' },
  { id:14, category:'Schedule', severity:'Info', title:'Weekly Progress Below Target', description:'Lakeview Residency weekly concrete pour at 78% of target. Labour shortage reported by site engineer.', timestamp:'Today, 11:00 AM', rule:'Weekly progress < 80%' },
];

const SmartAlertEngine = () => {
  const [dismissed, setDismissed] = useState(new Set());
  const [readAlerts, setReadAlerts] = useState(new Set());
  const [expanded, setExpanded] = useState(false);

  const activeAlerts = alertsData.filter(a => !dismissed.has(a.id));
  const sorted = [...activeAlerts].sort((a, b) => {
    const o = { Critical:0, Warning:1, Info:2 };
    return o[a.severity] - o[b.severity];
  });

  const counts = { Critical:0, Warning:0, Info:0 };
  activeAlerts.forEach(a => counts[a.severity]++);

  const catCounts = {};
  activeAlerts.forEach(a => { catCounts[a.category] = (catCounts[a.category] || 0) + 1; });

  return (
    <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', overflow:'hidden', marginBottom:'24px' }}>
      {/* Header */}
      <div onClick={() => setExpanded(!expanded)} style={{ padding:'16px 20px', borderBottom: expanded ? '1px solid #e2e8f0' : 'none', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', background:'linear-gradient(135deg, rgba(239,68,68,0.03), rgba(245,158,11,0.03), rgba(37,99,235,0.03))', transition:'all 0.2s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg, #ef4444, #f59e0b)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><FiBell size={16} /></div>
          <div>
            <h6 style={{ margin:0, fontSize:'0.9rem', fontWeight:800, color:'#0f172a' }}>Smart Alert Engine</h6>
            <span style={{ fontSize:'0.72rem', color:'#64748b' }}>Auto-generated alerts from business rules</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {Object.entries(counts).map(([sev, count]) => count > 0 && (
            <span key={sev} style={{ padding:'2px 10px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:700, background:sevConfig[sev].bg, color:sevConfig[sev].text, border:`1px solid ${sevConfig[sev].border}` }}>
              {count} {sev}
            </span>
          ))}
          {expanded ? <FiChevronUp size={18} color="#64748b" /> : <FiChevronDown size={18} color="#64748b" />}
        </div>
      </div>

      {expanded && (
        <div>
          {/* Category badges */}
          <div style={{ padding:'12px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {Object.entries(catCounts).map(([cat, count]) => {
              const cfg = categoryConfig[cat];
              const Icon = cfg.icon;
              return (
                <span key={cat} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'6px', background:cfg.bg, fontSize:'0.72rem', fontWeight:700, color:cfg.color }}>
                  <Icon size={12} /> {cat} ({count})
                </span>
              );
            })}
          </div>

          {/* Alert list */}
          <div style={{ maxHeight:'500px', overflowY:'auto' }}>
            {sorted.map(alert => {
              const cfg = categoryConfig[alert.category];
              const sev = sevConfig[alert.severity];
              const Icon = cfg.icon;
              const isRead = readAlerts.has(alert.id);

              return (
                <div key={alert.id} style={{
                  padding:'14px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', gap:'12px', alignItems:'flex-start',
                  background: isRead ? '#f8fafc' : 'transparent', opacity: isRead ? 0.7 : 1, transition:'all 0.2s'
                }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px' }}>
                    <Icon size={14} color={cfg.color} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#0f172a' }}>{alert.title}</span>
                      <span style={{ padding:'1px 8px', borderRadius:'20px', fontSize:'0.65rem', fontWeight:700, background:sev.bg, color:sev.text, border:`1px solid ${sev.border}` }}>{alert.severity}</span>
                    </div>
                    <p style={{ fontSize:'0.78rem', color:'#475569', margin:'0 0 6px', lineHeight:1.4 }}>{alert.description}</p>
                    <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.68rem', color:'#94a3b8', fontWeight:600 }}>{alert.timestamp}</span>
                      <span style={{ fontSize:'0.65rem', color:'#94a3b8', background:'#f1f5f9', padding:'1px 6px', borderRadius:'4px' }}>Rule: {alert.rule}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                    <button onClick={() => setReadAlerts(p => new Set(p).add(alert.id))} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }} title="Mark Read"><FiCheck size={13} /></button>
                    <button onClick={() => setDismissed(p => new Set(p).add(alert.id))} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }} title="Dismiss"><FiX size={13} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAlertEngine;
