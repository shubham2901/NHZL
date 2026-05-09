import { useState } from 'react';
import { ChevronRight, ChevronDown, Info, AlertTriangle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import SourceBadge from './SourceBadge';

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return Math.round(diff);
}

function ExpiryCell({ date }) {
  if (!date) return <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={12} />No expiry</span>;
  const days = daysUntil(date);
  if (days < 0) return <span className="text-red-600 font-medium">Expired {Math.abs(days)}d ago</span>;
  if (days <= 7) return <span className="text-red-600 font-medium">{days}d left</span>;
  if (days <= 30) return <span className="text-amber-600 font-medium">{days}d left</span>;
  return <span className="text-gray-600">{days}d left</span>;
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const days = Math.round((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

function RiskScoreBadge({ score }) {
  if (score == null) return <span className="text-gray-400">—</span>;
  const color = score >= 70 ? 'text-red-700 bg-red-100' : score >= 50 ? 'text-amber-700 bg-amber-100' : score >= 25 ? 'text-yellow-700 bg-yellow-50' : 'text-emerald-700 bg-emerald-50';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{score}</span>;
}

const TYPE_INFO = {
  'Service Account': 'A non-human account used by applications or services to authenticate and interact with other systems.',
  'Application Identity': 'An application registered in an identity provider (e.g., OAuth app, SAML app) that acts on behalf of users or systems.',
  'Machine / Workload': 'An identity assigned to infrastructure components like containers, VMs, or CI/CD pipelines.',
  'AI Agent / Bot': 'An automated agent or bot that performs tasks in chat platforms, CI/CD systems, or AI platforms.',
};

function CredentialRow({ cred }) {
  return (
    <tr className="bg-gray-50/50 border-t border-gray-100 text-xs">
      <td className="pl-12 pr-3 py-2">
        <div className="flex items-center gap-2">
          <Key size={12} className="text-gray-400 shrink-0" />
          <span className="font-medium text-gray-700">{cred.name}</span>
        </div>
      </td>
      <td className="px-3 py-2">
        <span className="text-gray-600">{cred.subtype || cred.type}</span>
      </td>
      <td className="px-3 py-2"><StatusBadge status={cred.status} size="sm" /></td>
      <td className="px-3 py-2 text-gray-500">{cred.source}</td>
      <td className="px-3 py-2 text-gray-500">{cred.lastUsed ? timeAgo(cred.lastUsed) : '—'}</td>
      <td className="px-3 py-2" />
      <td className="px-3 py-2"><ExpiryCell date={cred.expiry} /></td>
      <td className="px-3 py-2" />
      <td className="px-3 py-2" />
    </tr>
  );
}

function NHIRow({ nhi, isExpanded, onToggle, defaultExpanded }) {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <tr
        className={`border-t border-gray-200 hover:bg-gray-50/80 transition-colors cursor-pointer ${nhi.isOrphaned ? 'bg-red-50/30' : ''}`}
        onClick={() => navigate(`/detail/${nhi.id}`)}
      >
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              className="p-0.5 hover:bg-gray-200 rounded cursor-pointer"
            >
              {isExpanded ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-400" />}
            </button>
            <div>
              <div className="font-medium text-gray-900 text-sm">{nhi.name}</div>
              <div className="text-xs text-gray-400">{nhi.id}</div>
            </div>
          </div>
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-1 relative">
            <span className="text-sm text-gray-700">{nhi.subType}</span>
            <button
              className="cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={(e) => e.stopPropagation()}
            >
              <Info size={13} className="text-gray-400" />
            </button>
            {showTooltip && (
              <div className="absolute z-50 left-0 top-full mt-1 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                {TYPE_INFO[nhi.subType] || 'Non-human identity type.'}
              </div>
            )}
          </div>
        </td>
        <td className="px-3 py-3"><StatusBadge status={nhi.status} /></td>
        <td className="px-3 py-3">
          {nhi.owner ? (
            <span className="text-sm text-gray-700">{nhi.owner}</span>
          ) : (
            <span className="text-sm text-red-600 flex items-center gap-1 font-medium"><AlertTriangle size={13} />No owner</span>
          )}
        </td>
        <td className="px-3 py-3">
          <div className="flex gap-1 flex-wrap">
            {nhi.sources.map(s => <SourceBadge key={s} source={s} />)}
          </div>
        </td>
        <td className="px-3 py-3 text-sm text-gray-600">{timeAgo(nhi.lastActive)}</td>
        <td className="px-3 py-3">
          <span className="text-sm font-medium text-gray-700">{nhi.credentialsCount}</span>
        </td>
        <td className="px-3 py-3 text-sm"><ExpiryCell date={nhi.nearestExpiry} /></td>
        <td className="px-3 py-3">
          <RiskScoreBadge score={nhi.riskScore} />
        </td>
      </tr>
      {isExpanded && nhi.credentials.map(cred => (
        <CredentialRow key={cred.id} cred={cred} />
      ))}
    </>
  );
}

export default function NHITable({ data }) {
  const [expanded, setExpanded] = useState(() => {
    const initial = {};
    if (data[0]) initial[data[0].id] = true;
    if (data[2]) initial[data[2].id] = true;
    return initial;
  });

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[220px]">Name</th>
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[160px]">Sub Type</th>
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[110px]">Status</th>
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[140px]">Primary Owner</th>
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[180px]">Source(s)</th>
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Last Active</th>
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[60px]">Creds</th>
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Nearest Expiry</th>
            <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[90px]">Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map(nhi => (
            <NHIRow
              key={nhi.id}
              nhi={nhi}
              isExpanded={!!expanded[nhi.id]}
              onToggle={() => toggle(nhi.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
