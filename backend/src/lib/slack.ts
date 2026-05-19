import { config } from '../config';

const SLACK_API = 'https://slack.com/api';

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: any[];
  accessory?: any;
  fields?: any[];
}

/**
 * Post a message to a Slack channel.
 */
export async function postToChannel(channel: string, text: string, blocks?: SlackBlock[]) {
  if (!config.slackBotToken) {
    console.warn('[slack] No bot token configured, skipping notification');
    return;
  }

  const res = await fetch(`${SLACK_API}/chat.postMessage`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.slackBotToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel, text, blocks }),
  });

  const data: any = await res.json();
  if (!data.ok) {
    console.error('[slack] Failed to post message:', data.error);
  }
  return data;
}

/**
 * Send a DM to a user by their email.
 */
export async function sendDM(email: string, text: string, blocks?: SlackBlock[]) {
  if (!config.slackBotToken) return;

  // Look up user by email
  const lookupRes = await fetch(`${SLACK_API}/users.lookupByEmail?email=${encodeURIComponent(email)}`, {
    headers: { 'Authorization': `Bearer ${config.slackBotToken}` },
  });
  const lookupData: any = await lookupRes.json();
  if (!lookupData.ok) {
    console.error('[slack] User lookup failed for', email, lookupData.error);
    return;
  }

  const userId = lookupData.user.id;

  // Open DM channel
  const openRes = await fetch(`${SLACK_API}/conversations.open`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.slackBotToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ users: userId }),
  });
  const openData: any = await openRes.json();
  if (!openData.ok) {
    console.error('[slack] Failed to open DM:', openData.error);
    return;
  }

  // Send message
  await postToChannel(openData.channel.id, text, blocks);
}

/**
 * Notify: New proposal submitted
 */
export async function notifyNewProposal(proposal: { title: string; department: string; submitter_name: string; id: string }) {
  const portalUrl = 'https://aicoe.iqm.services';

  await postToChannel(config.slackChannelAiCoe, `New proposal submitted: *${proposal.title}*`, [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🆕 *New AI Proposal Submitted*\n\n*${proposal.title}*\nFrom: ${proposal.submitter_name} · ${proposal.department}`,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'View Proposal', emoji: true },
          url: `${portalUrl}/proposals/${proposal.id}`,
          action_id: 'view_proposal',
        },
      ],
    },
  ]);
}

/**
 * Notify: Verdict posted
 */
export async function notifyVerdict(proposal: { title: string; id: string; submitter_email: string }, decision: string, chairName: string) {
  const portalUrl = 'https://aicoe.iqm.services';
  const decisionLabel = decision === 'approved' ? '✅ Approved' :
    decision === 'approved_with_conditions' ? '⚠️ Approved with Conditions' :
    decision === 'parked' ? '⏸️ Parked' : '❌ Rejected';

  // Post to channel
  await postToChannel(config.slackChannelAiCoe, `Verdict: ${proposal.title} — ${decisionLabel}`, [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `📋 *Final Verdict Posted*\n\n*${proposal.title}*\nDecision: ${decisionLabel}\nBy: ${chairName}`,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'View Details', emoji: true },
          url: `${portalUrl}/proposals/${proposal.id}`,
          action_id: 'view_verdict',
        },
      ],
    },
  ]);

  // DM submitter
  await sendDM(proposal.submitter_email, `Your proposal *${proposal.title}* has received a verdict: ${decisionLabel}. <${portalUrl}/proposals/${proposal.id}|View details>`);
}

/**
 * Notify: Status change (triage, etc.)
 */
export async function notifyStatusChange(proposal: { title: string; id: string; submitter_email: string }, newStatus: string) {
  const portalUrl = 'https://aicoe.iqm.services';
  const statusLabels: Record<string, string> = {
    under_triage: 'Under Triage',
    in_review: 'In Review',
    awaiting_decision: 'Awaiting Decision',
    needs_clarification: 'Needs Clarification — please provide more info',
  };

  const label = statusLabels[newStatus];
  if (!label) return;

  await sendDM(
    proposal.submitter_email,
    `Your proposal *${proposal.title}* status updated to: *${label}*. <${portalUrl}/proposals/${proposal.id}|View proposal>`
  );
}
