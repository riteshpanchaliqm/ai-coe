import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { api } from '../../lib/api';
import { getStatusLabel } from '../../lib/status';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Clock, FileText, CheckCircle } from 'lucide-react';

interface Analytics {
  total_proposals: number;
  by_status: { status: string; count: string }[];
  by_department: { department: string; count: string }[];
  avg_days_to_decision: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  draft: '#94a3b8',
  submitted: '#60a5fa',
  under_triage: '#38bdf8',
  needs_clarification: '#fbbf24',
  in_review: '#818cf8',
  awaiting_decision: '#f59e0b',
  approved: '#34d399',
  approved_with_conditions: '#6ee7b7',
  parked: '#a1a1aa',
  rejected: '#f87171',
  shipped: '#10b981',
};

const DEPT_COLORS = ['#818cf8', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#38bdf8', '#e879f9'];

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

  const statusData = data.by_status.map((item) => ({
    name: getStatusLabel(item.status),
    value: parseInt(item.count, 10),
    fill: STATUS_COLORS[item.status] || '#94a3b8',
  }));

  const deptData = data.by_department.map((item, idx) => ({
    name: item.department,
    value: parseInt(item.count, 10),
    fill: DEPT_COLORS[idx % DEPT_COLORS.length],
  }));

  const approvedCount = data.by_status
    .filter((s) => ['approved', 'approved_with_conditions', 'shipped'].includes(s.status))
    .reduce((sum, s) => sum + parseInt(s.count, 10), 0);

  const pendingCount = data.by_status
    .filter((s) => ['submitted', 'under_triage', 'in_review', 'awaiting_decision'].includes(s.status))
    .reduce((sum, s) => sum + parseInt(s.count, 10), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Proposals</p>
                <p className="text-2xl font-bold">{data.total_proposals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Days to Decision</p>
                <p className="text-2xl font-bold">{data.avg_days_to_decision || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Status Distribution - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proposals by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" fontSize={11} height={60} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-12">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Department Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proposals by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={false}
                    fontSize={11}
                  >
                    {deptData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend fontSize={12} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-12">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Status Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.by_status.map((item) => (
              <div key={item.status} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] || '#94a3b8' }} />
                  <span className="text-sm">{getStatusLabel(item.status)}</span>
                </div>
                <span className="text-sm font-semibold">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Department Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.by_department.map((item, idx) => (
              <div key={item.department} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: DEPT_COLORS[idx % DEPT_COLORS.length] }} />
                  <span className="text-sm">{item.department}</span>
                </div>
                <span className="text-sm font-semibold">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
