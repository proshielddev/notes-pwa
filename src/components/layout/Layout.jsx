import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Columns, Calendar, Truck, CreditCard } from 'lucide-react';

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default function Layout() {
  return (
    <div className="app-container">
      {/* Sidebar for Desktop */}
      <aside className="sidebar" style={{ display: window.innerWidth >= 768 ? 'flex' : 'none' }}>
        <div style={{ padding: '24px', fontSize: '1.25rem', fontWeight: 'bold' }}>
          Murrey's Movers
        </div>
        <nav style={{ flex: 1 }}>
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/leads" icon={<Users size={20} />} label="Leads" />
          <NavItem to="/pipeline" icon={<Columns size={20} />} label="Pipeline" />
          <NavItem to="/schedule" icon={<Calendar size={20} />} label="Schedule" />
          <NavItem to="/jobs" icon={<Truck size={20} />} label="Jobs" />
          <NavItem to="/payments" icon={<CreditCard size={20} />} label="Payments" />
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="bottom-nav">
        <NavItem to="/" icon={<LayoutDashboard size={24} />} label="Dash" />
        <NavItem to="/leads" icon={<Users size={24} />} label="Leads" />
        <NavItem to="/pipeline" icon={<Columns size={24} />} label="Pipeline" />
        <NavItem to="/schedule" icon={<Calendar size={24} />} label="Schedule" />
        <NavItem to="/jobs" icon={<Truck size={24} />} label="Jobs" />
      </nav>
    </div>
  );
}
