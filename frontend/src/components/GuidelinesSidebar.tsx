import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { api } from '../lib/api';
import { BookOpen, ChevronDown, ChevronRight, CheckSquare } from 'lucide-react';

interface Guideline {
  id: string;
  version: string;
  effective_from: string;
  sections: { title: string; body_markdown: string }[];
  checkpoints: { id: string; label: string; description?: string }[];
}

export function GuidelinesSidebar() {
  const [guideline, setGuideline] = useState<Guideline | null>(null);
  const [expanded, setExpanded] = useState(true);
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

  if (loading || !guideline) return null;

  return (
    <Card className="w-[400px] shrink-0 self-start flex flex-col">
      <CardHeader
        className="cursor-pointer pb-3 shrink-0"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Project Guidelines</CardTitle>
            <Badge variant="secondary" className="text-[10px]">{guideline.version}</Badge>
          </div>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Effective from {new Date(guideline.effective_from).toLocaleDateString()}
        </p>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 flex-1">
          {/* Sections */}
          <div className="space-y-4">
            {guideline.sections?.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {section.title}
                </h4>
                <ul className="space-y-1 pl-4">
                  {section.body_markdown.split('. ').filter(Boolean).map((point, pIdx) => (
                    <li key={pIdx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-muted-foreground/60 mt-1 shrink-0">•</span>
                      <span>{point.trim().replace(/\.$/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Checkpoints */}
          {guideline.checkpoints?.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-primary" />
                  Readiness Checklist
                </h4>
                <div className="space-y-2">
                  {guideline.checkpoints.map((cp) => (
                    <div key={cp.id} className="flex items-start gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors">
                      <div className="h-4 w-4 rounded border border-muted-foreground/30 flex items-center justify-center mt-0.5 shrink-0">
                        <span className="text-[8px] text-muted-foreground">☐</span>
                      </div>
                      <div>
                        <p className="text-xs leading-tight">{cp.label}</p>
                        {cp.description && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">{cp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
