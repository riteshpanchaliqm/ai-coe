import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { api } from '../lib/api';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface Guideline {
  id: string;
  version: string;
  effective_from: string;
  sections: { title: string; body_markdown: string }[];
  checkpoints: { id: string; label: string; description?: string }[];
}

export function GuidelinesPage() {
  const [guideline, setGuideline] = useState<Guideline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get<{ guideline: Guideline | null }>('/guidelines/active');
        setGuideline(res.guideline);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading guidelines...</p>;
  if (!guideline) return <p className="text-muted-foreground">No active guidelines published yet.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Project Technical Guidelines</h1>
          <p className="text-sm text-muted-foreground">
            Version {guideline.version} · Effective from {new Date(guideline.effective_from).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="grid gap-4">
        {guideline.sections?.map((section, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.body_markdown}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checkpoints */}
      {guideline.checkpoints?.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Minimum Readiness Checklist
            </h2>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {guideline.checkpoints.map((cp) => (
                    <div key={cp.id} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded border border-muted-foreground/30 flex items-center justify-center mt-0.5 shrink-0">
                        <span className="text-[10px] text-muted-foreground">☐</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cp.label}</p>
                        {cp.description && (
                          <p className="text-xs text-muted-foreground">{cp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
