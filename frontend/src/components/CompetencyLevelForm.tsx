import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { api } from '../lib/api';

interface CompetencyLevelFormProps {
  proposalId: string;
  currentLevel: number | null;
  onUpdated: () => void;
}

const LEVELS = [
  { level: 0, name: 'AI Aware', description: 'Using ChatGPT/Claude for basic tasks like drafting emails or summarizing meetings', color: 'bg-slate-100 border-slate-300' },
  { level: 1, name: 'AI Prompted', description: 'Standard prompt templates for repeatable tasks (e.g., generating JDs, reports)', color: 'bg-blue-50 border-blue-300' },
  { level: 2, name: 'AI Builder', description: 'Vibe-coded tools/portals built with AI assistance for team use', color: 'bg-indigo-50 border-indigo-300' },
  { level: 3, name: 'AI Integrated', description: 'Workflows connected to platform that auto-route or generate outputs', color: 'bg-green-50 border-green-300' },
  { level: 4, name: 'AI Orchestrated', description: 'Multi-agent pipelines: code review → test → human sign-off → deploy', color: 'bg-amber-50 border-amber-300' },
  { level: 5, name: 'AI Native', description: 'Autonomous AI that monitors, decides, and acts 24/7 with minimal human oversight', color: 'bg-red-50 border-red-300' },
];

export function CompetencyLevelForm({ proposalId, currentLevel, onUpdated }: CompetencyLevelFormProps) {
  const [selected, setSelected] = useState<number | null>(currentLevel);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (selected === null) return;
    setSaving(true);
    try {
      await api.patch(`/proposals/${proposalId}/competency-level`, { level: selected });
      onUpdated();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">AI Competency Level</CardTitle>
          {currentLevel !== null && (
            <Badge variant="default">L{currentLevel} — {LEVELS[currentLevel]?.name}</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Assign the AI maturity level this proposal represents for the department.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {LEVELS.map((l) => (
            <div
              key={l.level}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selected === l.level ? 'border-primary bg-primary/5 ring-1 ring-primary' : l.color
              }`}
              onClick={() => setSelected(l.level)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-muted-foreground">L{l.level}</span>
                <span className="text-sm font-semibold">{l.name}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">{l.description}</p>
            </div>
          ))}
        </div>

        {selected !== currentLevel && (
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Set Level'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
