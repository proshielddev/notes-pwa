import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, StatusChip } from '../components/ui';
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Schedule() {
  const { jobs } = useAppContext();
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const getJobsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return jobs.filter(j => j.date === dateStr);
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  // Jobs this month
  const monthJobs = jobs.filter(j => {
    const [y, m] = j.date.split('-');
    return parseInt(y) === year && parseInt(m) === month + 1;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>Schedule</h1>
      <p className="text-muted text-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>{monthJobs.length} job{monthJobs.length !== 1 ? 's' : ''} this month</p>

      {/* Calendar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}>
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: 'var(--spacing-lg)' }}>
        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--color-border)' }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-mutated)' }}>{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} style={{ minHeight: 60, borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }} />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const dayJobs = getJobsForDay(day);
            const isToday = dateStr === todayStr;
            return (
              <div key={day} style={{ minHeight: 60, padding: '0.3rem', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', backgroundColor: isToday ? '#EFF6FF' : 'white', position: 'relative' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: isToday ? 'var(--color-primary)' : 'transparent', color: isToday ? 'white' : 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: isToday ? '700' : '400', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  {day}
                </div>
                {dayJobs.map(j => (
                  <div key={j.id} onClick={() => navigate(`/jobs/${j.id}/execute`)}
                    style={{ backgroundColor: 'var(--color-accent)', borderRadius: 3, padding: '1px 4px', fontSize: '0.65rem', color: 'white', fontWeight: '600', cursor: 'pointer', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {j.customerName.split(' ')[0]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Jobs List */}
      <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: 'var(--spacing-md)' }}>Jobs This Month</h2>
      {monthJobs.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-mutated)' }}>
            <Truck size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
            <p style={{ margin: 0 }}>No jobs scheduled this month</p>
          </div>
        </Card>
      ) : monthJobs.sort((a, b) => a.date.localeCompare(b.date)).map(job => (
        <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}/execute`)}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontWeight: '700', marginBottom: '0.2rem' }}>{job.customerName}</div>
              <div className="text-sm text-muted">{job.date} · {job.crew?.join(', ')}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <StatusChip status={job.status} />
              <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '0.25rem' }}>${job.estimateTotal?.toLocaleString()}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
