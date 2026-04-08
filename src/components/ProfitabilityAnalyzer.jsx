import React, { useState, useMemo } from 'react';
import { Row, Col, Table, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FiDollarSign, FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatINR = (val) => {
  if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const projectsData = {
  'Skyline Tower': {
    unitTypes: ['2 BHK', '3 BHK', '4 BHK Duplex'],
    units: [
      { unitNo:'A-101',type:'2 BHK',area:980,sellingPrice:7840000,landCost:1568000,constructionCost:3430000,approvalCost:235000,marketingCost:156800,financingCost:313600,brokerCommission:156800,status:'Sold',budgetMargin:18.5 },
      { unitNo:'A-102',type:'2 BHK',area:1020,sellingPrice:8160000,landCost:1632000,constructionCost:3570000,approvalCost:244800,marketingCost:163200,financingCost:326400,brokerCommission:163200,status:'Sold',budgetMargin:18.5 },
      { unitNo:'A-201',type:'3 BHK',area:1450,sellingPrice:13050000,landCost:2610000,constructionCost:5220000,approvalCost:391500,marketingCost:261000,financingCost:522000,brokerCommission:261000,status:'Sold',budgetMargin:20.0 },
      { unitNo:'A-202',type:'3 BHK',area:1480,sellingPrice:13320000,landCost:2664000,constructionCost:5328000,approvalCost:399600,marketingCost:266400,financingCost:532800,brokerCommission:266400,status:'Available',budgetMargin:20.0 },
      { unitNo:'A-301',type:'4 BHK Duplex',area:2200,sellingPrice:24200000,landCost:4840000,constructionCost:8470000,approvalCost:726000,marketingCost:484000,financingCost:968000,brokerCommission:484000,status:'Blocked',budgetMargin:22.0 },
      { unitNo:'A-302',type:'4 BHK Duplex',area:2350,sellingPrice:25850000,landCost:5170000,constructionCost:9047500,approvalCost:775500,marketingCost:517000,financingCost:1034000,brokerCommission:517000,status:'Available',budgetMargin:22.0 },
      { unitNo:'B-101',type:'2 BHK',area:950,sellingPrice:7600000,landCost:1520000,constructionCost:3420000,approvalCost:228000,marketingCost:152000,financingCost:304000,brokerCommission:152000,status:'Sold',budgetMargin:18.5 },
      { unitNo:'B-201',type:'3 BHK',area:1500,sellingPrice:13500000,landCost:2700000,constructionCost:5400000,approvalCost:405000,marketingCost:270000,financingCost:540000,brokerCommission:270000,status:'Sold',budgetMargin:20.0 },
    ]
  },
  'Green Valley Ph-2': {
    unitTypes: ['1 BHK', '2 BHK', '3 BHK'],
    units: [
      { unitNo:'GV-101',type:'1 BHK',area:650,sellingPrice:3575000,landCost:715000,constructionCost:1625000,approvalCost:107250,marketingCost:71500,financingCost:143000,brokerCommission:71500,status:'Sold',budgetMargin:15.0 },
      { unitNo:'GV-102',type:'1 BHK',area:680,sellingPrice:3740000,landCost:748000,constructionCost:1700000,approvalCost:112200,marketingCost:74800,financingCost:149600,brokerCommission:74800,status:'Available',budgetMargin:15.0 },
      { unitNo:'GV-201',type:'2 BHK',area:985,sellingPrice:6402500,landCost:1280500,constructionCost:2857000,approvalCost:192075,marketingCost:128050,financingCost:256100,brokerCommission:128050,status:'Sold',budgetMargin:17.0 },
      { unitNo:'GV-301',type:'3 BHK',area:1400,sellingPrice:10500000,landCost:2100000,constructionCost:4200000,approvalCost:315000,marketingCost:210000,financingCost:420000,brokerCommission:210000,status:'Available',budgetMargin:19.0 },
    ]
  },
  'Sunrise Heights': {
    unitTypes: ['2 BHK', '3 BHK'],
    units: [
      { unitNo:'SH-101',type:'2 BHK',area:1050,sellingPrice:7350000,landCost:1470000,constructionCost:3412500,approvalCost:220500,marketingCost:147000,financingCost:294000,brokerCommission:147000,status:'Sold',budgetMargin:16.5 },
      { unitNo:'SH-201',type:'3 BHK',area:1550,sellingPrice:12400000,landCost:2480000,constructionCost:5425000,approvalCost:372000,marketingCost:248000,financingCost:496000,brokerCommission:248000,status:'Sold',budgetMargin:18.5 },
      { unitNo:'SH-202',type:'3 BHK',area:1600,sellingPrice:12800000,landCost:2560000,constructionCost:5600000,approvalCost:384000,marketingCost:256000,financingCost:512000,brokerCommission:256000,status:'Available',budgetMargin:18.5 },
    ]
  }
};

Object.values(projectsData).forEach(p => p.units.forEach(u => {
  u.totalCost = u.landCost + u.constructionCost + u.approvalCost + u.marketingCost + u.financingCost;
  u.grossMargin = u.sellingPrice - u.totalCost;
  u.grossMarginPct = (u.grossMargin / u.sellingPrice) * 100;
  u.netProfit = u.grossMargin - u.brokerCommission;
  u.netProfitPct = (u.netProfit / u.sellingPrice) * 100;
}));

const cs = { background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', padding:'20px', height:'100%' };
const th = { padding:'12px 14px', fontSize:'0.7rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap', cursor:'pointer' };
const td = { padding:'12px 14px', fontSize:'0.82rem', fontWeight:500, color:'#475569', verticalAlign:'middle' };
const sb = { Sold:{bg:'rgba(34,197,94,0.1)',c:'#16a34a'}, Available:{bg:'rgba(37,99,235,0.1)',c:'#1e40af'}, Blocked:{bg:'rgba(245,158,11,0.1)',c:'#d97706'} };

const mh = (m) => m > 15 ? {l:'Healthy',c:'#22c55e',bg:'rgba(34,197,94,0.1)'} : m >= 8 ? {l:'Moderate',c:'#f59e0b',bg:'rgba(245,158,11,0.1)'} : {l:'At Risk',c:'#ef4444',bg:'rgba(239,68,68,0.1)'};

const ProfitabilityAnalyzer = () => {
  const pNames = Object.keys(projectsData);
  const [selProj, setSelProj] = useState(pNames[0]);
  const [selType, setSelType] = useState('All');
  const [sField, setSField] = useState('unitNo');
  const [sDir, setSDir] = useState('asc');

  const proj = projectsData[selProj];
  const uTypes = ['All', ...proj.unitTypes];

  const filtered = useMemo(() => {
    let u = selType === 'All' ? proj.units : proj.units.filter(x => x.type === selType);
    return [...u].sort((a, b) => {
      let c = 0;
      if (sField === 'unitNo') c = a.unitNo.localeCompare(b.unitNo);
      else if (sField === 'area') c = a.area - b.area;
      else if (sField === 'sellingPrice') c = a.sellingPrice - b.sellingPrice;
      else if (sField === 'netProfitPct') c = a.netProfitPct - b.netProfitPct;
      return sDir === 'asc' ? c : -c;
    });
  }, [selProj, selType, sField, sDir, proj.units]);

  const detail = useMemo(() => {
    if (selType === 'All') return proj.units[0];
    return proj.units.find(u => u.type === selType) || proj.units[0];
  }, [selType, proj.units]);

  const health = mh(detail.netProfitPct);
  const chartTypes = proj.unitTypes;
  const budgetM = chartTypes.map(t => { const u = proj.units.find(x => x.type === t); return u ? u.budgetMargin : 0; });
  const actualM = chartTypes.map(t => { const us = proj.units.filter(x => x.type === t); return us.length ? us.reduce((s,x) => s + x.netProfitPct, 0) / us.length : 0; });

  const chartData = {
    labels: chartTypes,
    datasets: [
      { label:'Budget Margin %', data:budgetM, backgroundColor:'#2563eb', borderRadius:6, barPercentage:0.5 },
      { label:'Actual Margin %', data:actualM.map(v => +v.toFixed(1)), backgroundColor:actualM.map(v => v >= 15 ? '#22c55e' : v >= 8 ? '#f59e0b' : '#ef4444'), borderRadius:6, barPercentage:0.5 }
    ]
  };
  const chartOpts = { indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ usePointStyle:true, boxWidth:8, font:{ size:10, weight:'600' } } }, tooltip:{ callbacks:{ label:(ctx) => `${ctx.dataset.label}: ${ctx.raw}%` } } }, scales:{ x:{ grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ callback:v => v+'%', font:{ size:10 } } }, y:{ grid:{ display:false }, ticks:{ font:{ size:11, weight:'600' } } } } };

  const doSort = (f) => { if (sField === f) setSDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSField(f); setSDir('asc'); } };
  const SI = ({ f }) => sField !== f ? <FiMinus size={10} style={{ opacity:0.3, marginLeft:4 }} /> : sDir === 'asc' ? <FiArrowUp size={10} style={{ marginLeft:4 }} /> : <FiArrowDown size={10} style={{ marginLeft:4 }} />;

  const plRows = [
    { l:'Selling Price', v:detail.sellingPrice, b:true, c:'#0f172a' },
    { l:'Land Cost (allocated)', v:-detail.landCost, c:'#475569' },
    { l:'Construction Cost', v:-detail.constructionCost, c:'#475569' },
    { l:'Approval & Legal', v:-detail.approvalCost, c:'#475569' },
    { l:'Marketing Cost', v:-detail.marketingCost, c:'#475569' },
    { l:'Financing Cost', v:-detail.financingCost, c:'#475569' },
    { l:'Total Cost', v:detail.totalCost, b:true, c:'#dc2626', d:true },
    { l:`Gross Margin (${detail.grossMarginPct.toFixed(1)}%)`, v:detail.grossMargin, b:true, c:'#16a34a', d:true },
    { l:'Broker Commission', v:-detail.brokerCommission, c:'#475569' },
    { l:`Net Profit (${detail.netProfitPct.toFixed(1)}%)`, v:detail.netProfit, b:true, c:health.c, d:true }
  ];

  return (
    <div style={{ marginBottom:'32px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px', marginBottom:'20px' }}>
        <div>
          <h4 style={{ fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.02em', display:'flex', alignItems:'center', gap:'10px' }}><FiDollarSign color="#2563eb" />Profitability Per Unit Analyzer</h4>
          <p style={{ fontSize:'0.85rem', color:'#64748b', margin:'4px 0 0', fontWeight:500 }}>Unit-level P&L · Margin comparison · Cost analysis</p>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <Form.Select size="sm" value={selProj} onChange={e => { setSelProj(e.target.value); setSelType('All'); }} style={{ fontSize:'0.82rem', fontWeight:600, minWidth:'180px' }}>{pNames.map(p => <option key={p}>{p}</option>)}</Form.Select>
          <Form.Select size="sm" value={selType} onChange={e => setSelType(e.target.value)} style={{ fontSize:'0.82rem', fontWeight:600, minWidth:'130px' }}>{uTypes.map(t => <option key={t}>{t}</option>)}</Form.Select>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col lg={5}>
          <div style={cs}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <h6 style={{ margin:0, fontSize:'0.8rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>Unit P&L — {detail.unitNo} ({detail.type})</h6>
              <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:700, background:health.bg, color:health.c }}>{health.l}</span>
            </div>
            {plRows.map((r, i) => (
              <div key={i}>
                {r.d && <div style={{ height:'1px', background:'#e2e8f0', margin:'8px 0' }} />}
                <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:'0.82rem', fontWeight:r.b ? 700 : 500, color:r.c }}>
                  <span>{r.l}</span><span>{r.v < 0 ? `(${formatINR(Math.abs(r.v))})` : formatINR(r.v)}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop:'12px', padding:'10px', background:'#f8fafc', borderRadius:'8px', fontSize:'0.78rem', color:'#64748b' }}>
              <strong>Area:</strong> {detail.area.toLocaleString('en-IN')} sq ft · <strong>Rate:</strong> ₹{(detail.sellingPrice / detail.area).toLocaleString('en-IN', { maximumFractionDigits:0 })}/sq ft
            </div>
          </div>
        </Col>
        <Col lg={7}>
          <div style={cs}>
            <h6 style={{ fontSize:'0.8rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', marginBottom:'16px' }}>Budget vs Actual Margin — {selProj}</h6>
            <div style={{ height:'200px' }}><Bar data={chartData} options={chartOpts} /></div>
            <div style={{ marginTop:'16px', display:'flex', gap:'12px', flexWrap:'wrap' }}>
              {chartTypes.map((t, i) => { const h = mh(actualM[i]); return (
                <div key={t} style={{ padding:'8px 14px', borderRadius:'8px', background:h.bg, border:`1px solid ${h.c}30`, fontSize:'0.78rem' }}>
                  <span style={{ fontWeight:700 }}>{t}</span> <span style={{ fontWeight:700, color:h.c, marginLeft:'8px' }}>{actualM[i].toFixed(1)}% — {h.l}</span>
                </div>
              ); })}
            </div>
          </div>
        </Col>
      </Row>

      <div style={{ ...cs, padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between' }}>
          <h6 style={{ margin:0, fontSize:'0.8rem', fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>All Units — {selProj}</h6>
          <span style={{ fontSize:'0.75rem', color:'#94a3b8', fontWeight:600 }}>{filtered.length} units · {filtered.filter(u=>u.status==='Sold').length} sold</span>
        </div>
        <div style={{ maxHeight:'400px', overflowY:'auto' }}>
          <Table striped hover responsive className="mb-0" style={{ fontSize:'0.82rem' }}>
            <thead style={{ position:'sticky', top:0, background:'#f8fafc', zIndex:1 }}>
              <tr>
                <th style={th} onClick={()=>doSort('unitNo')}>Unit <SI f="unitNo" /></th>
                <th style={th}>Type</th>
                <th style={th} onClick={()=>doSort('area')}>Area <SI f="area" /></th>
                <th style={th} onClick={()=>doSort('sellingPrice')}>Price <SI f="sellingPrice" /></th>
                <th style={th}>Cost</th>
                <th style={th} onClick={()=>doSort('netProfitPct')}>Margin% <SI f="netProfitPct" /></th>
                <th style={{...th,textAlign:'center'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => { const h=mh(u.netProfitPct); const s=sb[u.status]; return (
                <tr key={u.unitNo}>
                  <td style={{...td,fontWeight:700,color:'#0f172a'}}>{u.unitNo}</td>
                  <td style={td}>{u.type}</td>
                  <td style={td}>{u.area.toLocaleString('en-IN')}</td>
                  <td style={{...td,fontWeight:600}}>{formatINR(u.sellingPrice)}</td>
                  <td style={td}>{formatINR(u.totalCost)}</td>
                  <td style={{...td,fontWeight:700,color:h.c}}>{u.netProfitPct.toFixed(1)}%</td>
                  <td style={{...td,textAlign:'center'}}><span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:700, background:s.bg, color:s.c }}>{u.status}</span></td>
                </tr>
              ); })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityAnalyzer;
