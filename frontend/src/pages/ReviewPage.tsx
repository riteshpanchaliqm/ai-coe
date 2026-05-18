import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
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

export function ReviewPage() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get<{ proposals: Proposal[] }>(
          '/proposals?status=submitted&status=under_triage&status=in_review&status=awaiting_decision'
        );
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
      <h1 className="text-2xl font-bold tracking-tight">Review Queue</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : proposals.length === 0 ? (
        <p className="text-muted-foreground">No proposals awaiting review.</p>
      ) : (
        <div className="border rounded-lg divide-y">
          {proposals.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.submitter_name} · {p.department} · {p.urgency?.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="info">{p.status.replace(/_/g, ' ')}</Badge>
                <Button size="sm" onClick={() => navigate(`/proposals/${p.id}`)}>
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
