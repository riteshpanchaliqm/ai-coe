import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { StatusTimeline } from '../components/StatusTimeline';
import { StatusActions } from '../components/StatusActions';
import { RecommendationForm } from '../components/RecommendationForm';
import { VerdictForm } from '../components/VerdictForm';

interface Proposal {
  id: string; title: string; department: string; problem_statement: string;
  proposed_solution: string; expected_impact: string; current_status: string;
  urgency: string; urgency_reason: string; status: string;
  submitter_name: string; submitter_email: string; submitted_at: string;
}

interface Comment {
  id: string; body: string; author_name: string; author_roles: string[];
  recommendation: string | null; created_at: string; parent_comment_id: string | null;
}

export function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const isReviewer = user?.roles.some((r) => ['reviewer', 'chair'].includes(r));
  const isChair = user?.roles.includes('chair');
  const reviewableStatuses = ['in_review', 'awaiting_decision'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [proposalRes, commentsRes] = await Promise.all([
        api.get<{ proposal: Proposal }>(`/proposals/${id}`),
        api.get<{ comments: Comment[] }>(`/comments?proposal_id=${id}`),
      ]);
      setProposal(proposalRes.proposal);
      setComments(commentsRes.comments);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post('/comments', { proposal_id: id, body: newComment });
      setNewComment('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !proposal) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{proposal.title}</h1>
        <Badge>{
          proposal.status === 'draft' ? 'Draft' :
          proposal.status === 'submitted' ? 'Submitted' :
          proposal.status === 'under_triage' ? 'Under Triage' :
          proposal.status === 'needs_clarification' ? 'Needs Clarification' :
          proposal.status === 'meeting_scheduled' ? 'Meeting Scheduled' :
          proposal.status === 'in_review' ? 'In Review' :
          proposal.status === 'awaiting_decision' ? 'Awaiting Decision' :
          proposal.status === 'approved' ? 'Approved' :
          proposal.status === 'approved_with_conditions' ? 'Approved with Conditions' :
          proposal.status === 'parked' ? 'Parked' :
          proposal.status === 'rejected' ? 'Rejected' :
          proposal.status === 'shipped' ? 'Shipped' :
          proposal.status
        }</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Submitted by {proposal.submitter_name} · {proposal.department} ·{' '}
        {proposal.submitted_at && new Date(proposal.submitted_at).toLocaleDateString()}
      </p>

      {/* Status Timeline */}
      <StatusTimeline currentStatus={proposal.status} />

      {/* Reviewer Actions */}
      {isReviewer && (
        <StatusActions proposalId={id!} currentStatus={proposal.status} onStatusChanged={fetchData} />
      )}

      {/* Proposal Content */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Problem Statement</h3>
            <p className="text-sm">{proposal.problem_statement}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-sm mb-1">Proposed Solution</h3>
            <p className="text-sm">{proposal.proposed_solution}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-sm mb-1">Expected Impact</h3>
            <p className="text-sm">{proposal.expected_impact}</p>
          </div>
          <Separator />
          <div className="flex gap-8">
            <div>
              <h3 className="font-semibold text-sm mb-1">Status</h3>
              <p className="text-sm capitalize">{proposal.current_status === 'nearly_complete' ? 'Nearly Complete' : proposal.current_status === 'partial' ? 'Partially Built' : proposal.current_status}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Urgency</h3>
              <p className="text-sm">{
                proposal.urgency === 'two_weeks' ? '2 Weeks' :
                proposal.urgency === 'one_month' ? '1 Month' :
                proposal.urgency === 'one_quarter' ? '1 Quarter' :
                proposal.urgency === 'no_deadline' ? 'No Deadline' :
                proposal.urgency
              }</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Form (reviewers only, during review) */}
      {isReviewer && reviewableStatuses.includes(proposal.status) && (
        <RecommendationForm proposalId={id!} onSubmitted={fetchData} />
      )}

      {/* Verdict Form (Chair only, at awaiting_decision) */}
      {isChair && proposal.status === 'awaiting_decision' && (
        <VerdictForm proposalId={id!} onSubmitted={fetchData} />
      )}

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Discussion ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3 rounded-md bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{comment.author_name}</span>
                {comment.recommendation && (
                  <Badge variant="default" className="text-[10px]">{
                    comment.recommendation === 'approve' ? 'Approved' :
                    comment.recommendation === 'approve_with_conditions' ? 'Approved with Conditions' :
                    comment.recommendation === 'needs_more_info' ? 'Needs More Info' :
                    comment.recommendation === 'reject' ? 'Rejected' :
                    comment.recommendation
                  }</Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{comment.body}</p>
            </div>
          ))}

          <Separator className="my-4" />

          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={postComment}>Post Comment</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
