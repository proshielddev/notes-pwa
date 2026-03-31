import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calculator, Columns,
  Calendar, Truck, CreditCard, Menu, X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard',  end: true },
  { to: '/leads',     icon: Users,           label: 'Leads' },
  { to: '/estimation',icon: Calculator,      label: 'Estimation' },
  { to: '/pipeline',  icon: Columns,         label: 'Pipeline' },
  { to: '/schedule',  icon: Calendar,        label: 'Schedule' },
  { to: '/jobs',      icon: Truck,           label: 'Active Jobs' },
  { to: '/payments',  icon: CreditCard,      label: 'Payments' },
];

// Mobile bottom nav — 5 highest-priority items
const MOBILE_NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dash',   end: true },
  { to: '/leads',     icon: Users,           label: 'Leads' },
  { to: '/estimation',icon: Calculator,      label: 'Estimate' },
  { to: '/jobs',      icon: Truck,           label: 'Jobs' },
  { to: '/payments',  icon: CreditCard,      label: 'Payments' },
];

const NavItem = ({ to, icon: Icon, label, end, size = 20, compact = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    style={compact ? { flexDirection: 'column', height: '100%', width: '100%', fontSize: '0.68rem', gap: '0.2rem' } : {}}
  >
    <Icon size={size} />
    <span>{label}</span>
  </NavLink>
);

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">

      {/* ── DESKTOP SIDEBAR ─────────────────────────── */}
      <aside className="sidebar">
        {/* Brand */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Murrey's<br />
            <span style={{ color: 'var(--color-accent)' }}>Movers</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
            Operating System
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {NAV_ITEMS.map(item => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
          v1.0 · One Truck. One Team.
        </div>
      </aside>

      {/* ── MOBILE HEADER ───────────────────────────── */}
      <header className="mobile-header">
        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--color-primary)' }}>
          Murrey's <span style={{ color: 'var(--color-accent)' }}>Movers</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ── MOBILE SLIDE-DOWN FULL MENU ─────────────── */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 52, left: 0, right: 0, zIndex: 100,
          backgroundColor: 'var(--color-primary)', padding: '0.5rem 0 1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: '0.75rem', padding: '0.85rem 1.5rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', height: 'auto' }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── MOBILE BOTTOM NAV (5 items) ─────────────── */}
      <nav className="bottom-nav">
        {MOBILE_NAV.map(item => (
          <NavItem key={item.to} {...item} icon={item.icon} size={22} compact />
        ))}
      </nav>
    </div>
  );
}
