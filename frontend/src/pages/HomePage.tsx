import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent } from '../components/ui/card';
import { api } from '../lib/api';
import { PlusCircle, FileText, Clock, CheckCircle, AlertTriangle, XCircle, Pause, Rocket } from 'lucide-react';

const STATUS_TILES = [
  { status: 'submitted', label: 'Submitted', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { status: 'under_triage', label: 'Under Triage', icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { status: 'in_review', label: 'In Review', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { status: 'awaiting_decision', label: 'Awaiting Decision', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { status: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  { status: 'approved_with_conditions', label: 'Approved w/ Conditions', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { status: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  { status: 'parked', label: 'Parked', icon: Pause, color: 'text-gray-600', bg: 'bg-gray-50' },
  { status: 'shipped', label: 'Shipped', icon: Rocket, color: 'text-teal-600', bg: 'bg-teal-50' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch all proposals and count locally
        const res = await api.get<{ proposals: { status: string }[]; pagination: { total: number } }>('/proposals?limit=100');
        setTotal(res.pagination.total);
        const map: Record<string, number> = {};
        res.proposals.forEach((p) => {
          map[p.status] = (map[p.status] || 0) + 1;
        });
        setCounts(map);
      } catch {
        // Might not have access
      }
    };
    fetchCounts();
  }, []);

  const isReviewer = user?.roles.some((r) => ['reviewer', 'chair', 'admin'].includes(r));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
          The AI Center of Excellence Portal — submit proposals, get structured feedback, and track outcomes.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/submit')}>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Submit a Proposal</p>
              <p className="text-sm text-muted-foreground">Have an AI idea? Submit it for review.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(isReviewer ? '/proposals' : '/my-proposals')}>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{isReviewer ? 'All Proposals' : 'My Proposals'}</p>
              <p className="text-sm text-muted-foreground">{isReviewer ? 'Browse and review all submissions.' : 'Track your submissions.'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/guidelines')}>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Guidelines</p>
              <p className="text-sm text-muted-foreground">View project technical guidelines.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status tiles */}
      {isReviewer && Object.keys(counts).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Proposal Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATUS_TILES.map((tile) => {
              const count = counts[tile.status] || 0;
              if (count === 0) return null;
              const Icon = tile.icon;
              return (
                <Card key={tile.status} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-lg ${tile.bg} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${tile.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground">{tile.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
