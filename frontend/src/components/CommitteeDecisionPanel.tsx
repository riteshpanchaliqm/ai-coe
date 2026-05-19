import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Shield } from 'lucide-react';

interface Reviewer {
  user_id: string;
  name: string;
  email: string;
  recommendation: string | null;
  recommended_at: string | null;
}

interface QuorumData {
  total_reviewers: number;
  recommendations_received: number;
  quorum_met: boolean;
  reviewers: Reviewer[];
}

interface CommitteeDecisionPanelProps {
  proposalId: string;
  proposalStatus: string;
  onUpdated: () => void;
}

const REC_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string; badgeVariant: 'success' | 'destructive' | 'warning' | 'default' }> = {
  approve: { label: 'Approved', icon: CheckCircle2, color: 'text-green-600', badgeVariant: 'success' },
  approve_with_conditions: { label: 'Approved with Conditions', icon: AlertTriangle, color: 'text-amber-600', badgeVariant: 'warning' },
  needs_more_info: { label: 'Needs More Info', icon: Clock, color: 'text-blue-600', badgeVariant: 'default' },
  reject: { label: 'Rejected', icon: XCircle, color: 'text-red-600', badgeVariant: 'destructive' },
};

export function CommitteeDecisionPanel({ proposalId, proposalStatus, onUpdated }: CommitteeDecisionPanelProps) {
  const { user } = useAuthStore();
  const [quorum, setQuorum] = useState<QuorumData | null>(null);
  const [myRec, setMyRec] = useState<string>('');
  const [myText, setMyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verdictDecision, setVerdictDecision] = useState<string>('');
  const [verdictRationale, setVerdictRationale] = useState('');
  const [verdictConditions, setVerdictConditions] = useState('');
  const [verdictSubmitting, setVerdictSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isChair = user?.roles.includes('chair');
  const isReviewer = user?.roles.some((r) => ['reviewer', 'chair'].includes(r));
  const isDecisionStage = ['in_review', 'awaiting_decision'].includes(proposalStatus);

  useEffect(() => {
    const fetchQuorum = async () => {
      try {
        const res = await api.get<QuorumData>(`/comments/recommendations/${proposalId}`);
        setQuorum(res);
      } catch (err) {
        console.error(err);
      }
    };
    if (isDecisionStage) fetchQuorum();
  }, [proposalId, proposalStatus]);

  const submitRecommendation = async () => {
    if (!myRec) return;
    if (myRec !== 'approve' && !myText.trim()) {
      setError('Please provide details for your recommendation.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/comments', {
        proposal_id: proposalId,
        body: myText || 'Approved',
        recommendation: myRec,
        conditions: myRec === 'approve_with_conditions' ? myText : undefined,
      });
      setMyRec('');
      setMyText('');
      onUpdated();
      // Refresh quorum
      const res = await api.get<QuorumData>(`/comments/recommendations/${proposalId}`);
      setQuorum(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    }
    setSubmitting(false);
  };

  const submitVerdict = async () => {
    if (!verdictDecision || !verdictRationale.trim()) {
      setError('Decision and rationale are required.');
      return;
    }
    setVerdictSubmitting(true);
    setError('');
    try {
      await api.post('/verdicts', {
        proposal_id: proposalId,
        decision: verdictDecision,
        rationale: verdictRationale,
        conditions: verdictDecision === 'approved_with_conditions' ? verdictConditions : undefined,
      });
      onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to post verdict');
    }
    setVerdictSubmitting(false);
  };

  if (!isDecisionStage || !quorum) return null;

  const myReviewerEntry = quorum.reviewers?.find((r) => r.user_id === user?.id);
  const hasSubmitted = !!myReviewerEntry?.recommendation;

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Committee Decision
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={quorum.quorum_met ? 'success' : 'warning'}>
              {quorum.recommendations_received}/{quorum.total_reviewers} Reviewed
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* All reviewers' status */}
        <div className="space-y-2">
          {quorum.reviewers?.map((reviewer) => {
            const rec = reviewer.recommendation;
            const config = rec ? REC_CONFIG[rec] : null;
            const Icon = config?.icon || Clock;
            const isMe = reviewer.user_id === user?.id;

            return (
              <div
                key={reviewer.user_id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  rec ? 'bg-muted/30' : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    rec ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {reviewer.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {reviewer.name}
                      {isMe && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
                    </p>
                    {rec && reviewer.recommended_at && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(reviewer.recommended_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rec ? (
                    <Badge variant={config?.badgeVariant || 'default'} className="gap-1">
                      <Icon className="h-3 w-3" />
                      {config?.label}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-700 border-amber-300 gap-1">
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* My recommendation form (only if I'm a reviewer and haven't submitted) */}
        {isReviewer && !hasSubmitted && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Your Recommendation</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(REC_CONFIG).map(([key, config]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={myRec === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setMyRec(key); setError(''); }}
                    className="gap-1.5"
                  >
                    <config.icon className="h-3.5 w-3.5" />
                    {config.label}
                  </Button>
                ))}
              </div>
              {myRec && (
                <Textarea
                  value={myText}
                  onChange={(e) => setMyText(e.target.value)}
                  rows={3}
                  placeholder={
                    myRec === 'approve' ? 'Rationale (optional)...' :
                    myRec === 'approve_with_conditions' ? 'List the conditions...' :
                    myRec === 'needs_more_info' ? 'What questions do you have?' :
                    'Reason for rejection...'
                  }
                />
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end">
                <Button size="sm" onClick={submitRecommendation} disabled={!myRec || submitting}>
                  {submitting ? 'Submitting...' : 'Submit Recommendation'}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Chair verdict (only when quorum met) */}
        {isChair && quorum.quorum_met && proposalStatus === 'awaiting_decision' && (
          <>
            <Separator />
            <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <Label className="text-sm font-semibold flex items-center gap-2">
                Final Verdict
                <Badge variant="warning" className="text-[10px]">Chair Only</Badge>
              </Label>
              <p className="text-xs text-muted-foreground">All reviewers have submitted. Post the final decision.</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'approved', label: 'Approve' },
                  { value: 'approved_with_conditions', label: 'Approve with Conditions' },
                  { value: 'parked', label: 'Park' },
                  { value: 'rejected', label: 'Reject' },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={verdictDecision === opt.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setVerdictDecision(opt.value); setError(''); }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
              {verdictDecision && (
                <>
                  <Textarea
                    value={verdictRationale}
                    onChange={(e) => setVerdictRationale(e.target.value)}
                    rows={3}
                    placeholder="Rationale for this decision..."
                  />
                  {verdictDecision === 'approved_with_conditions' && (
                    <Textarea
                      value={verdictConditions}
                      onChange={(e) => setVerdictConditions(e.target.value)}
                      rows={2}
                      placeholder="Conditions that must be met..."
                    />
                  )}
                </>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end">
                <Button onClick={submitVerdict} disabled={!verdictDecision || verdictSubmitting}>
                  {verdictSubmitting ? 'Posting...' : 'Post Final Verdict'}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Quorum not met message for chair */}
        {isChair && !quorum.quorum_met && proposalStatus === 'awaiting_decision' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Waiting for all reviewers to submit recommendations ({quorum.recommendations_received}/{quorum.total_reviewers} received).
              Cannot post verdict until quorum is met.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
