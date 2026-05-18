import { useState } from 'react';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface StatusActionsProps {
  proposalId: string;
  currentStatus: string;
  onStatusChanged: () => void;
}

const TRANSITIONS: Record<string, { label: string; target: string }[]> = {
  submitted: [
    { label: 'Start Triage', target: 'under_triage' },
    { label: 'Move to Review', target: 'in_review' },
  ],
  under_triage: [
    { label: 'Request Clarification', target: 'needs_clarification' },
    { label: 'Schedule Meeting', target: 'meeting_scheduled' },
    { label: 'Move to Review', target: 'in_review' },
  ],
  needs_clarification: [
    { label: 'Re-submit', target: 'submitted' },
  ],
  meeting_scheduled: [
    { label: 'Move to Review', target: 'in_review' },
  ],
  in_review: [
    { label: 'Ready for Decision', target: 'awaiting_decision' },
  ],
};

export function StatusActions({ proposalId, currentStatus, onStatusChanged }: StatusActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const actions = TRANSITIONS[currentStatus];
  if (!actions || actions.length === 0) return null;

  const handleTransition = async (target: string) => {
    setLoading(true);
    setError('');
    try {
      await api.patch(`/proposals/${proposalId}/status`, { status: target });
      onStatusChanged();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
      <p className="text-sm font-medium">Actions</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.target}
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => handleTransition(action.target)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
