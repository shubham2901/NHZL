import { useState, useMemo } from 'react';
import { Search, X, LayoutGrid, AlertTriangle, Clock, Ghost } from 'lucide-react';
import { nhis } from '../data/nhis';
import SidebarFilters from '../components/SidebarFilters';
import NHITable from '../components/NHITable';

const PILLS = ['Active', 'Dormant', 'Orphaned', 'Expiring Soon'];

function getTabCounts(data) {
  const highRisk = data.filter(n => n.riskScore > 50).length;
  const expired = data.filter(n => n.credentials.some(c => c.status === 'Expired')).length;
  const shadow = data.filter(n => n.isShadow).length;
  return { all: data.length, highRisk, expired, shadow };
}

const TAB_CONFIG = [
  { key: 'all', label: 'All NHIs', icon: LayoutGrid, countKey: 'all', color: 'text-slate-600', activeBg: 'bg-blue-50/50', activeBorder: 'border-blue-400', activeRing: 'ring-blue-200' },
  { key: 'high-risk', label: 'High Risk', icon: AlertTriangle, countKey: 'highRisk', color: 'text-red-600', activeBg: 'bg-red-50/50', activeBorder: 'border-red-400', activeRing: 'ring-red-200' },
  { key: 'expired', label: 'Expired', icon: Clock, countKey: 'expired', color: 'text-amber-600', activeBg: 'bg-amber-50/50', activeBorder: 'border-amber-400', activeRing: 'ring-amber-200' },
  { key: 'shadow', label: 'Shadow NHIs', icon: Ghost, countKey: 'shadow', color: 'text-purple-600', activeBg: 'bg-purple-50/50', activeBorder: 'border-purple-400', activeRing: 'ring-purple-200' },
];

export default function ListPage({ initialQuickFilter = null }) {
  const [search, setSearch] = useState('');
  const [activePill, setActivePill] = useState(initialQuickFilter);
  const [sidebarFilters, setSidebarFilters] = useState({ subType: [], status: [], source: [] });
  const [activeTab, setActiveTab] = useState('all');

  const tabCounts = useMemo(() => getTabCounts(nhis), []);

  const filtered = useMemo(() => {
    let data = [...nhis];

    if (activeTab === 'high-risk') data = data.filter(n => n.riskScore > 50);
    else if (activeTab === 'expired') data = data.filter(n => n.credentials.some(c => c.status === 'Expired'));
    else if (activeTab === 'shadow') data = data.filter(n => n.isShadow);

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(n =>
        n.name.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        (n.owner && n.owner.toLowerCase().includes(q)) ||
        n.sources.some(s => s.toLowerCase().includes(q)) ||
        n.credentials.some(c => c.name.toLowerCase().includes(q))
      );
    }

    if (activePill === 'Orphaned') data = data.filter(n => n.isOrphaned);
    else if (activePill === 'Dormant') data = data.filter(n => n.status === 'Dormant');
    else if (activePill === 'Active') data = data.filter(n => n.status === 'Active');
    else if (activePill === 'Expiring Soon') {
      const now = new Date();
      const soon = new Date();
      soon.setDate(soon.getDate() + 30);
      data = data.filter(n => n.credentials.some(c => c.expiry && new Date(c.expiry) > now && new Date(c.expiry) <= soon));
    }

    if (sidebarFilters.subType.length > 0) data = data.filter(n => sidebarFilters.subType.includes(n.subType));
    if (sidebarFilters.status.length > 0) data = data.filter(n => sidebarFilters.status.includes(n.status));
    if (sidebarFilters.source.length > 0) data = data.filter(n => n.sources.some(s => sidebarFilters.source.includes(s)));

    return data;
  }, [search, activePill, sidebarFilters, activeTab]);

  const pillColor = (p) => {
    if (p === 'Orphaned') return 'bg-red-100 text-red-700 border-red-300';
    if (p === 'Dormant') return 'bg-amber-100 text-amber-700 border-amber-300';
    if (p === 'Active') return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    return 'bg-orange-100 text-orange-700 border-orange-300';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Zluri</h1>
          <span className="text-gray-300 mx-1">/</span>
          <span className="text-sm text-gray-600">Non-Human Identities</span>
        </div>
        <div className="text-xs text-gray-400">PROTOTYPE — Discovery & Display v1</div>
      </header>

      {/* Tab Cards (replacing summary cards) */}
      <div className="px-6 pt-4 pb-3 shrink-0">
        <div className="grid grid-cols-4 gap-3">
          {TAB_CONFIG.map(({ key, label, icon: Icon, countKey, color, activeBg, activeBorder, activeRing }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setActivePill(null); }}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all cursor-pointer hover:shadow-sm ${
                  isActive ? `${activeBorder} ${activeBg} ring-1 ${activeRing}` : 'border-gray-200 bg-white'
                }`}
              >
                <div className={`rounded-lg p-2 ${isActive ? activeBg : 'bg-gray-50'} shadow-sm`}>
                  <Icon size={18} className={isActive ? color : 'text-gray-400'} />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-gray-900">{tabCounts[countKey]}</div>
                  <div className="text-xs text-gray-500 font-medium">{label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + Pills */}
      <div className="px-6 pb-3 flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, owner, source, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {PILLS.map(p => (
            <button
              key={p}
              onClick={() => setActivePill(activePill === p ? null : p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                activePill === p ? pillColor(p) : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p}
              {activePill === p && <span className="ml-1.5"><X size={10} className="inline" /></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main content: sidebar + table */}
      <div className="flex flex-1 overflow-hidden px-6 pb-4">
        <SidebarFilters filters={sidebarFilters} onChange={setSidebarFilters} />
        <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col ml-3">
          <NHITable data={filtered} />
          <div className="border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500 shrink-0">
            <span>1–{filtered.length} of {nhis.length > 50 ? '847' : nhis.length} results</span>
            <div className="flex items-center gap-1">
              <span className="mr-2">Rows per page: 50</span>
              <button className="px-2 py-1 border border-gray-200 rounded text-gray-400 cursor-pointer">&lt;</button>
              <button className="px-2 py-1 border border-blue-300 bg-blue-50 text-blue-600 rounded font-medium cursor-pointer">1</button>
              <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">2</button>
              <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">3</button>
              <span className="px-1">...</span>
              <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">17</button>
              <button className="px-2 py-1 border border-gray-200 rounded text-gray-400 cursor-pointer">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
