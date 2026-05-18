import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ProposalsTable } from '../components/ProposalsTable';

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

export function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">All Proposals</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <ProposalsTable proposals={proposals} showSubmitter={true} />
      )}
    </div>
  );
}
