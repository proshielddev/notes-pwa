import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, StatusChip } from '../components/ui';
import { Plus, Search, ChevronRight, Phone, Mail } from 'lucide-react';

const STATUSES = ['All', 'New Lead', 'Estimating', 'Quote Sent', 'Follow-up Needed', 'Awaiting Deposit', 'Booked'];

export default function LeadsList() {
  const { leads } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = leads.filter(l => {
    const matchSearch = l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) || l.id.includes(search);
    const matchFilter = filter === 'All' || l.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>Leads</h1>
          <p className="text-muted text-sm">{leads.length} total leads</p>
        </div>
        <button
          id="leads-new-btn"
          onClick={() => navigate('/leads/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            backgroundColor: 'var(--color-accent)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-md)',
            padding: '0.6rem 1rem', fontWeight: '700', fontSize: '0.875rem',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(242,100,25,0.35)',
          }}
        >
          <Plus size={16} /> New Lead
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 'var(--spacing-md)' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-mutated)' }} />
        <input
          id="leads-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, or ID…"
          style={{
            width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
            fontSize: '0.9rem', backgroundColor: 'var(--color-surface)',
            fontFamily: 'var(--font-family)',
          }}
        />
      </div>

      {/* Status Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: 'var(--spacing-md)' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filter === s ? 'var(--color-primary)' : 'var(--color-border)',
              backgroundColor: filter === s ? 'var(--color-primary)' : 'var(--color-surface)',
              color: filter === s ? 'white' : 'var(--color-text-mutated)',
              fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >{s}</button>
        ))}
      </div>

      {/* Leads */}
      {filtered.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-mutated)' }}>
            No leads found.
          </div>
        </Card>
      ) : filtered.map(lead => (
        <Card key={lead.id} onClick={() => navigate(`/leads/${lead.id}/estimate`)}>
          <div className="flex items-start justify-between" style={{ gap: '0.75rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>{lead.customerName}</span>
                <span className="text-xs text-muted">{lead.id}</span>
              </div>
              <div className="text-sm text-muted" style={{ marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lead.moveSize} · {lead.pickupAddress}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>
                <span className="text-xs text-muted">📅 {lead.moveDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--color-primary)' }}>${lead.estimateTotal?.toLocaleString()}</div>
                <StatusChip status={lead.status} />
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-mutated)' }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
