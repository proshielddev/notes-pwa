import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useRouteDistance } from '../hooks/useRouteDistance';
import { Card, Button, StatusChip } from '../components/ui';
import {
  Plus, Save, Send, Video, CheckCircle, ChevronRight,
  MapPin, Loader, AlertCircle, Navigation, Edit3, ArrowLeft, FileText,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const DISTANCE_FEE_RATE = 2.50; // $ per mile default

const ESTIMATE_TYPES = ['Non-binding', 'Binding', 'Binding Not-to-Exceed'];
const MOVE_SIZES = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom', 'Office', 'Other'];
const BUILDING_TYPES = ['House', 'Apartment', 'Condo', 'Storage Unit', 'Office', 'Other'];
const FLOORS = ['1', '2', '3', '4', '5', 'Basement'];
const CONFIDENCE_LEVELS = ['High', 'Medium', 'Low'];

const EMPTY_ESTIMATE = {
  customerName: '', phone: '', moveDate: '',
  pickupAddress: '', dropoffAddress: '',
  moveSize: '2 Bedroom', buildingType: 'Apartment',
  pickupFloor: '1', dropoffFloor: '1', elevator: 'No',
  numMovers: 2, hourlyRate: 125, estimatedHours: 4,
  distanceMiles: '', distanceFeeRate: DISTANCE_FEE_RATE, distanceFee: 0,
  manualDistance: false,
  heavyItemFee: 0, packingFee: 0, longCarryFee: 0, disassemblyFee: 0, discount: 0,
  estimateType: 'Non-binding',
  estimateConfidence: 'High',
  status: 'Draft',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase',
    letterSpacing: '0.1em', color: 'var(--color-accent)',
    marginBottom: '0.75rem', paddingBottom: '0.4rem',
    borderBottom: '2px solid var(--color-accent)',
  }}>{children}</div>
);

const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: '0.85rem' }}>
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text)', marginBottom: '0.3rem' }}>
      {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ value, onChange, type = 'text', placeholder, min, step, style = {} }) => (
  <input
    type={type} value={value} onChange={onChange} placeholder={placeholder} min={min} step={step}
    style={{
      width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--color-border)', fontFamily: 'var(--font-family)',
      fontSize: '0.9rem', backgroundColor: 'white', ...style,
    }}
  />
);

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange} style={{
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)', fontFamily: 'var(--font-family)',
    fontSize: '0.9rem', backgroundColor: 'white',
  }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const NumberInput = ({ value, onChange, min = 0, step = 1, prefix, suffix }) => (
  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'white' }}>
    {prefix && <span style={{ padding: '0.6rem 0.6rem', backgroundColor: 'var(--color-bg)', fontSize: '0.85rem', color: 'var(--color-text-mutated)', borderRight: '1px solid var(--color-border)', flexShrink: 0 }}>{prefix}</span>}
    <input type="number" value={value} onChange={onChange} min={min} step={step}
      style={{ flex: 1, border: 'none', padding: '0.6rem 0.5rem', fontFamily: 'var(--font-family)', fontSize: '0.9rem', textAlign: 'right', outline: 'none' }} />
    {suffix && <span style={{ padding: '0.6rem 0.6rem', backgroundColor: 'var(--color-bg)', fontSize: '0.85rem', color: 'var(--color-text-mutated)', borderLeft: '1px solid var(--color-border)', flexShrink: 0 }}>{suffix}</span>}
  </div>
);

// ─── Distance Badge ────────────────────────────────────────────────────────────
const DistanceBadge = ({ route, loading, manualDistance, onManualToggle }) => {
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', backgroundColor: '#F0F9FF', borderRadius: 'var(--radius-sm)', border: '1px solid #BAE6FD' }}>
      <Loader size={14} style={{ color: '#0284C7', animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.8rem', color: '#0284C7' }}>Calculating route…</span>
    </div>
  );

  if (route && !manualDistance) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', backgroundColor: '#F0FDF4', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Navigation size={14} style={{ color: 'var(--color-success)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-success)' }}>
          {route.distanceMiles} mi · {route.durationText}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-mutated)' }}>via Google Maps</span>
      </div>
      <button onClick={onManualToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '0.1rem' }}>
        <Edit3 size={13} style={{ color: 'var(--color-text-mutated)' }} />
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: '#FFFBEB', borderRadius: 'var(--radius-sm)', border: '1px solid #FCD34D', fontSize: '0.78rem', color: '#92400E' }}>
      <AlertCircle size={13} />
      {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here'
        ? 'No API key — enter distance manually'
        : 'Enter addresses above to auto-calculate'}
    </div>
  );
};

// ─── Pricing Panel ────────────────────────────────────────────────────────────
const PricingPanel = ({ est, total, low, high, assumptions }) => {
  const labor = (est.estimatedHours || 0) * (est.numMovers || 2) * (est.hourlyRate || 0);
  const addons = (est.distanceFee || 0) + (est.heavyItemFee || 0) + (est.packingFee || 0) + (est.longCarryFee || 0) + (est.disassemblyFee || 0);

  const Row = ({ label, value, bold, muted, color, negative }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <span style={{ fontSize: '0.82rem', color: muted ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.85)', fontWeight: bold ? '700' : '400' }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontWeight: bold ? '800' : '500', color: color || (negative ? '#FCA5A5' : 'white') }}>
        {negative ? '− ' : ''}{typeof value === 'number' ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : value}
      </span>
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', position: 'sticky', top: '1rem' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: '1rem' }}>
        Live Estimate
      </div>

      {/* Formula display */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem', marginBottom: '1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: '0.25rem' }}>Pricing Formula</div>
        <div>({est.estimatedHours}h × {est.numMovers} movers × ${est.hourlyRate}/hr)</div>
        <div>+ Distance Fee + Add-ons</div>
      </div>

      {/* Breakdown */}
      <Row label={`Labor (${est.estimatedHours}h × ${est.numMovers} × $${est.hourlyRate})`} value={labor} muted />
      {est.distanceFee > 0 && <Row label={`Distance (${est.distanceMiles || '?'} mi × $${est.distanceFeeRate}/mi)`} value={est.distanceFee} muted />}
      {est.heavyItemFee > 0 && <Row label="Heavy Item Fee" value={est.heavyItemFee} muted />}
      {est.packingFee > 0 && <Row label="Packing" value={est.packingFee} muted />}
      {est.longCarryFee > 0 && <Row label="Long Carry / Stairs" value={est.longCarryFee} muted />}
      {est.disassemblyFee > 0 && <Row label="Disassembly / Reassembly" value={est.disassemblyFee} muted />}
      {est.discount > 0 && <Row label="Discount" value={est.discount} negative muted />}

      {/* Total */}
      <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Estimated Total</div>
        <div style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--color-accent)', lineHeight: 1.1, marginTop: '0.25rem' }}>
          ${total.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.3rem' }}>
          Range: ${low.toLocaleString()} – ${high.toLocaleString()}
        </div>
      </div>

      {/* Type & Confidence */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ flex: 1, textAlign: 'center', padding: '0.3rem', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', fontWeight: '600' }}>
          {est.estimateType}
        </span>
        <span style={{
          flex: 1, textAlign: 'center', padding: '0.3rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: '700',
          backgroundColor: est.estimateConfidence === 'High' ? 'rgba(16,185,129,0.25)' : est.estimateConfidence === 'Medium' ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)',
          color: est.estimateConfidence === 'High' ? '#6EE7B7' : est.estimateConfidence === 'Medium' ? '#FDE68A' : '#FCA5A5',
        }}>
          {est.estimateConfidence} Confidence
        </span>
      </div>

      {/* Assumptions */}
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
        <div style={{ fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>Assumptions</div>
        {assumptions.map((a, i) => <div key={i}>· {a}</div>)}
      </div>
    </div>
  );
};

// ─── Estimate List ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  'Draft': { bg: '#F3F4F6', color: '#4B5563' },
  'Quote Sent': { bg: '#E0E7FF', color: '#4338CA' },
  'Booked': { bg: '#D1FAE5', color: '#047857' },
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Estimation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estimates, addEstimate, updateEstimate } = useAppContext();

  const [view, setView] = useState(id ? 'form' : 'list'); // 'list' | 'form'
  const [saved, setSaved] = useState(false);
  const [activeId, setActiveId] = useState(id || null);

  // Load existing or start fresh
  const existing = estimates.find(e => e.id === id);
  const [est, setEst] = useState(existing || EMPTY_ESTIMATE);

  const set = (field) => (e) => {
    const val = e.target?.value ?? e;
    setEst(prev => {
      const next = { ...prev, [field]: val };
      // Auto-recalc distance fee when distanceMiles or rate changes
      if (field === 'distanceMiles' || field === 'distanceFeeRate') {
        next.distanceFee = +(parseFloat(next.distanceMiles || 0) * parseFloat(next.distanceFeeRate || 0)).toFixed(2);
      }
      return next;
    });
  };

  const setNum = (field) => (e) => {
    const val = parseFloat(e.target.value) || 0;
    setEst(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'distanceMiles' || field === 'distanceFeeRate') {
        next.distanceFee = +(parseFloat(next.distanceMiles || 0) * (parseFloat(next.distanceFeeRate || 0))).toFixed(2);
      }
      return next;
    });
  };

  // Distance calculation
  const { route, loading: routeLoading } = useRouteDistance(est.pickupAddress, est.dropoffAddress);

  useEffect(() => {
    if (route && !est.manualDistance) {
      setEst(prev => ({
        ...prev,
        distanceMiles: route.distanceMiles,
        distanceFee: +(route.distanceMiles * prev.distanceFeeRate).toFixed(2),
      }));
    }
  }, [route]);

  // Pricing
  const labor = (est.estimatedHours || 0) * (est.numMovers || 2) * (est.hourlyRate || 0);
  const addons = (est.distanceFee || 0) + (est.heavyItemFee || 0) + (est.packingFee || 0) +
    (est.longCarryFee || 0) + (est.disassemblyFee || 0);
  const total = Math.max(0, labor + addons - (est.discount || 0));
  const low = Math.round(total * 0.90);
  const high = Math.round(total * 1.15);

  const assumptions = [
    `${est.numMovers} movers · ${est.estimatedHours}h estimated`,
    `${est.moveSize || '—'} · ${est.buildingType || '—'}`,
    `Pickup floor ${est.pickupFloor} · Drop-off floor ${est.dropoffFloor}`,
    est.elevator === 'Yes' ? 'Elevator available' : 'No elevator',
    est.distanceMiles ? `~${est.distanceMiles} miles ($${est.distanceFeeRate}/mi)` : 'Distance: manual',
    `Rate: $${est.hourlyRate}/hr`,
    `Type: ${est.estimateType}`,
  ].filter(Boolean);

  const handleSave = () => {
    const full = { ...est, estimateTotal: total };
    if (activeId) {
      updateEstimate(activeId, full);
    } else {
      const newId = addEstimate(full);
      setActiveId(newId);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConvertToQuote = () => {
    handleSave();
    navigate('/leads');
  };

  const handleCreateBooking = () => {
    handleSave();
    navigate('/leads');
  };

  // ── LIST VIEW ───────────────────────────────────────────────────────────────
  if (view === 'list') return (
    <div className="animate-fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>Estimation</h1>
          <p className="text-muted text-sm">{estimates.length} saved estimates</p>
        </div>
        <button
          id="estimation-new-btn"
          onClick={() => { setEst(EMPTY_ESTIMATE); setActiveId(null); setView('form'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            backgroundColor: 'var(--color-accent)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-md)',
            padding: '0.6rem 1rem', fontWeight: '700', fontSize: '0.875rem',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(242,100,25,0.35)',
          }}
        >
          <Plus size={16} /> New Estimate
        </button>
      </div>

      {estimates.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-mutated)' }}>
            <FileText size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
            <p style={{ margin: 0 }}>No estimates yet. Create your first one.</p>
          </div>
        </Card>
      ) : estimates.map(e => (
        <Card key={e.id} onClick={() => { setEst(e); setActiveId(e.id); setView('form'); }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>{e.customerName || 'Unnamed'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-mutated)' }}>{e.id}</span>
                <span style={{
                  padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: '700',
                  backgroundColor: STATUS_COLORS[e.status]?.bg || '#F3F4F6',
                  color: STATUS_COLORS[e.status]?.color || '#4B5563',
                }}>{e.status}</span>
              </div>
              <div className="text-sm text-muted" style={{ marginBottom: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                📍 {e.pickupAddress} → {e.dropoffAddress}
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--color-text-mutated)' }}>
                <span>{e.moveSize}</span>
                {e.distanceMiles && <span>~{e.distanceMiles} mi</span>}
                <span>{e.estimateType}</span>
                {e.moveDate && <span>📅 {e.moveDate}</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--color-primary)' }}>${(e.estimateTotal || 0).toLocaleString()}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mutated)' }}>{e.estimateConfidence} conf.</div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-mutated)', marginTop: '0.25rem' }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // ── FORM VIEW ───────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--spacing-lg)' }}>
        <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-text-mutated)' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.4rem', marginBottom: 0 }}>
            {activeId ? `Estimate ${activeId}` : 'New Estimate'}
          </h1>
          <p className="text-muted text-sm">Fast quote builder · {new Date().toLocaleDateString()}</p>
        </div>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)', fontWeight: '700', fontSize: '0.875rem' }}>
            <CheckCircle size={16} /> Saved
          </div>
        )}
      </div>

      {/* Two-column layout on desktop, stacked on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 'var(--spacing-lg)', alignItems: 'start' }}
        className="estimation-grid">

        {/* ── LEFT: Inputs ── */}
        <div>
          {/* Customer */}
          <Card>
            <SectionLabel>Customer</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
              <Field label="Customer Name" required>
                <Input value={est.customerName} onChange={set('customerName')} placeholder="Full name" />
              </Field>
              <Field label="Phone">
                <Input value={est.phone} onChange={set('phone')} type="tel" placeholder="(419) 555-0000" />
              </Field>
            </div>
            <Field label="Move Date">
              <Input value={est.moveDate} onChange={set('moveDate')} type="date" />
            </Field>
          </Card>

          {/* Addresses + Distance */}
          <Card>
            <SectionLabel>Route & Distance</SectionLabel>
            <Field label="Pickup Address" required>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-accent)' }} />
                <Input value={est.pickupAddress} onChange={set('pickupAddress')} placeholder="Full street address" style={{ paddingLeft: '2rem' }} />
              </div>
            </Field>
            <Field label="Drop-off Address" required>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-success)' }} />
                <Input value={est.dropoffAddress} onChange={set('dropoffAddress')} placeholder="Full street address" style={{ paddingLeft: '2rem' }} />
              </div>
            </Field>

            {/* Distance badge */}
            <div style={{ marginBottom: '0.85rem' }}>
              <DistanceBadge
                route={route}
                loading={routeLoading}
                manualDistance={est.manualDistance}
                onManualToggle={() => setEst(prev => ({ ...prev, manualDistance: true }))}
              />
            </div>

            {/* Manual override or auto-populated distance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
              <Field label={est.manualDistance ? 'Distance (miles) — Manual' : 'Distance (miles)'}>
                <NumberInput value={est.distanceMiles} onChange={setNum('distanceMiles')} min={0} step={0.1} suffix="mi"
                  {...(!est.manualDistance && route ? { style: { opacity: 0.75 } } : {})} />
              </Field>
              <Field label="Fee Rate ($/mile)">
                <NumberInput value={est.distanceFeeRate} onChange={setNum('distanceFeeRate')} min={0} step={0.25} prefix="$" suffix="/mi" />
              </Field>
            </div>
            <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span className="text-muted">Distance Fee</span>
              <strong>${(est.distanceFee || 0).toFixed(2)}</strong>
            </div>
          </Card>

          {/* Move Details */}
          <Card>
            <SectionLabel>Move Details</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
              <Field label="Move Size">
                <Select value={est.moveSize} onChange={set('moveSize')} options={MOVE_SIZES} />
              </Field>
              <Field label="Building Type">
                <Select value={est.buildingType} onChange={set('buildingType')} options={BUILDING_TYPES} />
              </Field>
              <Field label="Pickup Floor">
                <Select value={est.pickupFloor} onChange={set('pickupFloor')} options={FLOORS} />
              </Field>
              <Field label="Drop-off Floor">
                <Select value={est.dropoffFloor} onChange={set('dropoffFloor')} options={FLOORS} />
              </Field>
            </div>
            <Field label="Elevator Available?">
              <Select value={est.elevator} onChange={set('elevator')} options={['Yes', 'No']} />
            </Field>
          </Card>

          {/* Pricing Inputs */}
          <Card>
            <SectionLabel>Pricing Parameters</SectionLabel>

            {/* Formula reminder */}
            <div style={{ backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem', marginBottom: '1rem', fontSize: '0.78rem', color: '#1D4ED8', fontWeight: '600' }}>
              Total = (Hours × Movers × Rate) + Distance Fee + Add-ons
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 0.75rem' }}>
              <Field label="Movers">
                <NumberInput value={est.numMovers} onChange={setNum('numMovers')} min={1} step={1} suffix="crew" />
              </Field>
              <Field label="Hourly Rate">
                <NumberInput value={est.hourlyRate} onChange={setNum('hourlyRate')} min={0} step={5} prefix="$" suffix="/hr" />
              </Field>
              <Field label="Est. Hours">
                <NumberInput value={est.estimatedHours} onChange={setNum('estimatedHours')} min={0.5} step={0.5} suffix="hrs" />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem', marginTop: '0.5rem' }}>
              <Field label="Heavy Item Fee"><NumberInput value={est.heavyItemFee} onChange={setNum('heavyItemFee')} min={0} step={25} prefix="$" /></Field>
              <Field label="Packing Fee"><NumberInput value={est.packingFee} onChange={setNum('packingFee')} min={0} step={25} prefix="$" /></Field>
              <Field label="Long Carry / Stair Fee"><NumberInput value={est.longCarryFee} onChange={setNum('longCarryFee')} min={0} step={25} prefix="$" /></Field>
              <Field label="Disassembly / Reassembly"><NumberInput value={est.disassemblyFee} onChange={setNum('disassemblyFee')} min={0} step={25} prefix="$" /></Field>
              <Field label="Discount"><NumberInput value={est.discount} onChange={setNum('discount')} min={0} step={10} prefix="$" /></Field>
            </div>
          </Card>

          {/* Estimate Settings */}
          <Card>
            <SectionLabel>Estimate Settings</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
              <Field label="Estimate Type">
                <Select value={est.estimateType} onChange={set('estimateType')} options={ESTIMATE_TYPES} />
              </Field>
              <Field label="Confidence">
                <Select value={est.estimateConfidence} onChange={set('estimateConfidence')} options={CONFIDENCE_LEVELS} />
              </Field>
            </div>
          </Card>

          {/* Action Buttons (mobile bottom + desktop inline) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={handleSave}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}>
                <Save size={16} /> Save Estimate
              </button>
              <button
                onClick={() => { handleSave(); navigate('/leads'); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', backgroundColor: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(242,100,25,0.35)' }}>
                <FileText size={16} /> Convert to Quote
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
                <Send size={15} /> Send Quote
              </button>
              <button
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
                <Video size={15} /> Video Walkthrough
              </button>
              <button
                onClick={handleCreateBooking}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#D1FAE5', color: '#047857', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}>
                <CheckCircle size={15} /> Book
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Live Pricing Panel ── */}
        <div>
          <PricingPanel est={est} total={total} low={low} high={high} assumptions={assumptions} />
        </div>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 767px) {
          .estimation-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
