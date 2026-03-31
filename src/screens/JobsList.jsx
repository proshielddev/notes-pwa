import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, StatusChip } from '../components/ui';
import { Truck, ChevronRight } from 'lucide-react';

const FILTERS = ['All', 'Scheduled', 'Executing', 'Paused', 'Completed'];

export default function JobsList() {
  const { jobs } = useAppContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>Jobs</h1>
        <p className="text-muted text-sm">{jobs.length} total jobs</p>
      </div>

      {/* Status Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: 'var(--spacing-md)' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)', border: '1px solid',
            borderColor: filter === f ? 'var(--color-primary)' : 'var(--color-border)',
            backgroundColor: filter === f ? 'var(--color-primary)' : 'var(--color-surface)',
            color: filter === f ? 'white' : 'var(--color-text-mutated)',
            fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
          }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-mutated)' }}>
            <Truck size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
            <p style={{ margin: 0 }}>No jobs found</p>
          </div>
        </Card>
      ) : filtered.map(job => (
        <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}/execute`)}>
          <div className="flex items-start justify-between" style={{ gap: '0.75rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>{job.customerName}</span>
                <span className="text-xs text-muted">{job.id}</span>
              </div>
              <div className="text-sm text-muted" style={{ marginBottom: '0.4rem' }}>📅 {job.date}</div>
              <div className="text-sm text-muted">👷 {job.crew?.join(', ')}</div>
              {job.pickupAddress && (
                <div className="text-sm text-muted" style={{ marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  📍 {job.pickupAddress?.split(',')[0]}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>${job.estimateTotal?.toLocaleString()}</div>
                <StatusChip status={job.status} />
                <div className="text-xs text-muted" style={{ marginTop: '0.3rem' }}>Bal: ${job.balance?.toLocaleString()}</div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-mutated)' }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
