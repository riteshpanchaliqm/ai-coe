import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MultiSelectWithAdd } from '../components/ui/multi-select-with-add';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { GuidelinesSidebar } from '../components/GuidelinesSidebar';

const DEPARTMENTS = [
  'Tech', 'Finance', 'Sales', 'Marketing', 'Tech Support',
  'Customer Service', 'Legal', 'Product', 'AI Department',
];

const SUPPORT_TYPES = [
  'Idea validation', 'Feasibility check', 'Tool recommendations',
  'Prompt engineering', 'Hands-on pairing', 'MCP/API integration',
  'Demo prep', 'Troubleshooting', 'Other',
];

const FRONTEND_OPTIONS = ['React', 'Next.js', 'Svelte', 'Vue', 'Angular'];
const BACKEND_OPTIONS = ['Node.js', 'Express', 'FastAPI', 'Spring Boot', 'Go', 'Django', 'NestJS'];
const AI_TOOLS_OPTIONS = ['Kiro', 'Cursor', 'GitHub Copilot', 'Claude Code', 'ChatGPT', 'n8n', 'LangChain', 'Vercel AI SDK'];
const INTEGRATIONS_OPTIONS = ['Jira', 'Slack', 'Bitbucket', 'GitHub', 'Confluence', 'Google Calendar', 'Supabase', 'AWS'];
const DATABASE_OPTIONS = ['PostgreSQL', 'Supabase', 'AWS RDS', 'MongoDB', 'MySQL', 'Redis'];

interface FormData {
  title: string;
  department: string;
  problem_statement: string;
  proposed_solution: string;
  expected_impact: string;
  current_status: string;
  urgency: string;
  urgency_reason: string;
  support_needs: string[];
  support_other_text: string;
  where_stuck: string;
  tech_frontend: string[];
  tech_backend: string[];
  tech_database: string[];
  tech_ai_tools: string[];
  tech_integrations: string[];
  other_details: string;
}

export function SubmitPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    title: '', department: '', problem_statement: '', proposed_solution: '',
    expected_impact: '', current_status: '', urgency: '', urgency_reason: '',
    support_needs: [], support_other_text: '', where_stuck: '',
    tech_frontend: [], tech_backend: [], tech_database: [], tech_ai_tools: [], tech_integrations: [],
    other_details: '',
  });

  const updateField = useCallback((field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    // Check required fields are not empty
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (!form.department) errs.department = 'Required';
    if (!form.problem_statement.trim()) errs.problem_statement = 'Required';
    if (!form.proposed_solution.trim()) errs.proposed_solution = 'Required';
    if (!form.expected_impact.trim()) errs.expected_impact = 'Required';
    if (!form.current_status) errs.current_status = 'Required';
    if (!form.urgency) errs.urgency = 'Required';
    if (form.support_needs.length === 0) errs.support_needs = 'Required';

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/proposals', { ...form, submit: true });
      navigate('/my-proposals');
    } catch (err) {
      console.error('Submit failed:', err);
    }
    setSubmitting(false);
  };

  const toggleSupport = (type: string) => {
    setForm((prev) => ({
      ...prev,
      support_needs: prev.support_needs.includes(type)
        ? prev.support_needs.filter((t) => t !== type)
        : [...prev.support_needs, type],
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Submit Proposal</h1>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 space-y-6">

      {/* Section 1 */}
      <Card>
        <CardHeader><CardTitle className="text-base">1. Requester Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label>Your Name</Label>
            <Input value={user?.name || ''} disabled />
          </div>
          <div id="field-department">
            <Label>Department *</Label>
            <Select value={form.department} onValueChange={(val) => { updateField('department', val); setErrors((e) => ({ ...e, department: '' })); }}>
              <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-xs text-destructive mt-1">{errors.department}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Section 2 */}
      <Card>
        <CardHeader><CardTitle className="text-base">2. Project Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div id="field-title">
            <Label>Project Title * <span className="text-muted-foreground text-xs">({form.title.length}/50)</span></Label>
            <Input maxLength={50} value={form.title} onChange={(e) => { updateField('title', e.target.value); setErrors((er) => ({ ...er, title: '' })); }} className={errors.title ? 'border-destructive' : ''} />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
          </div>
          <div id="field-problem_statement">
            <Label>Problem Statement * <span className="text-muted-foreground text-xs">({form.problem_statement.length}/500)</span></Label>
            <Textarea maxLength={500} value={form.problem_statement} onChange={(e) => { updateField('problem_statement', e.target.value); setErrors((er) => ({ ...er, problem_statement: '' })); }} rows={3} className={errors.problem_statement ? 'border-destructive' : ''} />
            {errors.problem_statement && <p className="text-xs text-destructive mt-1">{errors.problem_statement}</p>}
          </div>
          <div id="field-proposed_solution">
            <Label>Proposed Solution * <span className="text-muted-foreground text-xs">({form.proposed_solution.length}/500)</span></Label>
            <Textarea maxLength={500} value={form.proposed_solution} onChange={(e) => { updateField('proposed_solution', e.target.value); setErrors((er) => ({ ...er, proposed_solution: '' })); }} rows={3} className={errors.proposed_solution ? 'border-destructive' : ''} />
            {errors.proposed_solution && <p className="text-xs text-destructive mt-1">{errors.proposed_solution}</p>}
          </div>
          <div id="field-expected_impact">
            <Label>Expected Impact * <span className="text-muted-foreground text-xs">({form.expected_impact.length}/300)</span></Label>
            <Textarea maxLength={300} value={form.expected_impact} onChange={(e) => { updateField('expected_impact', e.target.value); setErrors((er) => ({ ...er, expected_impact: '' })); }} rows={2} className={errors.expected_impact ? 'border-destructive' : ''} />
            {errors.expected_impact && <p className="text-xs text-destructive mt-1">{errors.expected_impact}</p>}
          </div>
          <div id="field-current_status">
            <Label>Current Status *</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                { value: 'idea', label: 'Idea' },
                { value: 'exploring', label: 'Exploring' },
                { value: 'partial', label: 'Partially Built' },
                { value: 'nearly_complete', label: 'Nearly Complete' },
                { value: 'stuck', label: 'Stuck' },
              ].map((s) => (
                <Button
                  key={s.value}
                  type="button"
                  variant={form.current_status === s.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { updateField('current_status', s.value); setErrors((er) => ({ ...er, current_status: '' })); }}
                >
                  {s.label}
                </Button>
              ))}
            </div>
            {errors.current_status && <p className="text-xs text-destructive mt-1">{errors.current_status}</p>}
          </div>
          <div id="field-urgency">
            <Label>Timeline / Urgency *</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                { value: 'two_weeks', label: '2 Weeks' },
                { value: 'one_month', label: '1 Month' },
                { value: 'one_quarter', label: '1 Quarter' },
                { value: 'no_deadline', label: 'No Deadline' },
              ].map((u) => (
                <Button
                  key={u.value}
                  type="button"
                  variant={form.urgency === u.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { updateField('urgency', u.value); setErrors((er) => ({ ...er, urgency: '' })); }}
                >
                  {u.label}
                </Button>
              ))}
            </div>
            {errors.urgency && <p className="text-xs text-destructive mt-1">{errors.urgency}</p>}
          </div>
          {form.urgency === 'two_weeks' && (
            <div>
              <Label>Urgency Reason</Label>
              <Input value={form.urgency_reason} onChange={(e) => updateField('urgency_reason', e.target.value)} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Tech Stack */}
      <Card>
        <CardHeader><CardTitle className="text-base">3. Tech Stack</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <MultiSelectWithAdd
            label="Frontend"
            options={FRONTEND_OPTIONS}
            selected={form.tech_frontend}
            onChange={(val) => updateField('tech_frontend', val)}
            placeholder="Add frontend tech..."
          />
          <MultiSelectWithAdd
            label="Backend"
            options={BACKEND_OPTIONS}
            selected={form.tech_backend}
            onChange={(val) => updateField('tech_backend', val)}
            placeholder="Add backend tech..."
          />
          <MultiSelectWithAdd
            label="Database"
            options={DATABASE_OPTIONS}
            selected={form.tech_database}
            onChange={(val) => updateField('tech_database', val)}
            placeholder="Add database..."
          />
          <MultiSelectWithAdd
            label="AI Tools"
            options={AI_TOOLS_OPTIONS}
            selected={form.tech_ai_tools}
            onChange={(val) => updateField('tech_ai_tools', val)}
            placeholder="Add AI tool..."
          />
          <MultiSelectWithAdd
            label="Integrations"
            options={INTEGRATIONS_OPTIONS}
            selected={form.tech_integrations}
            onChange={(val) => updateField('tech_integrations', val)}
            placeholder="Add integration..."
          />
        </CardContent>
      </Card>

      {/* Section 4 */}
      <Card>
        <CardHeader><CardTitle className="text-base">4. Support Needed</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div id="field-support_needs">
            <Label>What support do you need? *</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {SUPPORT_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.support_needs.includes(type)}
                    onChange={() => { toggleSupport(type); setErrors((er) => ({ ...er, support_needs: '' })); }}
                    className="rounded border-input"
                  />
                  {type}
                </label>
              ))}
            </div>
            {errors.support_needs && <p className="text-xs text-destructive mt-1">{errors.support_needs}</p>}
          </div>
          {form.support_needs.includes('Other') && (
            <div>
              <Label>Other (specify)</Label>
              <Input value={form.support_other_text} onChange={(e) => updateField('support_other_text', e.target.value)} />
            </div>
          )}
          <div>
            <Label>Where you're stuck (optional) <span className="text-muted-foreground text-xs">({form.where_stuck.length}/300)</span></Label>
            <Textarea maxLength={300} value={form.where_stuck} onChange={(e) => updateField('where_stuck', e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Other Details */}
      <Card>
        <CardHeader><CardTitle className="text-base">5. Any Other Details</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any additional context, links, references, or notes that might help the committee review your proposal..."
            value={form.other_details}
            onChange={(e) => updateField('other_details', e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">Optional</p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Proposal'}
        </Button>
      </div>
    </div>

      {/* Guidelines Sidebar */}
      <GuidelinesSidebar />
      </div>
    </div>
  );
}
