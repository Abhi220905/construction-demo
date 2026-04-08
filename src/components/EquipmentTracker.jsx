import React from 'react';
import { Row, Col, Table, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FiTool, FiAlertTriangle, FiActivity, FiDollarSign } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatINR = (v) => `₹${v.toLocaleString('en-IN')}`;

const equipment = [
  { id:1, name:'Tower Crane TC-200', type:'Crane', site:'Skyline Tower', status:'Active', utilization:88.5, nextMaintenance:'2026-04-12', dailyCost:18500 },
  { id:2, name:'Hydraulic Excavator JCB 220', type:'Excavator', site:'Green Valley Ph-2', status:'Active', utilization:92.3, nextMaintenance:'2026-04-20', dailyCost:12000 },
  { id:3, name:'Concrete Mixer RM-800', type:'Concrete Mixer', site:'Skyline Tower', status:'Active', utilization:78.4, nextMaintenance:'2026-04-18', dailyCost:5500 },
  { id:4, name:'Dumper Truck TD-10', type:'Dumper', site:'Sunrise Heights', status:'Active', utilization:71.2, nextMaintenance:'2026-04-25', dailyCost:8200 },
  { id:5, name:'Diesel Generator 125 KVA', type:'Generator', site:'Skyline Tower', status:'Active', utilization:65.0, nextMaintenance:'2026-05-01', dailyCost:4500 },
  { id:6, name:'Bar Bending Machine BBM-32', type:'Bar Bender', site:'Green Valley Ph-2', status:'Active', utilization:84.1, nextMaintenance:'2026-04-30', dailyCost:3200 },
  { id:7, name:'Concrete Pump CP-36M', type:'Concrete Pump', site:'Skyline Tower', status:'Under Maintenance', utilization:0, nextMaintenance:'2026-04-10', dailyCost:15000 },
  { id:8, name:'Mobile Crane 25T', type:'Crane', site:'Sunrise Heights', status:'Active', utilization:76.8, nextMaintenance:'2026-04-22', dailyCost:16000 },
  { id:9, name:'Backhoe Loader JCB 3DX', type:'Excavator', site:'Lakeview Residency', status:'Idle', utilization:12.5, nextMaintenance:'2026-04-28', dailyCost:9500 },
  { id:10, name:'Transit Mixer TM-6', type:'Concrete Mixer', site:'Skyline Tower', status:'Active', utilization:81.3, nextMaintenance:'2026-05-05', dailyCost:7800 },
  { id:11, name:'Vibratory Roller VR-10', type:'Roller', site:'Green Valley Ph-2', status:'Idle', utilization:8.0, nextMaintenance:'2026-04-15', dailyCost:6500 },
  { id:12, name:'Diesel Generator 250 KVA', type:'Generator', site:'Sunrise Heights', status:'Active', utilization:72.4, nextMaintenance:'2026-05-10', dailyCost:7200 },
  { id:13, name:'Passenger Hoist PH-2000', type:'Hoist', site:'Skyline Tower', status:'Active', utilization:90.1, nextMaintenance:'2026-04-09', dailyCost:11000 },
  { id:14, name:'Concrete Batching Plant 30M3', type:'Batching Plant', site:'Green Valley Ph-2', status:'Under Maintenance', utilization:0, nextMaintenance:'2026-04-08', dailyCost:22000 },
  { id:15, name:'Mini Excavator ME-35', type:'Excavator', site:'Lakeview Residency', status:'Idle', utilization:5.2, nextMaintenance:'2026-05-15', dailyCost:6000 },
];

const totalCount = equipment.length;
const activeEquip = equipment.filter(e => e.status === 'Active');
const avgUtil = activeEquip.length ? (activeEquip.reduce((s, e) => s + e.utilization, 0) / activeEquip.length).toFixed(1) : 0;
const idleEquip = equipment.filter(e => e.status === 'Idle');
const idleCostPerDay = idleEquip.reduce((s, e) => s + e.dailyCost, 0);

const today = new Date();
const maintenanceDue = equipment.filter(e => {
  const d = new Date(e.nextMaintenance);
  const diff = (d - today) / (1000 * 60 * 60 * 24);
  return diff <= 7 && diff >= 0;
});

const top8 = [...equipment].filter(e => e.status === 'Active').sort((a, b) => b.utilization - a.utilization).slice(0, 8);

const statusStyle = { Active:{bg:'rgba(34,197,94,0.1)',c:'#16a34a'}, Idle:{bg:'rgba(148,163,184,0.1)',c:'#64748b'}, 'Under Maintenance':{bg:'rgba(245,158,11,0.1)',c:'#d97706'} };
const cs = { background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', padding:'20px', height:'100%' };
const th = { padding:'12px 14px', fontSize:'0.7rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' };
const td = { padding:'12px 14px', fontSize:'0.82rem', fontWeight:500, color:'#475569', verticalAlign:'middle' };

const EquipmentTracker = () => {
  const chartData = {
    labels: top8.map(e => e.name.length > 20 ? e.name.slice(0, 20) + '…' : e.name),
    datasets: [{ label:'Utilization %', data:top8.map(e => e.utilization), backgroundColor:top8.map(e => e.utilization >= 80 ? '#22c55e' : e.utilization >= 60 ? '#f59e0b' : '#ef4444'), borderRadius:6, barPercentage:0.6 }]
  };
  const chartOpts = {
    indexAxis:'y', responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:ctx => `${ctx.raw}%` } } },
    scales:{ x:{ max:100, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ callback:v=>v+'%', font:{size:10} } }, y:{ grid:{display:false}, ticks:{ font:{size:10,weight:'600'} } } }
  };

  return (
    <div style={{ marginBottom:'32px' }}>
      <div style={{ marginBottom:'20px' }}>
        <h4 style={{ fontWeight:800, color:'#0f172a', margin:0, display:'flex', alignItems:'center', gap:'10px' }}><FiTool color="#2563eb" />Equipment & Machinery Tracker</h4>
        <p style={{ fontSize:'0.85rem', color:'#64748b', margin:'4px 0 0', fontWeight:500 }}>Fleet utilization · Maintenance scheduling · Idle cost tracking</p>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}><div style={{...cs,borderLeft:'4px solid #2563eb'}}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Total Equipment</span>
          <div style={{ fontSize:'2rem', fontWeight:800, color:'#0f172a', marginTop:'8px' }}>{totalCount}</div>
          <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'4px' }}>{activeEquip.length} Active · {idleEquip.length} Idle · {equipment.filter(e=>e.status==='Under Maintenance').length} Maintenance</div>
        </div></Col>
        <Col md={4}><div style={{...cs,borderLeft:`4px solid ${parseFloat(avgUtil) >= 75 ? '#22c55e' : '#f59e0b'}`}}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Avg Utilization</span>
          <div style={{ fontSize:'2rem', fontWeight:800, color: parseFloat(avgUtil) >= 75 ? '#16a34a' : '#d97706', marginTop:'8px' }}>{avgUtil}%</div>
          <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'4px' }}>Target: &gt; 75%</div>
        </div></Col>
        <Col md={4}><div style={{...cs,borderLeft:'4px solid #ef4444'}}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Idle Cost / Day</span>
          <div style={{ fontSize:'2rem', fontWeight:800, color:'#dc2626', marginTop:'8px' }}>{formatINR(idleCostPerDay)}</div>
          <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'4px' }}>{idleEquip.length} idle equipment burning cash</div>
        </div></Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={8}>
          <div style={{...cs, padding:0, overflow:'hidden'}}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between' }}>
              <h6 style={{ margin:0, fontSize:'0.8rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Equipment List</h6>
              <Badge bg="" style={{ background:'rgba(245,158,11,0.1)', color:'#d97706', fontSize:'0.7rem', fontWeight:700, padding:'4px 10px', borderRadius:'6px' }}>{maintenanceDue.length} Maintenance Due</Badge>
            </div>
            <div style={{ maxHeight:'420px', overflowY:'auto' }}>
              <Table striped hover responsive className="mb-0" style={{ fontSize:'0.8rem' }}>
                <thead style={{ position:'sticky', top:0, background:'#f8fafc', zIndex:1 }}>
                  <tr><th style={th}>Equipment</th><th style={th}>Type</th><th style={th}>Site</th><th style={{...th,textAlign:'center'}}>Status</th><th style={th}>Util%</th><th style={th}>Next Maint.</th><th style={th}>Daily Cost</th></tr>
                </thead>
                <tbody>
                  {equipment.map(e => { const ss = statusStyle[e.status]; return (
                    <tr key={e.id} style={e.status === 'Idle' ? {background:'rgba(148,163,184,0.03)'} : {}}>
                      <td style={{...td,fontWeight:700,color:'#0f172a',maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</td>
                      <td style={td}>{e.type}</td>
                      <td style={td}>{e.site}</td>
                      <td style={{...td,textAlign:'center'}}><span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:700, background:ss.bg, color:ss.c }}>{e.status}</span></td>
                      <td style={{...td,fontWeight:700,color:e.utilization >= 75 ? '#16a34a' : e.utilization >= 50 ? '#d97706' : '#64748b'}}>{e.utilization > 0 ? e.utilization+'%' : '—'}</td>
                      <td style={td}>{new Date(e.nextMaintenance).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</td>
                      <td style={{...td,fontWeight:600}}>{formatINR(e.dailyCost)}</td>
                    </tr>
                  ); })}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
        <Col lg={4}>
          <div style={cs}>
            <h6 style={{ fontSize:'0.8rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', marginBottom:'16px' }}>Top 8 by Utilization</h6>
            <div style={{ height:'320px' }}><Bar data={chartData} options={chartOpts} /></div>
          </div>
        </Col>
      </Row>

      {maintenanceDue.length > 0 && (
        <div style={cs}>
          <h6 style={{ fontSize:'0.8rem', fontWeight:700, color:'#d97706', textTransform:'uppercase', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px' }}>
            <FiAlertTriangle /> Maintenance Due Within 7 Days
          </h6>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'10px' }}>
            {maintenanceDue.map(e => (
              <div key={e.id} style={{ padding:'14px', border:'1px solid #fde68a', borderRadius:'8px', background:'#fffbeb' }}>
                <div style={{ fontWeight:700, color:'#0f172a', fontSize:'0.85rem' }}>{e.name}</div>
                <div style={{ fontSize:'0.75rem', color:'#92400e', marginTop:'4px' }}>
                  Due: {new Date(e.nextMaintenance).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})} · Site: {e.site}
                </div>
                <div style={{ fontSize:'0.72rem', color:'#64748b', marginTop:'2px' }}>Daily cost: {formatINR(e.dailyCost)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentTracker;
