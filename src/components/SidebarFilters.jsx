import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

function FilterSection({ title, options, selected, onChange }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-3 mb-3">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 cursor-pointer">
        {title}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="space-y-1.5">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => {
                  onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SidebarFilters({ filters, onChange }) {
  return (
    <div className="w-56 shrink-0 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="text-sm font-semibold text-gray-900 mb-4">Filters</div>
      <FilterSection
        title="Sub Type"
        options={['Service Account', 'Application Identity', 'Machine / Workload', 'AI Agent / Bot']}
        selected={filters.subType}
        onChange={v => onChange({ ...filters, subType: v })}
      />
      <FilterSection
        title="Status"
        options={['Active', 'Dormant', 'Suspended', 'Decommissioned']}
        selected={filters.status}
        onChange={v => onChange({ ...filters, status: v })}
      />
      <FilterSection
        title="Source"
        options={['AWS', 'GitHub', 'GCP', 'Azure', 'Okta', 'Slack', 'Datadog', 'GitLab', 'Salesforce', 'ServiceNow', 'Terraform Cloud', 'Kubernetes']}
        selected={filters.source}
        onChange={v => onChange({ ...filters, source: v })}
      />
      {filters.subType.length > 0 || filters.status.length > 0 || filters.source.length > 0 ? (
        <button
          onClick={() => onChange({ subType: [], status: [], source: [] })}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 cursor-pointer"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}
