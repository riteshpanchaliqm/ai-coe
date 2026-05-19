import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getStatusLabel } from '../lib/status';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Proposal {
  id: string;
  title: string;
  department: string;
  status: string;
  submitter_name: string;
  submitted_at: string;
  created_at: string;
  urgency: string;
}

interface ProposalsTableProps {
  proposals: Proposal[];
  showSubmitter?: boolean;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
  draft: 'secondary',
  submitted: 'info',
  under_triage: 'info',
  needs_clarification: 'warning',
  in_review: 'default',
  awaiting_decision: 'warning',
  approved: 'success',
  approved_with_conditions: 'success',
  parked: 'secondary',
  rejected: 'destructive',
  shipped: 'success',
};

const DEPARTMENTS = ['All', 'Tech', 'Finance', 'Sales', 'Marketing', 'Tech Support', 'Customer Service', 'Legal', 'Product', 'AI Department'];
const STATUSES = ['All', 'draft', 'submitted', 'under_triage', 'needs_clarification', 'in_review', 'awaiting_decision', 'approved', 'approved_with_conditions', 'parked', 'rejected', 'shipped'];

type SortField = 'title' | 'department' | 'status' | 'submitted_at' | 'submitter_name';
type SortDir = 'asc' | 'desc';

export function ProposalsTable({ proposals, showSubmitter = true }: ProposalsTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('submitted_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const filtered = useMemo(() => {
    let result = [...proposals];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.department?.toLowerCase().includes(q) ||
          p.submitter_name?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Department filter
    if (deptFilter !== 'All') {
      result = result.filter((p) => p.department === deptFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = (a as any)[sortField] || '';
      let bVal = (b as any)[sortField] || '';
      if (sortField === 'submitted_at') {
        aVal = a.submitted_at || a.created_at || '';
        bVal = b.submitted_at || b.created_at || '';
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [proposals, search, statusFilter, deptFilter, sortField, sortDir]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s === 'All' ? 'All Statuses' : getStatusLabel(s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>{d === 'All' ? 'All Departments' : d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} of {proposals.length} proposals
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-3 font-medium">
                <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('title')}>
                  Title <SortIcon field="title" />
                </button>
              </th>
              {showSubmitter && (
                <th className="text-left p-3 font-medium">
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('submitter_name')}>
                    Submitter <SortIcon field="submitter_name" />
                  </button>
                </th>
              )}
              <th className="text-left p-3 font-medium">
                <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('department')}>
                  Department <SortIcon field="department" />
                </button>
              </th>
              <th className="text-left p-3 font-medium">
                <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('status')}>
                  Status <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left p-3 font-medium">
                <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('submitted_at')}>
                  Date <SortIcon field="submitted_at" />
                </button>
              </th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={showSubmitter ? 6 : 5} className="p-8 text-center text-muted-foreground">
                  No proposals found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/proposals/${p.id}`)}
                >
                  <td className="p-3 font-medium">{p.title}</td>
                  {showSubmitter && <td className="p-3 text-muted-foreground">{p.submitter_name}</td>}
                  <td className="p-3 text-muted-foreground">{p.department}</td>
                  <td className="p-3">
                    <Badge variant={STATUS_VARIANT[p.status] || 'default'} className="text-[11px]">
                      {getStatusLabel(p.status)}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {(p.submitted_at || p.created_at) && new Date(p.submitted_at || p.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" className="text-xs">View</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
