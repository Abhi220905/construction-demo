import React from 'react';
import { Row, Col, Table, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FiDollarSign, FiAlertTriangle, FiClock, FiUsers } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatINR = (v) => { if (v >= 10000000) return `₹${(v/10000000).toFixed(2)} Cr`; if (v >= 100000) return `₹${(v/100000).toFixed(1)}L`; return `₹${v.toLocaleString('en-IN')}`; };

const contractors = [
  { name:'M/s Sharma Constructions', workPackage:'RCC Structure', contractValue:45000000, billedAmount:32000000, amountPaid:28000000, retentionHeld:1600000, ldApplicable:true, ldAmount:450000, retentionRelease:'Jul 2026' },
  { name:'M/s Patel Electricals', workPackage:'Electrical Works', contractValue:18000000, billedAmount:12500000, amountPaid:11000000, retentionHeld:625000, ldApplicable:false, ldAmount:0, retentionRelease:'Sep 2026' },
  { name:'KR Plumbing Services', workPackage:'Plumbing & Fire', contractValue:12000000, billedAmount:9000000, amountPaid:7500000, retentionHeld:450000, ldApplicable:true, ldAmount:180000, retentionRelease:'Aug 2026' },
  { name:'Gupta Interiors Pvt Ltd', workPackage:'Interior Finishing', contractValue:22000000, billedAmount:8000000, amountPaid:7200000, retentionHeld:400000, ldApplicable:false, ldAmount:0, retentionRelease:'Nov 2026' },
  { name:'M/s Rajput Steel Works', workPackage:'Steel & Fabrication', contractValue:15000000, billedAmount:14000000, amountPaid:12500000, retentionHeld:700000, ldApplicable:true, ldAmount:225000, retentionRelease:'Jun 2026' },
  { name:'ABC Waterproofing', workPackage:'Waterproofing', contractValue:5500000, billedAmount:4800000, amountPaid:4200000, retentionHeld:240000, ldApplicable:false, ldAmount:0, retentionRelease:'May 2026' },
  { name:'Green Landscaping Co.', workPackage:'Landscaping', contractValue:8000000, billedAmount:2000000, amountPaid:1800000, retentionHeld:100000, ldApplicable:false, ldAmount:0, retentionRelease:'Dec 2026' },
  { name:'Verma HVAC Solutions', workPackage:'HVAC & MEP', contractValue:16000000, billedAmount:10000000, amountPaid:8500000, retentionHeld:500000, ldApplicable:true, ldAmount:320000, retentionRelease:'Oct 2026' },
  { name:'Singh Elevators', workPackage:'Elevator Installation', contractValue:14000000, billedAmount:6000000, amountPaid:5500000, retentionHeld:300000, ldApplicable:false, ldAmount:0, retentionRelease:'Jan 2027' },
  { name:'National Painters', workPackage:'Painting', contractValue:7500000, billedAmount:5500000, amountPaid:4800000, retentionHeld:275000, ldApplicable:true, ldAmount:112500, retentionRelease:'Aug 2026' },
];

contractors.forEach(c => { c.duesPending = c.billedAmount - c.amountPaid - c.retentionHeld; });

const totalRetention = contractors.reduce((s, c) => s + c.retentionHeld, 0);
const totalLD = contractors.reduce((s, c) => s + c.ldAmount, 0);
const totalDues = contractors.reduce((s, c) => s + c.duesPending, 0);
const overdueCount = contractors.filter(c => c.duesPending > 500000).length;

const cs = { background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', padding:'20px', height:'100%' };
const th = { padding:'12px 10px', fontSize:'0.68rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.4px', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const td = { padding:'12px 10px', fontSize:'0.8rem', fontWeight:500, color:'#475569', verticalAlign:'middle' };

const months = ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan 27'];
const retentionTimeline = months.map(m => {
  const items = contractors.filter(c => c.retentionRelease.startsWith(m.slice(0,3)));
  return { month: m, contractors: items, total: items.reduce((s, c) => s + c.retentionHeld, 0) };
}).filter(m => m.contractors.length > 0);

const SubcontractorPaymentTracker = () => {
  const duesChartData = {
    labels: contractors.map(c => c.name.length > 18 ? c.name.slice(0,18)+'…' : c.name),
    datasets: [{ label:'Dues Pending (₹)', data:contractors.map(c => c.duesPending), backgroundColor:contractors.map(c => c.duesPending > 1000000 ? '#ef4444' : c.duesPending > 500000 ? '#f59e0b' : '#22c55e'), borderRadius:6, barPercentage:0.6 }]
  };
  const duesChartOpts = { indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:ctx => formatINR(ctx.raw) } } }, scales:{ x:{ grid:{color:'rgba(0,0,0,0.04)'}, ticks:{ callback:v=>formatINR(v), font:{size:9} } }, y:{ grid:{display:false}, ticks:{ font:{size:9,weight:'600'} } } } };

  return (
    <div style={{ marginBottom:'32px' }}>
      <div style={{ marginBottom:'20px' }}>
        <h4 style={{ fontWeight:800, color:'#0f172a', margin:0, display:'flex', alignItems:'center', gap:'10px' }}><FiUsers color="#2563eb" />Subcontractor Payment & LD Tracker</h4>
        <p style={{ fontSize:'0.85rem', color:'#64748b', margin:'4px 0 0', fontWeight:500 }}>Payment tracking · Retention management · Liquidated damages</p>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3} sm={6}><div style={{...cs,borderLeft:'4px solid #f59e0b'}}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Total Retention Held</span>
          <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#0f172a', marginTop:'8px' }}>{formatINR(totalRetention)}</div>
        </div></Col>
        <Col md={3} sm={6}><div style={{...cs,borderLeft:'4px solid #ef4444'}}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Total LD Applied</span>
          <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#dc2626', marginTop:'8px' }}>{formatINR(totalLD)}</div>
        </div></Col>
        <Col md={3} sm={6}><div style={{...cs,borderLeft:'4px solid #2563eb'}}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Total Dues Pending</span>
          <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#1e40af', marginTop:'8px' }}>{formatINR(totalDues)}</div>
        </div></Col>
        <Col md={3} sm={6}><div style={{...cs,borderLeft:'4px solid #ef4444'}}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Overdue Payments</span>
          <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#dc2626', marginTop:'8px' }}>{overdueCount} <span style={{ fontSize:'0.85rem', color:'#64748b' }}>contractors</span></div>
        </div></Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={7}>
          <div style={{...cs, padding:0, overflow:'hidden'}}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #e2e8f0' }}>
              <h6 style={{ margin:0, fontSize:'0.8rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Payment Details</h6>
            </div>
            <div style={{ maxHeight:'440px', overflowY:'auto' }}>
              <Table striped hover responsive className="mb-0" style={{ fontSize:'0.78rem' }}>
                <thead style={{ position:'sticky', top:0, background:'#f8fafc', zIndex:1 }}>
                  <tr><th style={th}>Contractor</th><th style={th}>Work Pkg</th><th style={th}>Contract</th><th style={th}>Billed</th><th style={th}>Paid</th><th style={th}>Retention</th><th style={th}>Dues</th><th style={{...th,textAlign:'center'}}>LD</th><th style={th}>LD Amt</th></tr>
                </thead>
                <tbody>
                  {contractors.map((c, i) => (
                    <tr key={i} style={c.ldApplicable ? { background:'rgba(239,68,68,0.04)' } : {}}>
                      <td style={{...td,fontWeight:700,color:'#0f172a',maxWidth:'140px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</td>
                      <td style={{...td,fontSize:'0.75rem'}}>{c.workPackage}</td>
                      <td style={{...td,fontWeight:600}}>{formatINR(c.contractValue)}</td>
                      <td style={td}>{formatINR(c.billedAmount)}</td>
                      <td style={{...td,color:'#16a34a'}}>{formatINR(c.amountPaid)}</td>
                      <td style={{...td,color:'#d97706'}}>{formatINR(c.retentionHeld)}</td>
                      <td style={{...td,fontWeight:700,color:c.duesPending > 1000000 ? '#dc2626' : '#475569'}}>{formatINR(c.duesPending)}</td>
                      <td style={{...td,textAlign:'center'}}><span style={{ padding:'2px 8px', borderRadius:'20px', fontSize:'0.68rem', fontWeight:700, background: c.ldApplicable ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: c.ldApplicable ? '#dc2626' : '#16a34a' }}>{c.ldApplicable ? 'Yes' : 'No'}</span></td>
                      <td style={{...td,fontWeight:600,color:'#dc2626'}}>{c.ldAmount > 0 ? formatINR(c.ldAmount) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
        <Col lg={5}>
          <div style={cs}>
            <h6 style={{ fontSize:'0.8rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', marginBottom:'16px' }}>Dues Pending by Contractor</h6>
            <div style={{ height:'360px' }}><Bar data={duesChartData} options={duesChartOpts} /></div>
          </div>
        </Col>
      </Row>

      {/* Retention Release Timeline */}
      <div style={cs}>
        <h6 style={{ fontSize:'0.8rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
          <FiClock /> Retention Release Schedule
        </h6>
        <div style={{ display:'flex', gap:'0', overflowX:'auto', paddingBottom:'8px' }}>
          {retentionTimeline.map((m, i) => (
            <div key={i} style={{ minWidth:'140px', borderLeft:'2px solid #2563eb', paddingLeft:'16px', marginRight:'20px', position:'relative' }}>
              <div style={{ position:'absolute', left:'-6px', top:'0', width:'10px', height:'10px', borderRadius:'50%', background:'#2563eb' }} />
              <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#0f172a', marginBottom:'6px' }}>{m.month}</div>
              <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#2563eb', marginBottom:'4px' }}>{formatINR(m.total)}</div>
              {m.contractors.map((c, j) => (
                <div key={j} style={{ fontSize:'0.72rem', color:'#64748b', marginBottom:'2px' }}>
                  {c.name.split(' ').slice(0,2).join(' ')} — {formatINR(c.retentionHeld)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubcontractorPaymentTracker;
