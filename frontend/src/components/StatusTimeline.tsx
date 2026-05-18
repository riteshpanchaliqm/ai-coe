import { cn } from '../lib/utils';
import { Check, Circle, Clock, AlertCircle, XCircle, Rocket } from 'lucide-react';

const STAGES = [
  { value: 'draft', label: 'Draft', step: 0 },
  { value: 'submitted', label: 'Submitted', step: 1 },
  { value: 'under_triage', label: 'Under Triage', step: 2 },
  { value: 'needs_clarification', label: 'Needs Clarification', step: 2 },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled', step: 3 },
  { value: 'in_review', label: 'In Review', step: 4 },
  { value: 'awaiting_decision', label: 'Awaiting Decision', step: 5 },
  { value: 'approved', label: 'Approved', step: 6 },
  { value: 'approved_with_conditions', label: 'Approved w/ Conditions', step: 6 },
  { value: 'parked', label: 'Parked', step: 6 },
  { value: 'rejected', label: 'Rejected', step: 6 },
  { value: 'shipped', label: 'Shipped', step: 7 },
];

const MAIN_STAGES = [
  { step: 0, label: 'Draft', icon: Circle },
  { step: 1, label: 'Submitted', icon: Clock },
  { step: 2, label: 'Triage', icon: AlertCircle },
  { step: 3, label: 'Meeting', icon: Circle },
  { step: 4, label: 'Review', icon: Circle },
  { step: 5, label: 'Decision', icon: Clock },
  { step: 6, label: 'Verdict', icon: Check },
  { step: 7, label: 'Shipped', icon: Rocket },
];

function getStepForStatus(status: string): number {
  return STAGES.find((s) => s.value === status)?.step ?? 0;
}

function isTerminalNegative(status: string): boolean {
  return ['rejected', 'parked'].includes(status);
}

export function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const currentStep = getStepForStatus(currentStatus);
  const isNegative = isTerminalNegative(currentStatus);

  return (
    <div className="py-4">
      <div className="flex items-center">
        {MAIN_STAGES.map((stage, idx) => {
          const isCompleted = stage.step < currentStep;
          const isCurrent = stage.step === currentStep;
          const Icon = stage.icon;

          return (
            <div key={stage.step} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted && 'bg-primary border-primary text-white',
                    isCurrent && !isNegative && 'border-primary bg-primary/10 text-primary',
                    isCurrent && isNegative && 'border-destructive bg-destructive/10 text-destructive',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground/50'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isCurrent && isNegative ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1.5 font-medium text-center whitespace-nowrap',
                    isCompleted && 'text-primary',
                    isCurrent && !isNegative && 'text-primary font-semibold',
                    isCurrent && isNegative && 'text-destructive font-semibold',
                    !isCompleted && !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < MAIN_STAGES.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 mt-[-14px]',
                    stage.step < currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
