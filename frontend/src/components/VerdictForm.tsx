import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { api } from '../lib/api';

interface VerdictFormProps {
  proposalId: string;
  onSubmitted: () => void;
}

type Decision = 'approved' | 'approved_with_conditions' | 'parked' | 'rejected';

export function VerdictForm({ proposalId, onSubmitted }: VerdictFormProps) {
  const [decision, setDecision] = useState<Decision | ''>('');
  const [rationale, setRationale] = useState('');
  const [conditions, setConditions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = () => {
    if (!decision) return false;
    if (!rationale.trim()) return false;
    if (decision === 'approved_with_conditions' && !conditions.trim()) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/verdicts', {
        proposal_id: proposalId,
        decision,
        rationale,
        conditions: decision === 'approved_with_conditions' ? conditions : undefined,
      });
      onSubmitted();
    } catch (err: any) {
      setError(err.message || 'Failed to post verdict');
    }
    setSubmitting(false);
  };

  const options: { value: Decision; label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline' }[] = [
    { value: 'approved', label: 'Approve', variant: 'default' },
    { value: 'approved_with_conditions', label: 'Approve with Conditions', variant: 'outline' },
    { value: 'parked', label: 'Park (Revisit Later)', variant: 'secondary' },
    { value: 'rejected', label: 'Reject', variant: 'destructive' },
  ];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Post Final Verdict</CardTitle>
          <Badge variant="warning">Chair Only</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          This action is final and will lock the proposal. All reviewers have posted their recommendations.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Decision *</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant={decision === opt.value ? opt.variant : 'outline'}
                size="sm"
                onClick={() => { setDecision(opt.value); setError(''); }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {decision && (
          <>
            <div>
              <Label>Rationale *</Label>
              <Textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                rows={3}
                placeholder="Explain the reasoning behind this decision..."
                className="mt-1"
              />
            </div>

            {decision === 'approved_with_conditions' && (
              <div>
                <Label>Conditions *</Label>
                <Textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  rows={3}
                  placeholder="List the conditions that must be met..."
                  className="mt-1"
                />
              </div>
            )}
          </>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!decision || submitting}>
            {submitting ? 'Posting...' : 'Post Final Verdict'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
