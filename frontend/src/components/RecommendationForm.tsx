import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api } from '../lib/api';

interface RecommendationFormProps {
  proposalId: string;
  onSubmitted: () => void;
}

type Rec = 'approve' | 'approve_with_conditions' | 'needs_more_info' | 'reject';

export function RecommendationForm({ proposalId, onSubmitted }: RecommendationFormProps) {
  const [recommendation, setRecommendation] = useState<Rec | ''>('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = () => {
    if (!recommendation) return false;
    if (recommendation === 'approve') return true;
    return text.trim().length > 0;
  };

  const handleSubmit = async () => {
    if (!isValid()) { setError('Please fill in the required fields.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/comments', {
        proposal_id: proposalId,
        body: text || 'Approved',
        recommendation,
        conditions: recommendation === 'approve_with_conditions' ? text : undefined,
      });
      setRecommendation('');
      setText('');
      onSubmitted();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    }
    setSubmitting(false);
  };

  const options: { value: Rec; label: string }[] = [
    { value: 'approve', label: 'Approve' },
    { value: 'approve_with_conditions', label: 'Approve with Conditions' },
    { value: 'needs_more_info', label: 'Needs More Info' },
    { value: 'reject', label: 'Reject' },
  ];

  const fieldLabels: Record<string, string> = {
    approve: 'Rationale (optional)',
    approve_with_conditions: 'Conditions (required)',
    needs_more_info: 'Specific questions (required)',
    reject: 'Reason for rejection (required)',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Post Your Recommendation</CardTitle>
        <p className="text-sm text-muted-foreground">
          Every committee member must post a recommendation before the Chair can finalize.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant={recommendation === opt.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setRecommendation(opt.value); setError(''); }}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {recommendation && (
          <div>
            <Label>{fieldLabels[recommendation]}</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!recommendation || submitting}>
            {submitting ? 'Submitting...' : 'Submit Recommendation'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
