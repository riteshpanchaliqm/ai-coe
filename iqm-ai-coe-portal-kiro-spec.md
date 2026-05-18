# IQM AI CoE Proposal Portal — Build Spec

> **For Kiro:** This is the full specification for an internal portal at IQM. Read it end-to-end before scaffolding. Build incrementally per the phased rollout in §13. Generate steering files, hooks, and specs as needed — but the source of truth for product decisions is this document.

---

## 1. Context & Mission

IQM (programmatic advertising tech, US + India, ~140 people scaling to 500+) is standing up an **AI Center of Excellence (CoE) Committee** to govern the explosion of AI tooling and projects across the company. Today, AI ideas surface in Slack threads, decks, and 1:1s with no central record or consistent evaluation.

**Mission:** Build a single internal portal where any IQM employee can submit AI proposals, the full committee reviews them with structured feedback, and outcomes are tracked end-to-end. Slack is the notification surface — the portal is the system of record.

---

## 2. Users & Roles

| Role | Description | Capabilities |
|---|---|---|
| **Submitter** | Any @iqm.com employee | Submit, edit own drafts, view own proposals, raise support tickets, log outcomes |
| **Reviewer** | Member of the AI CoE Committee. The **entire committee reviews every proposal** — there is no selective assignment. | Comment, post recommendation, view all proposals |
| **Chair** | Committee lead; one person holds this role | All Reviewer powers + post final verdict, lock proposals |
| **Admin** | Portal owner | Manage members/roles, upload guidelines, configure Slack channels, run analytics |

**One user can hold multiple roles.** Chair is also a Reviewer. Admin can be a Reviewer.

---

## 3. Auth & Access

- **Provider:** Supabase Auth with Google OAuth
- **Domain restriction:** Only `@iqm.com` emails allowed. Reject all others at the auth callback. Show a clean "IQM employees only" message — do not auto-create the user.
- **Session:** Standard Supabase JWT, refresh on activity
- **RLS:** Every table has Row-Level Security policies. No service-role queries from the client.

---

## 4. End-to-End Workflow

```
Submit → Triage (48h SLA) → [Schedule meeting if needed] → Committee Review → Final Verdict → [Support / Outcome]
```

### Stages

| Stage | Status Value | Description |
|---|---|---|
| 0 | `draft` | Submitter saved but didn't submit |
| 1 | `submitted` | New proposal, awaiting triage |
| 2 | `under_triage` | One committee member is screening |
| 2a | `needs_clarification` | Returned to submitter for more info |
| 3 | `meeting_scheduled` | Discussion scheduled with submitter |
| 4 | `in_review` | Committee actively commenting |
| 5 | `awaiting_decision` | All committee members have commented; Chair to post verdict |
| 6a | `approved` | Verdict posted: approved |
| 6b | `approved_with_conditions` | Verdict posted: approved if conditions met |
| 6c | `parked` | Interesting, revisit later |
| 6d | `rejected` | Verdict posted: rejected |
| 7 | `shipped` | Submitter logged outcome |

**Critical rule for §5 (Final Verdict):** The Chair **cannot** post a verdict until **every active committee member has posted both a comment and a recommendation**. Enforce in DB (CHECK constraint or trigger) and in UI (button disabled with tooltip listing missing reviewers).

---

## 5. Intake Form Specification

Three sections. Autosave every 5 seconds. Submitters can save as draft and return.

### Section 1 — Requester Information
| Field | Type | Required | Notes |
|---|---|---|---|
| Your Name | Auto from SSO (editable) | Yes | Pre-fill from Google profile |
| Your Department | Dropdown | Yes | Tech, Finance, Sales, Marketing, Tech Support, Customer Service, Legal, Product, AI Department |

> Manager field intentionally removed.

### Section 2 — Project Information
| Field | Type | Required | Validation / Hint |
|---|---|---|---|
| Project Title | Text (50 char) | Yes | Short, descriptive |
| Problem Statement | Textarea (500 char) | Yes | Concrete pain point with numbers. Show good vs poor examples inline. |
| Proposed AI Solution | Textarea (500 char) | Yes | How AI helps. Inline example. |
| Expected Impact | Textarea (300 char) | Yes | Metric-driven success criteria |
| Current Status | Radio | Yes | Idea / Exploring / Partially built / Nearly complete / Stuck |
| Timeline / Urgency | Radio | Yes | 2 weeks / 1 month / 1 quarter / No deadline |
| Urgency Reason | Text | Conditional | Required only if "2 weeks" is selected |

### Section 3 — Support Needed
| Field | Type | Required | Notes |
|---|---|---|---|
| Support Types | Multi-select checkboxes | Yes | Idea validation, Feasibility check, Tool recommendations, Prompt engineering, Hands-on pairing, MCP/API integration, Demo prep, Troubleshooting, Other |
| Other (specify) | Text | Conditional | Shown if "Other" selected |
| Where you're stuck | Textarea (300 char) | No | Optional |

### Form behaviors
- Real-time character counts
- Inline good/poor examples (placeholder + help text)
- Duplicate detector: as user types Title + Problem Statement, surface top-3 similar past proposals (pgvector semantic search)
- **Guidelines panel** (collapsible sidebar): show the active IQM project-start guidelines fetched from the in-portal guidelines store; key checkpoints rendered inline above the submit button as a checklist preview (read-only, informational)

---

## 6. Committee Review Model

### 6.1 Comments
- **Threaded feed**, not rigid "Reviewer 1/2/3" slots
- Any reviewer can post any number of comments
- Each comment: author, role badge, timestamp, body, optional `recommendation` tag
- Submitter can reply to comments
- `@mentions` trigger Slack DM to the mentioned user

### 6.2 Reviewer Recommendation (every member, required)
Each committee member must post **at least one recommendation** before the Chair can finalize. Recommendation values:

| Recommendation | Required Field |
|---|---|
| Approve | Short rationale (optional) |
| Approve with Conditions | Conditions list (required) |
| Needs More Info | Specific questions (required) |
| Reject | Reason (required) |

A reviewer may **update** their recommendation as discussion evolves — only the latest counts.

### 6.3 Final Verdict (Chair only)
- Posted via a dedicated "Post Final Verdict" action
- Requires: decision enum + rationale (required) + conditions list (if conditional approval)
- **Locks the proposal**: all reviewer comments become read-only; submitter cannot edit
- Broadcasts to Slack #ai-coe channel + DMs submitter

---

## 7. Slack Integration

### 7.1 Notification matrix

| Event | #ai-coe channel | DM |
|---|---|---|
| New proposal submitted | ✅ Summary card | ✅ Submitter (confirmation) |
| Triage routing decision | — | ✅ Submitter |
| Meeting scheduled | ✅ Calendar block | ✅ Submitter + committee |
| Reviewer @mention | — | ✅ Mentioned user |
| Final verdict posted | ✅ Verdict card | ✅ Submitter |
| Support ticket raised | — | ✅ Assigned support member |
| Outcome / shipped | ✅ Celebration card | — |
| **Stale proposal reminder** (see 7.2) | ✅ Reminder card | — |

### 7.2 Stale proposal reminder (KEY REQUIREMENT)
**Trigger:** A proposal has been in `submitted` status for **≥ 7 days** with no triage action.

**Cadence:**
- First reminder: 7 days after submission
- **Repeat: every 3 days** until status moves out of `submitted`
- Posts to **#ai-coe channel** (not DM) so the whole committee sees it
- Card includes: submitter name, title, days waiting, link to proposal, "Triage now" button

**Implementation:** Supabase scheduled Edge Function (pg_cron, runs daily at 9 AM IST). Query proposals where `status='submitted' AND now() - submitted_at >= 7 days AND (last_reminder_at IS NULL OR now() - last_reminder_at >= 3 days)`. Post to Slack, update `last_reminder_at`.

### 7.3 Other notification rules
- Channel posts = awareness (read-only updates)
- DMs = action required (always include a link + CTA)
- Users can configure notification preferences in `/settings`
- Email fallback (Resend) for any user who opts out of Slack

---

## 8. AI-Assisted Initial Review (KEY REQUIREMENT)

The portal uses **IQM's skill files** (maintained internally) to produce an AI-generated initial review of each incoming proposal. This helps the committee come into review with a baseline analysis.

### 8.1 When it runs
- **Auto on submission:** Triggered automatically when a proposal transitions to `submitted`. AI analysis appears as a pinned card at the top of the proposal detail page, labeled "AI Initial Review — generated [timestamp]".
- **On-demand re-run:** Any reviewer can click "Re-run AI review" on the proposal detail page. Previous AI reviews are versioned and kept in history.

### 8.2 What it produces
The AI review should be structured (not free prose) and include:
- **Summary** (2-3 sentences): what is being proposed
- **Strengths**: bullet list of what looks strong
- **Concerns / Risks**: bullet list of red flags or open questions
- **Feasibility assessment**: Low / Medium / High with rationale
- **Similar past proposals**: links to top 3 (via pgvector)
- **Suggested questions for committee**: 3-5 questions to ask the submitter
- **Alignment with IQM guidelines**: which guideline checkpoints this proposal meets or misses (pulled from the in-portal guidelines store)

### 8.3 Implementation
- Triggered via Supabase Edge Function → IQM MCP server
- MCP server applies the IQM-maintained skill files for proposal review
- Result stored in `ai_reviews` table (versioned)
- Each AI review is **clearly badged** as AI-generated — committee humans make the final call

### 8.4 Guard-rails
- AI review is **advisory only** — it does NOT count as a reviewer recommendation
- Committee members must still post their own comments and recommendations
- Failures (MCP timeout, etc.) do not block submission; show "AI review unavailable, retry" state

---

## 9. IQM Project-Start Guidelines (KEY REQUIREMENT)

Guidelines live **inside the portal**, uploaded and maintained by Admin.

### 9.1 Structure
A guidelines document is a structured record, not a free-text blob:
- **Version** (semver, e.g., v1.2.0)
- **Effective from** date
- **Sections** with titles + body (markdown)
- **Checkpoints**: discrete checklist items the proposal should address (e.g., "Has a clear success metric", "Identifies data sources", "Addresses privacy implications")

### 9.2 Admin operations
- `/admin/guidelines` page
- Create new version (markdown editor with preview)
- Set "active" version — only one active at a time
- Previous versions stay visible/archived
- Can edit checkpoints inline

### 9.3 Where guidelines surface
1. **At submission:** sidebar panel on `/submit`, showing the active version with key checkpoints highlighted above the submit button
2. **In review:** sidebar panel on proposal detail page, so reviewers reference the same guidelines while commenting
3. **In AI initial review:** the active guidelines are part of the context passed to the MCP-based review, so the AI assessment includes alignment notes

---

## 10. Data Model (Supabase / Postgres)

### 10.1 Core tables

```sql
-- USERS (synced from Supabase Auth)
users (
  id uuid pk,
  email text unique check (email like '%@iqm.com'),
  name text,
  department text,
  avatar_url text,
  notification_pref jsonb default '{"slack": true, "email": false}',
  created_at timestamptz default now()
)

-- ROLES (many-to-many; user can have multiple)
user_roles (
  user_id uuid references users,
  role text check (role in ('submitter', 'reviewer', 'chair', 'admin')),
  granted_at timestamptz default now(),
  granted_by uuid references users,
  primary key (user_id, role)
)

-- PROPOSALS
proposals (
  id uuid pk default gen_random_uuid(),
  submitter_id uuid references users not null,
  title text not null check (length(title) <= 50),
  department text not null,
  problem_statement text not null check (length(problem_statement) <= 500),
  proposed_solution text not null check (length(proposed_solution) <= 500),
  expected_impact text not null check (length(expected_impact) <= 300),
  current_status text check (current_status in ('idea', 'exploring', 'partial', 'nearly_complete', 'stuck')),
  urgency text check (urgency in ('two_weeks', 'one_month', 'one_quarter', 'no_deadline')),
  urgency_reason text,
  status text not null default 'draft',
  guidelines_version text,  -- which guidelines version was active at submit
  submitted_at timestamptz,
  last_reminder_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

-- SUPPORT NEEDS (multi-select)
proposal_support_needs (
  proposal_id uuid references proposals on delete cascade,
  support_type text,
  other_text text,
  primary key (proposal_id, support_type)
)

-- COMMENTS (threaded feed)
comments (
  id uuid pk default gen_random_uuid(),
  proposal_id uuid references proposals on delete cascade,
  author_id uuid references users,
  parent_comment_id uuid references comments,
  body text not null,
  recommendation text check (recommendation in (null, 'approve', 'approve_with_conditions', 'needs_more_info', 'reject')),
  conditions text,
  created_at timestamptz default now(),
  updated_at timestamptz
)

-- LATEST RECOMMENDATION VIEW (for quorum check)
-- Only the most recent recommendation per (proposal, reviewer) counts
create view latest_recommendations as
select distinct on (proposal_id, author_id)
  proposal_id, author_id, recommendation, created_at
from comments
where recommendation is not null
order by proposal_id, author_id, created_at desc;

-- MEETINGS
meetings (
  id uuid pk default gen_random_uuid(),
  proposal_id uuid references proposals,
  scheduled_at timestamptz not null,
  duration_min int default 30,
  google_event_id text,
  attendees jsonb,
  created_by uuid references users,
  created_at timestamptz default now()
)

-- VERDICTS (one per proposal)
verdicts (
  id uuid pk default gen_random_uuid(),
  proposal_id uuid references proposals unique,
  chair_id uuid references users,
  decision text check (decision in ('approved', 'approved_with_conditions', 'parked', 'rejected')),
  rationale text not null,
  conditions text,
  decided_at timestamptz default now()
)

-- AI REVIEWS (versioned)
ai_reviews (
  id uuid pk default gen_random_uuid(),
  proposal_id uuid references proposals on delete cascade,
  version int not null,
  summary text,
  strengths jsonb,         -- array of strings
  concerns jsonb,          -- array of strings
  feasibility text check (feasibility in ('low', 'medium', 'high')),
  feasibility_rationale text,
  similar_proposals jsonb, -- array of {id, title, similarity}
  suggested_questions jsonb,
  guideline_alignment jsonb, -- {checkpoint_id: 'met'|'missed'|'unclear'}
  generated_at timestamptz default now(),
  generated_by text default 'mcp:iqm-skill:proposal-review'
)

-- SUPPORT TICKETS
support_tickets (
  id uuid pk default gen_random_uuid(),
  proposal_id uuid references proposals,
  type text,
  description text,
  status text default 'open',
  assigned_to uuid references users,
  created_at timestamptz default now(),
  resolved_at timestamptz
)

-- OUTCOMES
outcomes (
  id uuid pk default gen_random_uuid(),
  proposal_id uuid references proposals unique,
  shipped_at timestamptz,
  metrics jsonb,
  notes text,
  logged_by uuid references users,
  logged_at timestamptz default now()
)

-- GUIDELINES
guidelines (
  id uuid pk default gen_random_uuid(),
  version text not null unique,
  effective_from date not null,
  sections jsonb,    -- [{title, body_markdown}]
  checkpoints jsonb, -- [{id, label, description}]
  is_active boolean default false,
  created_by uuid references users,
  created_at timestamptz default now()
)
create unique index one_active_guideline on guidelines (is_active) where is_active = true;

-- ACTIVITY LOG (append-only)
activity_log (
  id uuid pk default gen_random_uuid(),
  proposal_id uuid references proposals,
  actor_id uuid references users,
  action text not null,
  payload jsonb,
  created_at timestamptz default now()
)

-- EMBEDDINGS (for duplicate detection)
proposal_embeddings (
  proposal_id uuid references proposals on delete cascade,
  embedding vector(1536),
  text_source text,
  generated_at timestamptz default now(),
  primary key (proposal_id)
)
```

### 10.2 Key constraints / triggers

```sql
-- Block verdict insertion unless every active reviewer has a recommendation
create or replace function check_full_quorum() returns trigger as $$
declare
  reviewer_count int;
  recommendation_count int;
begin
  select count(*) into reviewer_count
    from user_roles where role = 'reviewer';

  select count(distinct author_id) into recommendation_count
    from latest_recommendations
    where proposal_id = new.proposal_id
      and author_id in (select user_id from user_roles where role = 'reviewer');

  if recommendation_count < reviewer_count then
    raise exception 'Quorum not met: % of % reviewers have posted recommendations',
      recommendation_count, reviewer_count;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger enforce_quorum_before_verdict
  before insert on verdicts
  for each row execute function check_full_quorum();
```

### 10.3 RLS policies (sketch)

- **SELECT proposals**: any authenticated `@iqm.com` user (transparency by default)
- **INSERT proposals**: any authenticated user, with `submitter_id = auth.uid()`
- **UPDATE proposals**: only the submitter, only when status in (`draft`, `needs_clarification`)
- **INSERT comments**: submitter (on own proposal) OR any reviewer
- **INSERT verdicts**: only users with role `chair`
- **All admin tables**: only `admin` role
- **activity_log**: INSERT only via triggers; no UPDATE/DELETE policy

---

## 11. Tech Stack

| Layer | Tech | Notes |
|---|---|---|
| Frontend | React + IQM FE Library | Reuse existing IQM design system (roadmap.iqm.services pattern) |
| State machine | XState | Encode the workflow in §4 once, reuse in UI + backend |
| Auth | Supabase Auth (Google OAuth) | `@iqm.com` domain restriction |
| Database | Supabase Postgres | RLS, pg_cron, pgvector extensions |
| Realtime | Supabase Realtime | Live comment threads, status updates |
| Storage | Supabase Storage | Optional file attachments on proposals |
| Edge Functions | Supabase Edge Functions (Deno) | Slack bot, calendar, reminders, AI orchestration |
| Slack | Slack Bolt SDK | Bot user; events via webhooks |
| Calendar | Google Calendar API | Reuse OAuth tokens from SSO |
| AI orchestration | IQM MCP server | Calls skill files for proposal review |
| Embeddings | OpenAI text-embedding-3-small (or local via MCP) | For duplicate detection |
| Scheduled jobs | pg_cron + Edge Function | Stale proposal reminders |
| Email fallback | Resend | For users opting out of Slack |
| Hosting | Vercel (FE) + Supabase (BE) | Matches existing IQM portal pattern |
| Observability | Sentry + Supabase logs | |

---

## 12. Page Inventory

| Route | Purpose |
|---|---|
| `/` | Landing — submit CTA, recent approved proposals as social proof |
| `/login` | Google SSO (single button) |
| `/submit` | 3-section intake form with autosave + guidelines sidebar |
| `/proposals` | List view, filterable by department / status / decision |
| `/proposals/:id` | Detail: full proposal + AI initial review card + threaded comments + status timeline |
| `/my-proposals` | Submitter dashboard |
| `/review` | Reviewer queue: filters for "needs my recommendation", "stale", urgency |
| `/support/:proposalId` | Support ticket creation/list for approved proposals |
| `/admin/members` | Manage roles |
| `/admin/guidelines` | Upload/edit guidelines, set active version |
| `/admin/slack` | Channel configuration |
| `/admin/analytics` | Submission volume, time-to-decision, ship rate |
| `/settings` | Personal notification preferences |

---

## 13. Phased Rollout

### Phase 1 — MVP (Weeks 1-4)
- Google SSO with `@iqm.com` restriction
- Submission form (without duplicate detection)
- Proposal list + detail page
- Threaded comments + reviewer recommendations
- Final verdict with 100% quorum enforcement
- Slack: new submission + final verdict notifications
- Admin: member management
- Admin: guidelines CRUD

### Phase 2 — Workflow polish (Weeks 5-6)
- Triage routing step
- Google Calendar scheduling
- Duplicate detection (pgvector + embeddings)
- Real-time updates via Supabase Realtime
- **Stale reminder Edge Function** (every-3-days cadence)
- Inline guideline checkpoints on submit form

### Phase 3 — AI + Support + Outcomes (Weeks 7-8)
- **AI initial review** (auto on submit + re-run button)
- Support ticket system
- Outcome reporting form
- Analytics dashboard
- Email fallback notifications

---

## 14. Success Metrics (3 months post-launch)

| Metric | Target |
|---|---|
| Proposals submitted | ≥ 40 |
| Median time: submission → triage | < 48 hours |
| Median time: submission → final verdict | < 14 days |
| Proposals receiving full committee comments | 100% |
| Approved proposals shipped | ≥ 50% |
| Submitter satisfaction (post-decision survey) | ≥ 4.0 / 5.0 |
| Slack opt-out rate | < 10% |
| Stale reminder volume (signal of process health) | trending down month-over-month |

---

## 15. Build Guidance for Kiro

### Steering files to generate
- `.kiro/steering/product.md` — distill §1, §2, §3 of this doc
- `.kiro/steering/tech.md` — distill §11
- `.kiro/steering/structure.md` — proposed folder layout (suggest: `src/features/{auth, proposals, review, support, admin}`, `src/lib/{supabase, slack, mcp}`, `supabase/{migrations, functions}`)

### Specs to create (in order)
1. `auth-google-sso-iqm-domain`
2. `proposal-submission-form`
3. `proposal-list-and-detail`
4. `committee-comments-and-recommendations`
5. `final-verdict-with-quorum`
6. `slack-notifications-core`
7. `admin-member-management`
8. `admin-guidelines-management`
9. `stale-reminder-edge-function`
10. `ai-initial-review-mcp-integration`
11. `duplicate-detection-pgvector`
12. `support-tickets`
13. `outcome-tracking`
14. `analytics-dashboard`

### Agent hooks to consider
- On migration file save → auto-run `supabase db diff` and update types
- On Edge Function save → auto-deploy to local Supabase
- On commit → run typecheck + lint

### Hard constraints to enforce in every spec
1. All emails restricted to `@iqm.com`
2. Verdict requires 100% reviewer recommendation quorum (enforce in DB **and** UI)
3. RLS policies on every table — no exceptions
4. AI initial review is **advisory only**; never replaces human recommendation
5. Stale reminder fires every 3 days after day 7, posts to #ai-coe channel
6. Only one guideline version is active at a time

---

## 16. Open Questions (defer; not blocking Phase 1)

1. Should non-IQM contractors with `@iqm.com` email be allowed?
2. How long do "Parked" proposals stay before auto-archive?
3. Public scoring rubric (impact × feasibility × strategic fit) — yes or no?
4. Should the portal host the AI Committee's playbook, or link out to Confluence?
5. India + US timezone handling for the daily reminder cron — pick one or both?

---

*End of spec. Last updated: May 15, 2026. Owner: Ritesh — Product & Engineering, IQM.*
