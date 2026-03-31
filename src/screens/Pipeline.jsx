import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { StatusChip } from '../components/ui';
import { ChevronRight } from 'lucide-react';

const COLUMNS = [
  { key: 'New Lead',         color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'Estimating',       color: '#B45309', bg: '#FFFBEB' },
  { key: 'Quote Sent',       color: '#6D28D9', bg: '#F5F3FF' },
  { key: 'Follow-up Needed', color: '#C2410C', bg: '#FFF7ED' },
  { key: 'Awaiting Deposit', color: '#B91C1C', bg: '#FEF2F2' },
  { key: 'Booked',           color: '#047857', bg: '#ECFDF5' },
];

export default function Pipeline() {
  const { leads } = useAppContext();
  const navigate = useNavigate();

  const getLeads = (status) => leads.filter(l => l.status === status);
  const total = leads.reduce((s, l) => s + (l.estimateTotal || 0), 0);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>Pipeline</h1>
        <p className="text-muted text-sm">{leads.length} leads · ${total.toLocaleString()} total value</p>
      </div>

      {/* Mobile: Stacked columns */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {COLUMNS.map(col => {
          const colLeads = getLeads(col.key);
          return (
            <div key={col.key} style={{ borderRadius: 'var(--radius-lg)', border: `1px solid ${col.color}22`, overflow: 'hidden' }}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: col.bg, borderBottom: `2px solid ${col.color}33` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: col.color }} />
                  <span style={{ fontWeight: '700', fontSize: '0.875rem', color: col.color }}>{col.key}</span>
                </div>
                <span style={{ backgroundColor: col.color, color: 'white', borderRadius: 'var(--radius-full)', padding: '0.1rem 0.6rem', fontSize: '0.75rem', fontWeight: '700' }}>
                  {colLeads.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: colLeads.length === 0 ? '1rem' : '0.5rem' }}>
                {colLeads.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-mutated)', fontSize: '0.8rem', padding: '0.5rem 0' }}>
                    No leads here
                  </div>
                ) : colLeads.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}/estimate`)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.75rem', marginBottom: '0.5rem', cursor: 'pointer',
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                      backgroundColor: 'white', transition: 'box-shadow 0.2s',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{lead.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mutated)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lead.moveSize} · {lead.moveDate}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--color-primary)' }}>${lead.estimateTotal?.toLocaleString()}</span>
                      <ChevronRight size={14} style={{ color: 'var(--color-text-mutated)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
