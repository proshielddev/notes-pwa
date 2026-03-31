import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Button, StatusChip } from '../components/ui';
import { ArrowLeft, Play, Pause, CheckSquare, Clock, MapPin, Users, AlertTriangle } from 'lucide-react';

const CHECKLIST_ITEMS = [
  'Walk-through complete with customer',
  'All fragile items wrapped',
  'Furniture padded and blankets in place',
  'Truck loaded & secured',
  'Driving to destination',
  'Unloading complete',
  'Customer walk-through at destination',
  'All items accounted for',
];

export default function JobExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob } = useAppContext();
  const job = jobs.find(j => j.id === id) || jobs[0];

  const [status, setStatus] = useState(job?.status || 'Scheduled');
  const [checked, setChecked] = useState({});
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  const toggle = (item) => setChecked(c => ({ ...c, [item]: !c[item] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const handleStatus = (newStatus) => {
    setStatus(newStatus);
    updateJob(job.id, { status: newStatus });
  };

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(n => [...n, { text: note, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNote('');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-mutated)' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: '1.4rem', marginBottom: 0 }}>{job?.customerName}</h1>
            <StatusChip status={status} />
          </div>
          <p className="text-muted text-sm">{job?.id} · {job?.date}</p>
        </div>
      </div>

      {/* Job Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: 'var(--spacing-md)' }}>
        {status === 'Scheduled' && (
          <Button variant="accent" fullWidth onClick={() => handleStatus('Executing')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}><Play size={16} /> Start Job</span>
          </Button>
        )}
        {status === 'Executing' && (<>
          <Button variant="secondary" onClick={() => handleStatus('Paused')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Pause size={16} /> Pause</span>
          </Button>
          <Button variant="accent" fullWidth onClick={() => navigate(`/jobs/${job.id}/closeout`)}>
            Complete & Close Out →
          </Button>
        </>)}
        {status === 'Paused' && (
          <Button variant="accent" fullWidth onClick={() => handleStatus('Executing')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}><Play size={16} /> Resume Job</span>
          </Button>
        )}
      </div>

      {/* Job Info */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
          <div className="flex items-start gap-2">
            <MapPin size={14} style={{ color: 'var(--color-accent)', marginTop: 2, flexShrink: 0 }} />
            <div><div className="text-muted" style={{ fontSize: '0.75rem' }}>Pickup</div><div style={{ fontWeight: '600' }}>{job?.pickupAddress?.split(',')[0]}</div></div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={14} style={{ color: 'var(--color-success)', marginTop: 2, flexShrink: 0 }} />
            <div><div className="text-muted" style={{ fontSize: '0.75rem' }}>Drop-off</div><div style={{ fontWeight: '600' }}>{job?.dropoffAddress?.split(',')[0]}</div></div>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} style={{ color: 'var(--color-primary)' }} />
            <div><div className="text-muted" style={{ fontSize: '0.75rem' }}>Crew</div><div style={{ fontWeight: '600' }}>{job?.crew?.join(', ')}</div></div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} style={{ color: 'var(--color-primary)' }} />
            <div><div className="text-muted" style={{ fontSize: '0.75rem' }}>Est. Total</div><div style={{ fontWeight: '600', color: 'var(--color-primary)' }}>${job?.estimateTotal?.toLocaleString()}</div></div>
          </div>
        </div>
        {job?.backupNote && (
          <div style={{ marginTop: '0.75rem', padding: '0.6rem', backgroundColor: '#FFFBEB', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={14} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '0.8rem', color: '#B45309' }}>{job.backupNote}</span>
          </div>
        )}
      </Card>

      {/* Progress Checklist */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)' }}>Job Checklist</div>
          <span className="text-sm text-muted">{checkedCount}/{CHECKLIST_ITEMS.length}</span>
        </div>
        {/* Progress Bar */}
        <div style={{ height: 6, backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', marginBottom: '1rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%`, backgroundColor: 'var(--color-success)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {CHECKLIST_ITEMS.map((item, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: checked[item] ? '#F0FDF4' : 'transparent', transition: 'background 0.2s' }}>
              <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} style={{ width: 18, height: 18, accentColor: 'var(--color-success)', cursor: 'pointer', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: checked[item] ? 'var(--color-text-mutated)' : 'var(--color-text)', textDecoration: checked[item] ? 'line-through' : 'none', transition: 'all 0.2s' }}>{item}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Field Notes */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>Field Notes</div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addNote()}
            placeholder="Add a note (e.g. found damage on dresser)…"
            style={{ flex: 1, padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-family)', fontSize: '0.875rem' }}
          />
          <button onClick={addNote} style={{ padding: '0.6rem 1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem' }}>Add</button>
        </div>
        {notes.length === 0 ? (
          <p className="text-sm text-muted" style={{ margin: 0 }}>No notes yet.</p>
        ) : notes.map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0', borderBottom: i < notes.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <span className="text-xs text-muted" style={{ flexShrink: 0, paddingTop: 2 }}>{n.time}</span>
            <span style={{ fontSize: '0.875rem' }}>{n.text}</span>
          </div>
        ))}
      </Card>

      <div style={{ height: '2rem' }} />
    </div>
  );
}
