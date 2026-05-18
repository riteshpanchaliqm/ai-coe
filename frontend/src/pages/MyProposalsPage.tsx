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

export function MyProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get<{ proposals: Proposal[] }>('/proposals?mine=true');
        setProposals(res.proposals);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">My Proposals</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : proposals.length === 0 ? (
        <p className="text-muted-foreground">You haven't submitted any proposals yet.</p>
      ) : (
        <ProposalsTable proposals={proposals} showSubmitter={false} />
      )}
    </div>
  );
}
