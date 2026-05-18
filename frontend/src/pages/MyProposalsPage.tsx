import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { api } from '../lib/api';

interface Proposal {
  id: string;
  title: string;
  status: string;
  submitted_at: string;
  created_at: string;
}

export function MyProposalsPage() {
  const navigate = useNavigate();
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
        <div className="border rounded-lg divide-y">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => navigate(`/proposals/${p.id}`)}
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.submitted_at
                    ? `Submitted ${new Date(p.submitted_at).toLocaleDateString()}`
                    : `Draft — created ${new Date(p.created_at).toLocaleDateString()}`}
                </p>
              </div>
              <Badge variant="secondary">{p.status.replace(/_/g, ' ')}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
