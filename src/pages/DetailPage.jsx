import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, AlertTriangle, ChevronDown, ChevronRight, Key, Info, Archive, GitMerge, RefreshCw, Shield, Clock, User, Users, Eye, Calendar, Activity, Server } from 'lucide-react';
import { nhis, ACTIVITY_LOGS } from '../data/nhis';
import StatusBadge from '../components/StatusBadge';
import SourceBadge from '../components/SourceBadge';

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.round((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function ExpiryDisplay({ date }) {
  if (!date) return <span className="text-amber-600 flex items-center gap-1 text-sm"><AlertTriangle size={14} />No expiry set</span>;
  const days = daysUntil(date);
  if (days < 0) return <span className="text-red-600 font-medium text-sm">Expired {Math.abs(days)}d ago</span>;
  if (days <= 7) return <span className="text-red-600 font-medium text-sm">{days}d remaining</span>;
  if (days <= 30) return <span className="text-amber-600 font-medium text-sm">{days}d remaining</span>;
  return <span className="text-gray-700 text-sm">{date} ({days}d remaining)</span>;
}

function CredentialDetail({ cred }) {
  const [open, setOpen] = useState(false);
  const statusDanger = cred.status === 'Expired' || cred.status === 'Revoked';
  const isDormant = cred.status === 'Dormant';
  return (
    <div className={`border rounded-lg mb-2 ${statusDanger ? 'border-red-200 bg-red-50/30' : isDormant ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 bg-white'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-gray-50/50 transition-colors">
        {open ? <ChevronDown size={14} className="text-gray-400 shrink-0" /> : <ChevronRight size={14} className="text-gray-400 shrink-0" />}
        <Key size={14} className={statusDanger ? 'text-red-400 shrink-0' : isDormant ? 'text-amber-400 shrink-0' : 'text-gray-400 shrink-0'} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-900">{cred.name}</span>
            <span className="text-xs text-gray-500">{cred.subtype}</span>
          </div>
        </div>
        <StatusBadge status={cred.status} />
        <ExpiryDisplay date={cred.expiry} />
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 border-t border-gray-100 grid grid-cols-2 gap-x-8 gap-y-2 text-sm ml-8">
          <div><span className="text-gray-500">Last Used:</span> <span className="text-gray-700">{cred.lastUsed || '—'}</span></div>
          <div><span className="text-gray-500">Last Rotation:</span> <span className="text-gray-700">{cred.lastRotation || '—'}</span></div>
          <div><span className="text-gray-500">Next Rotation:</span> <span className="text-gray-700">{cred.nextRotation || '—'}</span></div>
          <div><span className="text-gray-500">Storage:</span> <span className="text-gray-700">{cred.storageLocation || '—'}</span></div>
          <div><span className="text-gray-500">Vaulted:</span> <span className={cred.vaulted ? 'text-emerald-600' : 'text-amber-600'}>{cred.vaulted ? 'Yes' : 'No'}</span></div>
          <div><span className="text-gray-500">ID:</span> <span className="text-gray-400 font-mono text-xs">{cred.id}</span></div>
        </div>
      )}
    </div>
  );
}

function AccountSection({ account }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left mb-2 cursor-pointer">
        {open ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-400" />}
        <Server size={16} className="text-blue-500" />
        <SourceBadge source={account.source} size="md" />
        <span className="text-sm text-gray-500 font-mono">{account.nativeId}</span>
        <StatusBadge status={account.status} size="sm" />
        <span className="text-xs text-gray-400 ml-auto">Linked since {account.linkedSince}</span>
      </button>
      {open && (
        <div className="ml-8">
          {account.credentials.map(cred => (
            <CredentialDetail key={cred.id} cred={cred} />
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children, danger }) {
  return (
    <div className={`bg-white rounded-lg border ${danger ? 'border-red-200' : 'border-gray-200'} mb-4`}>
      <div className={`flex items-center gap-2 px-5 py-3 border-b ${danger ? 'border-red-100 bg-red-50/50' : 'border-gray-100'}`}>
        <Icon size={16} className={danger ? 'text-red-500' : 'text-gray-500'} />
        <h3 className={`text-sm font-semibold ${danger ? 'text-red-900' : 'text-gray-900'}`}>{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const nhi = nhis.find(n => n.id === id) || nhis[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Zluri</h1>
          <span className="text-gray-300 mx-1">/</span>
          <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">Non-Human Identities</button>
          <span className="text-gray-300 mx-1">/</span>
          <span className="text-sm text-gray-600">{nhi.name}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Back button */}
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 cursor-pointer">
          <ArrowLeft size={16} /> Back to list
        </button>

        {/* Section 1: Identity Header */}
        <div className={`bg-white rounded-lg border ${nhi.isOrphaned ? 'border-red-200' : 'border-gray-200'} p-6 mb-4`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{nhi.name}</h2>
                <StatusBadge status={nhi.status} size="md" />
                {nhi.isOrphaned && (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200">
                    <AlertTriangle size={12} /> Orphaned
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400 font-mono mb-3">{nhi.id}</div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Type:</span>
                  <span className="text-sm font-medium text-gray-700">{nhi.subType}</span>
                  <span className="text-xs text-gray-400">({nhi.subTypeFull})</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Sources:</span>
                  {nhi.sources.map(s => <SourceBadge key={s} source={s} size="sm" />)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 cursor-pointer">
                <Archive size={14} /> Archive
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 cursor-pointer">
                <RefreshCw size={14} /> Change Type
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 cursor-pointer">
                <GitMerge size={14} /> Merge
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Section 2: Ownership */}
          <Section title="Ownership & Relationships" icon={Users} danger={nhi.isOrphaned}>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Primary Owner</div>
                {nhi.owner ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                      {nhi.owner.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{nhi.owner}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                    <AlertTriangle size={14} /> No owner assigned
                    <button className="ml-auto text-xs text-red-700 underline cursor-pointer">Assign Owner</button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">All Owners</div>
                {nhi.allOwners.length > 0 ? (
                  <div className="text-sm text-gray-700">{nhi.allOwners.join(', ')}</div>
                ) : (
                  <div className="text-sm text-gray-400 italic">None</div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Created By</div>
                <div className="text-sm text-gray-700">{nhi.createdBy || <span className="text-gray-400 italic">Unknown</span>}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Accessed By</div>
                <div className="text-sm text-gray-700">{nhi.accessedBy?.join(', ') || <span className="text-gray-400 italic">Unknown</span>}</div>
              </div>
            </div>
          </Section>

          {/* Section 3: Timeline */}
          <Section title="Timeline & Activity" icon={Calendar}>
            <div className="space-y-3">
              {[
                { label: 'Last Active', value: nhi.lastActive, icon: Activity },
                { label: 'Discovered On', value: nhi.discoveredOn, icon: Eye },
                { label: 'Created', value: nhi.creationDate, icon: Calendar },
                { label: 'Last Updated', value: nhi.lastUpdated, icon: Clock },
              ].map(({ label, value, icon: Ic }) => (
                <div key={label} className="flex items-center gap-2">
                  <Ic size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">{label}</div>
                    <div className="text-sm text-gray-700">{value || '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Section 5: Subtype Details */}
          <Section title="Service Account Details" icon={Shield}>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Password Never Expires</div>
                <span className={`text-sm font-medium ${nhi.passwordNeverExpires ? 'text-red-600' : 'text-emerald-600'}`}>
                  {nhi.passwordNeverExpires ? (
                    <span className="flex items-center gap-1"><AlertTriangle size={14} /> True — security risk</span>
                  ) : 'False'}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Total Credentials</div>
                <div className="text-sm font-medium text-gray-700">{nhi.credentialsCount} across {nhi.accounts?.length || 0} accounts</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Risk Signals</div>
                <div className="space-y-1">
                  {nhi.isOrphaned && <div className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> No owner assigned</div>}
                  {nhi.passwordNeverExpires && <div className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> Password never expires</div>}
                  {nhi.accounts?.some(a => a.credentials.some(c => c.status === 'Expired')) && <div className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> Has expired credentials</div>}
                  {nhi.accounts?.some(a => a.credentials.some(c => !c.expiry)) && <div className="text-xs text-amber-600 flex items-center gap-1"><AlertTriangle size={12} /> Credentials with no expiry</div>}
                  {nhi.accounts?.some(a => a.credentials.some(c => c.status === 'Dormant')) && <div className="text-xs text-amber-600 flex items-center gap-1"><AlertTriangle size={12} /> Dormant credentials</div>}
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Section 4: Accounts & Credentials */}
        <Section title={`Accounts & Credentials (${nhi.accounts?.length || 0} accounts, ${nhi.credentialsCount} credentials)`} icon={Key}>
          {nhi.accounts?.map((account, i) => (
            <AccountSection key={i} account={account} />
          ))}
        </Section>

        {/* Section 6: Activity Logs */}
        <Section title="Activity Log" icon={Activity}>
          <div className="space-y-0">
            {ACTIVITY_LOGS.map((log, i) => (
              <div key={i} className={`flex gap-4 py-3 ${i !== ACTIVITY_LOGS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="text-xs text-gray-400 w-36 shrink-0 font-mono">{log.timestamp}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{log.action}</span>
                    <SourceBadge source={log.source} size="sm" />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{log.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
