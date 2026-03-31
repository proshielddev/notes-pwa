import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useRouteDistance } from '../hooks/useRouteDistance';
import { Card, Button } from '../components/ui';
import { ArrowLeft, Navigation, Loader, AlertCircle, Edit3 } from 'lucide-react';

// ─── Line item config ─────────────────────────────────────────────────────────
const ADDONS = [
  { key: 'truckFee',       label: 'Truck & Fuel Fee',             default: 75 },
  { key: 'packingFee',     label: 'Packing Services',             default: 0 },
  { key: 'heavyItemFee',   label: 'Heavy / Specialty Item Fee',   default: 0 },
  { key: 'longCarryFee',   label: 'Long Carry / Stairs Fee',      default: 0 },
  { key: 'disassemblyFee', label: 'Disassembly / Reassembly',     default: 0 },
  { key: 'storageHold',    label: 'Storage Hold (if needed)',     default: 0 },
  { key: 'tip',            label: 'Crew Tip (Optional)',          default: 0 },
  { key: 'discount',       label: 'Discount',                     default: 0, negative: true },
];

const DEFAULT_RATES = (lead) => ({
  numMovers: 2,
  hourlyRate: 125,
  estimatedHours: 4,
  distanceFeeRate: 2.50,
  distanceMiles: '',
  distanceFee: 0,
  manualDistance: false,
  truckFee: 75,
  packingFee: lead?.packingNeeded === 'Yes' ? 150 : 0,
  heavyItemFee: lead?.heavyItems === 'Yes' ? 200 : 0,
  longCarryFee: 0,
  disassemblyFee: 0,
  storageHold: 0,
  tip: 0,
  discount: 0,
});

export default function EstimateBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLeadStatus } = useAppContext();
  const lead = leads.find(l => l.id === id) || leads[0];

  const [rates, setRates] = useState(DEFAULT_RATES(lead));
  const [depositPct, setDepositPct] = useState(25);

  // Distance
  const { route, loading: routeLoading } = useRouteDistance(lead?.pickupAddress, lead?.dropoffAddress);

  useEffect(() => {
    if (route && !rates.manualDistance) {
      setRates(r => ({
        ...r,
        distanceMiles: route.distanceMiles,
        distanceFee: +(route.distanceMiles * r.distanceFeeRate).toFixed(2),
      }));
    }
  }, [route]);

  const setField = (key, value) => {
    setRates(prev => {
      const next = { ...prev, [key]: parseFloat(value) || 0 };
      if (key === 'distanceMiles' || key === 'distanceFeeRate') {
        next.distanceFee = +(parseFloat(next.distanceMiles || 0) * parseFloat(next.distanceFeeRate)).toFixed(2);
      }
      return next;
    });
  };

  // ── Pricing formula: (hours × movers × rate) + distance + addons ──
  const labor = (rates.estimatedHours || 0) * (rates.numMovers || 2) * (rates.hourlyRate || 0);
  const addonsTotal = ADDONS.filter(a => !a.negative).reduce((s, a) => s + (rates[a.key] || 0), 0)
    + (rates.distanceFee || 0) + (rates.truckFee || 0);
  const gross = labor + addonsTotal;
  const discount = rates.discount || 0;
  const total = Math.max(0, gross - discount);
  const depositAmount = Math.round(total * (depositPct / 100));
  const balance = total - depositAmount;

  const Row = ({ item }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.7rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.7rem' }}>
      <span style={{ fontSize: '0.88rem', color: item.negative ? 'var(--color-danger)' : 'var(--color-text)', flex: 1 }}>{item.label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ color: 'var(--color-text-mutated)', fontSize: '0.85rem' }}>{item.negative ? '−' : '+'} $</span>
        <input type="number" value={rates[item.key]} onChange={e => setField(item.key, e.target.value)}
          style={{ width: 80, padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textAlign: 'right', fontFamily: 'var(--font-family)', fontSize: '0.88rem' }} />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-text-mutated)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>Estimate Builder</h1>
          <p className="text-muted text-sm">{lead?.customerName} · {lead?.id}</p>
        </div>
      </div>

      {/* Lead Summary */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <div><span className="text-muted">Move Date: </span><strong>{lead?.moveDate}</strong></div>
          <div><span className="text-muted">Size: </span><strong>{lead?.moveSize}</strong></div>
          <div><span className="text-muted">Pickup: </span><strong>{lead?.pickupFloor}F</strong></div>
          <div><span className="text-muted">Drop-off: </span><strong>{lead?.dropoffFloor}F</strong></div>
          <div><span className="text-muted">Elevator: </span><strong>{lead?.elevator}</strong></div>
          <div><span className="text-muted">Packing: </span><strong>{lead?.packingNeeded}</strong></div>
          {lead?.heavyItemNotes && <div style={{ gridColumn: '1/-1' }}><span className="text-muted">Heavy: </span><strong>{lead.heavyItemNotes}</strong></div>}
        </div>
      </Card>

      {/* Distance */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>Route Distance</div>

        {routeLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', backgroundColor: '#F0F9FF', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', color: '#0284C7', fontSize: '0.82rem' }}>
            <Loader size={14} /> Calculating route…
          </div>
        ) : route && !rates.manualDistance ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', backgroundColor: '#F0FDF4', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', border: '1px solid #86EFAC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={14} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontWeight: '700', color: 'var(--color-success)', fontSize: '0.875rem' }}>{route.distanceMiles} mi · {route.durationText}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-mutated)' }}>via Google Maps</span>
            </div>
            <button onClick={() => setRates(r => ({ ...r, manualDistance: true }))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Edit3 size={13} style={{ color: 'var(--color-text-mutated)' }} />
            </button>
          </div>
        ) : (
          <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#FFFBEB', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', fontSize: '0.78rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={13} /> Enter distance manually
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>Miles</label>
            <input type="number" value={rates.distanceMiles} onChange={e => setField('distanceMiles', e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-family)' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>Rate ($/mi)</label>
            <input type="number" value={rates.distanceFeeRate} onChange={e => setField('distanceFeeRate', e.target.value)} step="0.25"
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-family)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
          <span className="text-muted">Distance Fee</span>
          <strong>${(rates.distanceFee || 0).toFixed(2)}</strong>
        </div>
      </Card>

      {/* Pricing Formula Banner */}
      <div style={{ backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#1D4ED8', fontWeight: '600' }}>
        <span>Total = (Hours × Movers × Rate) + Distance + Add-ons</span>
      </div>

      {/* Labor */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '1rem' }}>Labor</div>
        {[
          { key: 'numMovers',      label: 'Number of Movers',  suffix: 'crew' },
          { key: 'hourlyRate',     label: 'Hourly Rate ($/hr)', prefix: '$' },
          { key: 'estimatedHours', label: 'Estimated Hours',    suffix: 'hrs' },
        ].map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.7rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.7rem' }}>
            <span style={{ fontSize: '0.88rem', flex: 1 }}>{item.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {item.prefix && <span style={{ color: 'var(--color-text-mutated)', fontSize: '0.85rem' }}>{item.prefix}</span>}
              <input type="number" value={rates[item.key]} onChange={e => setField(item.key, e.target.value)}
                style={{ width: 80, padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textAlign: 'right', fontFamily: 'var(--font-family)', fontSize: '0.88rem' }} />
              {item.suffix && <span style={{ color: 'var(--color-text-mutated)', fontSize: '0.85rem' }}>{item.suffix}</span>}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', padding: '0.4rem 0' }}>
          <span>Labor Subtotal</span><span>${labor.toLocaleString()}</span>
        </div>
      </Card>

      {/* Add-ons */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '1rem' }}>Add-ons & Fees</div>
        {ADDONS.map(item => <Row key={item.key} item={item} />)}
      </Card>

      {/* Totals */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '1rem' }}>Summary</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <div className="flex justify-between text-sm"><span className="text-muted">Labor</span><span>${labor.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Distance Fee</span><span>${(rates.distanceFee || 0).toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Other Add-ons</span><span>${(addonsTotal - (rates.distanceFee || 0)).toLocaleString()}</span></div>
          <div className="flex justify-between text-sm" style={{ color: 'var(--color-danger)' }}><span>Discount</span><span>− ${discount.toLocaleString()}</span></div>
          <div className="flex justify-between" style={{ fontWeight: '800', fontSize: '1.25rem', paddingTop: '0.5rem', borderTop: '2px solid var(--color-border)' }}>
            <span>TOTAL</span><span style={{ color: 'var(--color-primary)' }}>${total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Deposit % <span style={{ color: 'var(--color-text-mutated)' }}>({depositPct}%)</span></label>
          <input type="range" min="0" max="100" value={depositPct} onChange={e => setDepositPct(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-accent)', margin: '0.5rem 0' }} />
          <div className="flex justify-between text-sm">
            <span className="text-muted">Deposit Due</span><strong style={{ color: 'var(--color-success)' }}>${depositAmount.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between text-sm" style={{ marginTop: '0.25rem' }}>
            <span className="text-muted">Balance on Move Day</span><strong>${balance.toLocaleString()}</strong>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
        <Button variant="accent" fullWidth onClick={() => navigate(`/leads/${id}/quote`, { state: { total, depositAmount, balance, rates } })}>
          Review & Send Quote →
        </Button>
      </div>
    </div>
  );
}
