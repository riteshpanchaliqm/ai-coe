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
import { CommitteeDecisionPanel } from '../components/CommitteeDecisionPanel';
import { CompetencyLevelForm } from '../components/CompetencyLevelForm';
import { getStatusLabel } from '../lib/status';
import { User, Calendar, Building2, Clock, AlertCircle, MessageSquare, Send } from 'lucide-react';

interface Proposal {
  id: string; title: string; department: string; problem_statement: string;
  proposed_solution: string; expected_impact: string; current_status: string;
  urgency: string; urgency_reason: string; status: string;
  submitter_name: string; submitter_email: string; submitted_at: string;
  competency_level: number | null;
  building_type: string; ai_maturity_level: string; doc_link: string;
  other_details: string; where_stuck: string;
  tech_frontend: string[]; tech_backend: string[]; tech_database: string[];
  tech_ai_tools: string[]; tech_integrations: string[];
  support_needs?: { support_type: string; other_text: string | null }[];
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [proposalRes, commentsRes] = await Promise.all([
        api.get<{ proposal: Proposal; supportNeeds: any[] }>(`/proposals/${id}`),
        api.get<{ comments: Comment[] }>(`/comments?proposal_id=${id}`),
      ]);
      setProposal({ ...proposalRes.proposal, support_needs: proposalRes.supportNeeds });
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statusVariant = ['approved', 'approved_with_conditions', 'shipped'].includes(proposal.status) ? 'success' :
    ['rejected'].includes(proposal.status) ? 'destructive' :
    ['awaiting_decision', 'needs_clarification'].includes(proposal.status) ? 'warning' : 'info';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{proposal.title}</h1>
              <Badge variant={statusVariant}>{getStatusLabel(proposal.status)}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{proposal.submitter_name}</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{proposal.department}</span>
              {proposal.submitted_at && (
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(proposal.submitted_at).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardContent className="pt-6 pb-4">
          <StatusTimeline currentStatus={proposal.status} />
        </CardContent>
      </Card>

      {/* Reviewer Actions */}
      {isReviewer && (
        <StatusActions proposalId={id!} currentStatus={proposal.status} onStatusChanged={fetchData} />
      )}

      {/* Proposal Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Problem Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{proposal.problem_statement}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Proposed Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{proposal.proposed_solution}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Expected Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{proposal.expected_impact || '—'}</p>
            </CardContent>
          </Card>

          {proposal.other_details && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Other Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{proposal.other_details}</p>
              </CardContent>
            </Card>
          )}

          {proposal.where_stuck && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Where They're Stuck</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{proposal.where_stuck}</p>
              </CardContent>
            </Card>
          )}

          {proposal.support_needs && proposal.support_needs.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Support Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {proposal.support_needs.map((s) => (
                    <Badge key={s.support_type} variant="secondary">
                      {s.support_type}{s.other_text ? `: ${s.other_text}` : ''}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(proposal as any).building_type && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Building Type</p>
                  <p className="text-sm font-medium">
                    {proposal.building_type === 'tool_building' ? 'Tool Building with AI' :
                     proposal.building_type === 'workflow_automation' ? 'Workflow & Automation' :
                     'Other'}
                  </p>
                </div>
              )}
              {(proposal as any).building_type && <Separator />}
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Project Status</p>
                <p className="text-sm font-medium capitalize">
                  {proposal.current_status === 'nearly_complete' ? 'Nearly Complete' :
                   proposal.current_status === 'partial' ? 'Partially Built' :
                   proposal.current_status}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Timeline</p>
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {proposal.urgency === 'two_weeks' ? '2 Weeks' :
                   proposal.urgency === 'one_month' ? '1 Month' :
                   proposal.urgency === 'one_quarter' ? '1 Quarter' :
                   'No Deadline'}
                </p>
                {proposal.urgency_reason && (
                  <p className="text-xs text-muted-foreground mt-1">{proposal.urgency_reason}</p>
                )}
              </div>
              {proposal.ai_maturity_level && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">AI Maturity Level</p>
                    <p className="text-sm font-medium">{proposal.ai_maturity_level}</p>
                  </div>
                </>
              )}
              {proposal.competency_level !== null && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Competency Level (Committee)</p>
                    <Badge variant="default">L{proposal.competency_level}</Badge>
                  </div>
                </>
              )}
              {proposal.doc_link && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Document Link</p>
                    <a href={proposal.doc_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                      {proposal.doc_link}
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tech Stack */}
          {(proposal.tech_frontend?.length > 0 || proposal.tech_backend?.length > 0 || proposal.tech_database?.length > 0 || proposal.tech_ai_tools?.length > 0 || proposal.tech_integrations?.length > 0) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {proposal.tech_integrations?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Integrations</p>
                    <div className="flex flex-wrap gap-1">{proposal.tech_integrations.map((t) => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}</div>
                  </div>
                )}
                {proposal.tech_ai_tools?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">AI Tools</p>
                    <div className="flex flex-wrap gap-1">{proposal.tech_ai_tools.map((t) => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}</div>
                  </div>
                )}
                {proposal.tech_database?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Database</p>
                    <div className="flex flex-wrap gap-1">{proposal.tech_database.map((t) => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}</div>
                  </div>
                )}
                {proposal.tech_frontend?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Frontend</p>
                    <div className="flex flex-wrap gap-1">{proposal.tech_frontend.map((t) => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}</div>
                  </div>
                )}
                {proposal.tech_backend?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Backend</p>
                    <div className="flex flex-wrap gap-1">{proposal.tech_backend.map((t) => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Committee Decision Panel (in_review / awaiting_decision) */}
      {isReviewer && ['in_review', 'awaiting_decision'].includes(proposal.status) && (
        <CommitteeDecisionPanel
          proposalId={id!}
          proposalStatus={proposal.status}
          onUpdated={fetchData}
        />
      )}

      {/* Competency Level (reviewers/chair, on approved proposals) */}
      {isReviewer && ['approved', 'approved_with_conditions', 'shipped'].includes(proposal.status) && (
        <CompetencyLevelForm
          proposalId={id!}
          currentLevel={proposal.competency_level}
          onUpdated={fetchData}
        />
      )}

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Discussion ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No comments yet. Start the discussion below.</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-lg bg-muted/40 border border-border/50 transition-colors hover:bg-muted/60">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {comment.author_name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium">{comment.author_name}</span>
                {comment.recommendation && (
                  <Badge variant={
                    comment.recommendation === 'approve' ? 'success' :
                    comment.recommendation === 'reject' ? 'destructive' :
                    comment.recommendation === 'needs_more_info' ? 'warning' : 'default'
                  } className="text-[10px]">
                    {comment.recommendation === 'approve' ? 'Approved' :
                     comment.recommendation === 'approve_with_conditions' ? 'Approved with Conditions' :
                     comment.recommendation === 'needs_more_info' ? 'Needs More Info' :
                     comment.recommendation === 'reject' ? 'Rejected' :
                     comment.recommendation}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm pl-9 leading-relaxed">{comment.body}</p>
            </div>
          ))}

          <Separator className="my-4" />

          <div className="flex gap-3 items-start">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0 mt-1">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={postComment} disabled={!newComment.trim()} className="gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
