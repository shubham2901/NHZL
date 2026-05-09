const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Dormant: 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-red-50 text-red-700 border-red-200',
  Decommissioned: 'bg-gray-100 text-gray-500 border-gray-200',
  Expired: 'bg-red-50 text-red-700 border-red-200',
  Revoked: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const style = STATUS_STYLES[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  const dot = status === 'Active' ? 'bg-emerald-500' : status === 'Dormant' ? 'bg-amber-500' : status === 'Suspended' || status === 'Expired' || status === 'Revoked' ? 'bg-red-500' : 'bg-gray-400';
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${style} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
