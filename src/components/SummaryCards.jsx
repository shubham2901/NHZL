import { Activity, Moon, AlertTriangle, Clock, LayoutGrid } from 'lucide-react';

const CARDS = [
  { key: 'total', label: 'Total NHIs', icon: LayoutGrid, color: 'text-slate-600', bg: 'bg-white' },
  { key: 'active', label: 'Active', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
  { key: 'dormant', label: 'Dormant', icon: Moon, color: 'text-amber-600', bg: 'bg-amber-50/50' },
  { key: 'orphaned', label: 'Orphaned', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50/50' },
  { key: 'expiringSoon', label: 'Expiring Soon', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50/50' },
];

export default function SummaryCards({ stats, activeCard, onCardClick }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {CARDS.map(({ key, label, icon: Icon, color, bg }) => {
        const isActive = activeCard === key;
        return (
          <button
            key={key}
            onClick={() => onCardClick(isActive ? null : key)}
            className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all cursor-pointer hover:shadow-sm ${isActive ? 'border-blue-400 bg-blue-50/50 ring-1 ring-blue-200' : `border-gray-200 ${bg}`}`}
          >
            <div className={`rounded-lg p-2 ${isActive ? 'bg-blue-100' : 'bg-white'} shadow-sm`}>
              <Icon size={18} className={isActive ? 'text-blue-600' : color} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">{stats[key]?.toLocaleString()}</div>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
