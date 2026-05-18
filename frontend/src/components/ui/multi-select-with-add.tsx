import * as React from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface MultiSelectWithAddProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectWithAdd({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Type to add...',
  className,
}: MultiSelectWithAddProps) {
  const [customInput, setCustomInput] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomInput('');
    setShowInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
    if (e.key === 'Escape') {
      setShowInput(false);
      setCustomInput('');
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium">{label}</p>

      {/* Predefined options */}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Badge
            key={opt}
            variant={selected.includes(opt) ? 'default' : 'outline'}
            className="cursor-pointer select-none transition-colors"
            onClick={() => toggle(opt)}
          >
            {opt}
            {selected.includes(opt) && <X className="h-3 w-3 ml-1" />}
          </Badge>
        ))}

        {/* Custom added items (not in predefined list) */}
        {selected
          .filter((s) => !options.includes(s))
          .map((custom) => (
            <Badge
              key={custom}
              variant="default"
              className="cursor-pointer select-none"
              onClick={() => toggle(custom)}
            >
              {custom}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
      </div>

      {/* Add custom */}
      {showInput ? (
        <div className="flex gap-2 items-center">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-8 text-sm w-48"
            autoFocus
          />
          <Button type="button" size="sm" variant="outline" onClick={addCustom} className="h-8">
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => { setShowInput(false); setCustomInput(''); }}
            className="h-8"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() => setShowInput(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add other
        </Button>
      )}
    </div>
  );
}
