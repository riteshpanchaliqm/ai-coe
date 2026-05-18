import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { api } from '../../lib/api';

interface Analytics {
  total_proposals: number;
  by_status: { status: string; count: string }[];
  by_department: { department: string; count: string }[];
  avg_days_to_decision: string | null;
}

export function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get<Analytics>('/admin/analytics');
        setData(res);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading || !data) return <p className="text-muted-foreground">Loading analytics...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Total Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.total_proposals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Avg. Days to Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.avg_days_to_decision || '—'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">By Status</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.by_status.map((item) => (
              <div key={item.status} className="flex justify-between text-sm">
                <span>{item.status.replace(/_/g, ' ')}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">By Department</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.by_department.map((item) => (
              <div key={item.department} className="flex justify-between text-sm">
                <span>{item.department}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
