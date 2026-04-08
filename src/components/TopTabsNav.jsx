import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiPieChart, FiTruck, FiHardDrive, FiBox, FiTrendingUp, FiShoppingBag, FiLayers } from 'react-icons/fi';

const TopTabsNav = () => {
  return (
    <div className="d-flex align-items-center gap-2 px-4 py-2 bg-white border-bottom border-slate-200 sticky-top shadow-sm" style={{ zIndex: 1010, top: '53px' }}>
      <NavLink to="/" className={({ isActive }) => (isActive ? 'admin-pill active' : 'admin-pill')} end>
        <FiPieChart size={14} />
        <span>Executive Summary</span>
      </NavLink>
      <NavLink to="/vendors" className={({ isActive }) => (isActive ? 'admin-pill active' : 'admin-pill')}>
        <FiShoppingBag size={14} />
        <span>Vendors</span>
      </NavLink>
      <NavLink to="/contractors" className={({ isActive }) => (isActive ? 'admin-pill active' : 'admin-pill')}>
        <FiTruck size={14} />
        <span>Contractors</span>
      </NavLink>
      <NavLink to="/inventory" className={({ isActive }) => (isActive ? 'admin-pill active' : 'admin-pill')}>
        <FiHardDrive size={14} />
        <span>Inventory</span>
      </NavLink>
      <NavLink to="/marketing" className={({ isActive }) => (isActive ? 'admin-pill active' : 'admin-pill')}>
        <FiLayers size={14} />
        <span>Marketing</span>
      </NavLink>
      <div className="vr mx-2" style={{ height: '20px', opacity: 0.1 }}></div>
      <NavLink to="/construction-analytics" className={({ isActive }) => (isActive ? 'admin-pill analytics active' : 'admin-pill analytics')}>
        <FiBox size={14} />
        <span>Construction Ledger</span>
      </NavLink>
      <NavLink to="/real-estate-analytics" className={({ isActive }) => (isActive ? 'admin-pill realestate active' : 'admin-pill realestate')}>
        <FiTrendingUp size={14} />
        <span>Market Insights</span>
      </NavLink>

      <style>
        {`
          .admin-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            text-decoration: none;
            color: #64748b;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 8px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .admin-pill:hover {
            background-color: #f8fafc;
            color: #1e293b;
          }
          .admin-pill.active {
            background-color: #eff6ff;
            color: #2563eb;
            box-shadow: inset 0 0 0 1px #dbeafe;
          }
          .admin-pill.analytics.active {
            background-color: #fefce8;
            color: #ca8a04;
            box-shadow: inset 0 0 0 1px #fef9c3;
          }
          .admin-pill.realestate.active {
            background-color: #ecfdf5;
            color: #10b981;
            box-shadow: inset 0 0 0 1px #d1fae5;
          }
          .vr { width: 1px; background-color: #e2e8f0; height: 20px; }
        `}
      </style>
    </div>
  );
};

export default TopTabsNav;
