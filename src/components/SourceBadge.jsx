const SOURCE_COLORS = {
  AWS: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  GitHub: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  GCP: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Azure: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  Slack: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Okta: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  Datadog: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  GitLab: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Salesforce: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  ServiceNow: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Terraform Cloud': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  Kubernetes: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

const FALLBACK = { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };

export default function SourceBadge({ source, size = 'sm' }) {
  const c = SOURCE_COLORS[source] || FALLBACK;
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';
  return (
    <span className={`inline-flex items-center rounded border font-medium ${c.bg} ${c.text} ${c.border} ${sizeClass}`}>
      {source}
    </span>
  );
}
