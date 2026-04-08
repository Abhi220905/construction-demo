import React from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { FiBell, FiUser, FiSearch } from 'react-icons/fi';

const TopNavbar = () => {
  return (
    <div className="header">
      <div className="d-flex align-items-center">
        <h4 className="m-0" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Construction Overview</h4>
      </div>
      <div className="d-flex align-items-center gap-4">
        <div className="position-relative">
          <FiSearch style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="form-control bg-transparent text-white" 
            style={{ 
              paddingLeft: '35px', 
              borderColor: 'var(--border-glass)',
              color: 'var(--text-primary)'
            }} 
          />
        </div>
        <div className="position-relative cursor-pointer">
          <FiBell size={20} color="var(--text-secondary)" />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="d-flex align-items-center text-white border-0 shadow-none px-0">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center" 
              style={{ width: '35px', height: '35px', background: 'var(--surface-hover)' }}
            >
              <FiUser />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="bg-dark dropdown-menu-dark shadow-sm">
            <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
            <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
            <Dropdown.Divider style={{ borderColor: 'var(--border-glass)' }} />
            <Dropdown.Item href="#/logout">Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopNavbar;
