import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Button } from '../components/ui';
import { ArrowLeft, Info } from 'lucide-react';

const LINE_ITEMS = [
  { key: 'baseRate', label: 'Base Rate (Hourly)', type: 'rate', placeholder: '125' },
  { key: 'estimatedHours', label: 'Estimated Hours', type: 'hours', placeholder: '4' },
  { key: 'truckFee', label: 'Truck & Fuel Fee', type: 'flat', placeholder: '75' },
  { key: 'packingFee', label: 'Packing Services', type: 'flat', placeholder: '0' },
  { key: 'heavyItemFee', label: 'Heavy / Specialty Item Fee', type: 'flat', placeholder: '0' },
  { key: 'longCarryFee', label: 'Long Carry / Stairs Fee', type: 'flat', placeholder: '0' },
  { key: 'disassemblyFee', label: 'Disassembly / Reassembly', type: 'flat', placeholder: '0' },
  { key: 'storageHold', label: 'Storage Hold (if needed)', type: 'flat', placeholder: '0' },
  { key: 'tip', label: 'Crew Tip (Optional)', type: 'flat', placeholder: '0' },
  { key: 'discount', label: 'Discount', type: 'flat', placeholder: '0', negative: true },
];

export default function EstimateBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLeadStatus } = useAppContext();
  const lead = leads.find(l => l.id === id) || leads[0];

  const [rates, setRates] = useState({
    baseRate: 125, estimatedHours: 4, truckFee: 75,
    packingFee: lead?.packingNeeded === 'Yes' ? 150 : 0,
    heavyItemFee: lead?.heavyItems === 'Yes' ? 200 : 0,
    longCarryFee: 0, disassemblyFee: 0, storageHold: 0, tip: 0, discount: 0,
  });
  const [depositPct, setDepositPct] = useState(25);

  const laborTotal = (rates.baseRate || 0) * (rates.estimatedHours || 0);
  const addons = (rates.truckFee || 0) + (rates.packingFee || 0) + (rates.heavyItemFee || 0) +
    (rates.longCarryFee || 0) + (rates.disassemblyFee || 0) + (rates.storageHold || 0) + (rates.tip || 0);
  const gross = laborTotal + addons;
  const discount = rates.discount || 0;
  const total = Math.max(0, gross - discount);
  const depositAmount = Math.round(total * (depositPct / 100));
  const balance = total - depositAmount;

  const Row = ({ item }) => {
    const isLaborRow = item.key === 'baseRate' || item.key === 'estimatedHours';
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.9rem', color: item.negative ? 'var(--color-danger)' : 'var(--color-text)', flex: 1 }}>{item.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {!isLaborRow && <span style={{ color: 'var(--color-text-mutated)', fontSize: '0.9rem' }}>{item.negative ? '−' : '+'} $</span>}
          {isLaborRow && item.key === 'baseRate' && <span style={{ color: 'var(--color-text-mutated)', fontSize: '0.9rem' }}>$/hr</span>}
          {isLaborRow && item.key === 'estimatedHours' && <span style={{ color: 'var(--color-text-mutated)', fontSize: '0.9rem' }}>hrs</span>}
          <input
            type="number"
            value={rates[item.key]}
            onChange={e => setRates(r => ({ ...r, [item.key]: parseFloat(e.target.value) || 0 }))}
            placeholder={item.placeholder}
            style={{ width: '80px', padding: '0.4rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textAlign: 'right', fontFamily: 'var(--font-family)', fontSize: '0.9rem' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-mutated)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>Estimate Builder</h1>
          <p className="text-muted text-sm">{lead?.customerName} · {lead?.id}</p>
        </div>
      </div>

      {/* Lead Summary Card */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <div><span className="text-muted">Move Date: </span><strong>{lead?.moveDate}</strong></div>
          <div><span className="text-muted">Size: </span><strong>{lead?.moveSize}</strong></div>
          <div><span className="text-muted">Pickup: </span><strong>{lead?.pickupFloor}F</strong></div>
          <div><span className="text-muted">Drop-off: </span><strong>{lead?.dropoffFloor}F</strong></div>
          <div><span className="text-muted">Elevator: </span><strong>{lead?.elevator}</strong></div>
          <div><span className="text-muted">Packing: </span><strong>{lead?.packingNeeded}</strong></div>
          {lead?.heavyItemNotes && <div style={{ gridColumn: '1/-1' }}><span className="text-muted">Heavy: </span><strong>{lead.heavyItemNotes}</strong></div>}
          {lead?.longCarryNotes && <div style={{ gridColumn: '1/-1' }}><span className="text-muted">Notes: </span><strong>{lead.longCarryNotes}</strong></div>}
        </div>
      </Card>

      {/* Line Items */}
      <Card>
        <div style={{ fontWeight: '700', marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)' }}>Labor</div>
        <Row item={LINE_ITEMS[0]} />
        <Row item={LINE_ITEMS[1]} />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', marginBottom: '1rem', fontWeight: '700' }}>
          <span>Labor Total</span>
          <span>${laborTotal.toLocaleString()}</span>
        </div>

        <div style={{ fontWeight: '700', marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)' }}>Add-ons & Fees</div>
        {LINE_ITEMS.slice(2).map(item => <Row key={item.key} item={item} />)}
      </Card>

      {/* Totals */}
      <Card>
        <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', color: 'var(--color-accent)', marginBottom: '1rem' }}>Summary</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div className="flex justify-between text-sm"><span className="text-muted">Gross Total</span><span>${gross.toLocaleString()}</span></div>
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
