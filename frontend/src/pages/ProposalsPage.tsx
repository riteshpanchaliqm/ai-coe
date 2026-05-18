import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { api } from '../lib/api';

interface Proposal {
  id: string;
  title: string;
  department: string;
  status: string;
  submitter_name: string;
  submitted_at: string;
  urgency: string;
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

export function ProposalsPage() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ proposals: Proposal[] }>('/proposals');
        setProposals(res.proposals);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProposals();
  }, []);

  const filtered = proposals.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      p.submitter_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">All Proposals</h1>
        <Input
          placeholder="Search proposals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No proposals found.</p>
      ) : (
        <div className="border rounded-lg divide-y">
          {filtered.map((proposal) => (
            <div
              key={proposal.id}
              className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => navigate(`/proposals/${proposal.id}`)}
            >
              <div>
                <p className="font-medium">{proposal.title}</p>
                <p className="text-sm text-muted-foreground">
                  {proposal.submitter_name} · {proposal.department} ·{' '}
                  {proposal.submitted_at
                    ? new Date(proposal.submitted_at).toLocaleDateString()
                    : 'Draft'}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[proposal.status] || 'default'}>
                {proposal.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
