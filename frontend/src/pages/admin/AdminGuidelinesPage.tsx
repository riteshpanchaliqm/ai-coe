import { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { api } from '../../lib/api';

interface Guideline {
  id: string;
  version: string;
  effective_from: string;
  is_active: boolean;
  created_at: string;
}

export function AdminGuidelinesPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [version, setVersion] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState('');

  const fetchGuidelines = async () => {
    try {
      const res = await api.get<{ guidelines: Guideline[] }>('/guidelines');
      setGuidelines(res.guidelines);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchGuidelines(); }, []);

  const activateGuideline = async (id: string) => {
    await api.patch(`/guidelines/${id}/activate`, {});
    fetchGuidelines();
  };

  const createGuideline = async () => {
    await api.post('/guidelines', {
      version, effective_from: effectiveFrom, sections: [], checkpoints: [], is_active: true,
    });
    setShowForm(false);
    setVersion('');
    setEffectiveFrom('');
    fetchGuidelines();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Guidelines Management</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Version'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-4 flex items-end gap-4">
            <div>
              <Label>Version</Label>
              <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="v1.1.0" />
            </div>
            <div>
              <Label>Effective From</Label>
              <Input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} />
            </div>
            <Button size="sm" onClick={createGuideline}>Create & Activate</Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="border rounded-lg divide-y">
          {guidelines.map((g) => (
            <div key={g.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="font-medium">{g.version}</span>
                {g.is_active && <Badge variant="success">Active</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Effective: {new Date(g.effective_from).toLocaleDateString()}
                </span>
                {!g.is_active && (
                  <Button variant="outline" size="sm" onClick={() => activateGuideline(g.id)}>
                    Activate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
