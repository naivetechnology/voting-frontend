import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

// Update the interface to accept an array of objects with id and name
interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  emptyMessage?: string;
  onChange?: (values: string[]) => void;
  defaultValues?: string[];
  className?: string;
  badgeClassName?: string;
}

export function MultiSelect({
  options,
  placeholder = 'Select items',
  emptyMessage = 'No items found.',
  onChange,
  defaultValues = [],
  className,
  badgeClassName,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(defaultValues);
  const [inputValue, setInputValue] = React.useState('');

  const handleSelect = React.useCallback(
    (id: string) => {
      setSelected((current) => {
        const newValues = current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id];

        onChange?.(newValues);
        return newValues;
      });
    },
    [onChange]
  );

  const handleRemove = React.useCallback(
    (id: string) => {
      setSelected((current) => {
        const newValues = current.filter((item) => item !== id);
        onChange?.(newValues);
        return newValues;
      });
    },
    [onChange]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Backspace' && !inputValue && selected.length > 0) {
        handleRemove(selected[selected.length - 1]);
      }
    },
    [inputValue, selected, handleRemove]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className='flex flex-wrap gap-1.5 mr-2'>
            {selected.length === 0 && (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
            {selected.map((id) => {
              const option = options.find((opt) => opt.id === id);
              return option ? (
                <Badge
                  key={id}
                  variant='secondary'
                  className={cn('px-2 py-0.5', badgeClassName)}
                >
                  {option.name}
                  <button
                    className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleRemove(id)}
                  >
                    <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                    <span className='sr-only'>Remove {option.name}</span>
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Search...'
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
            className='h-9'
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className='max-h-64 overflow-auto'>
              {options
                .filter((option) =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((option) => {
                  const isSelected = selected.includes(option.id);
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={() => handleSelect(option.id)}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50'
                        )}
                      >
                        {isSelected && <Check className='h-3 w-3' />}
                      </div>
                      {option.name}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
