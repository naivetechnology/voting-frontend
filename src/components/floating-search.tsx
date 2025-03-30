import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function FloatingSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  // Focus the input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isExpanded]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center transition-all duration-300 ease-in-out',
        isExpanded ? 'w-[300px] md:w-[400px]' : 'w-auto'
      )}
    >
      <div
        className={cn(
          'flex items-center w-full overflow-hidden transition-all duration-300 rounded-full shadow-lg bg-background border',
          isExpanded ? 'pr-2' : ''
        )}
      >
        {isExpanded && (
          <Input
            ref={inputRef}
            type='search'
            placeholder='Search...'
            className='flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsExpanded(false);
              }
            }}
          />
        )}
        <Button
          variant={isExpanded ? 'ghost' : 'default'}
          size='icon'
          className={cn(
            'rounded-full h-12 w-12 shrink-0',
            !isExpanded && 'shadow-lg'
          )}
          onClick={toggleSearch}
          aria-label={isExpanded ? 'Close search' : 'Open search'}
        >
          {isExpanded ? (
            <X className='h-5 w-5' />
          ) : (
            <Search color='black' className='h-5 w-5' />
          )}
        </Button>
      </div>
    </div>
  );
}
