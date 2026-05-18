export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_triage: 'Under Triage',
  needs_clarification: 'Needs Clarification',
  meeting_scheduled: 'Meeting Scheduled',
  in_review: 'In Review',
  awaiting_decision: 'Awaiting Decision',
  approved: 'Approved',
  approved_with_conditions: 'Approved with Conditions',
  parked: 'Parked',
  rejected: 'Rejected',
  shipped: 'Shipped',
};

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}
