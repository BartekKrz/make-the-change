'use client';

import { ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

export type TagsAutocompleteProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
};

export const TagsAutocomplete: React.FC<TagsAutocompleteProps> = ({
  value = [],
  onChange,
  suggestions = [],
  placeholder = 'Rechercher des tags...',
  maxTags = 10,
  disabled = false,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtrer les suggestions qui ne sont pas déjà sélectionnées
  const availableSuggestions = suggestions.filter(
    suggestion =>
      !value.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Ajouter l'option "Créer" si l'input ne correspond à aucune suggestion
  const options = [...availableSuggestions];
  if (
    inputValue.trim() &&
    !suggestions.some(s => s.toLowerCase() === inputValue.toLowerCase())
  ) {
    options.push(`Créer "${inputValue.trim()}"`);
  }

  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const addTag = (tag: string) => {
    const cleanTag = tag.startsWith('Créer "') ? tag.slice(7, -1) : tag;
    if (!value.includes(cleanTag) && value.length < maxTags) {
      onChange([...value, cleanTag]);
    }
    setInputValue('');
    closeDropdown();
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));

        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, -1));

        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (focusedIndex >= 0 && options[focusedIndex]) {
          addTag(options[focusedIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }

        break;
      }
      case 'Escape': {
        closeDropdown();

        break;
      }
      default: {
        if (e.key === 'Backspace' && !inputValue && value.length > 0) {
          removeTag(value.at(-1));
        }
      }
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[
        focusedIndex
      ] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Tags sélectionnés + Input */}
      <div
        className={cn(
          'border-border bg-background min-h-[44px] w-full rounded-lg border px-3 py-2 text-sm',
          'focus-within:ring-primary/20 focus-within:border-primary focus-within:ring-2',
          'flex flex-wrap items-center gap-1.5',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tags existants */}
        {value.map(tag => (
          <span
            key={tag}
            className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
          >
            <span>{tag}</span>
            <button
              className="text-primary/60 hover:text-primary hover:bg-primary/20 flex h-3 w-3 items-center justify-center rounded-sm transition-colors"
              disabled={disabled}
              type="button"
              onClick={e => {
                e.stopPropagation();
                removeTag(tag);
              }}
            >
              <X size={10} />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
          disabled={disabled || value.length >= maxTags}
          placeholder={value.length === 0 ? placeholder : ''}
          type="text"
          value={inputValue}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          onChange={e => {
            setInputValue(e.target.value);
            openDropdown();
            setFocusedIndex(-1);
          }}
        />

        {/* Chevron indicateur */}
        <ChevronDown
          size={16}
          className={cn(
            'text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </div>

      {/* Counter */}
      <div className="text-muted-foreground mt-1 flex justify-between text-xs">
        <span>Tapez pour rechercher ou créer</span>
        <span className={value.length >= maxTags ? 'text-orange-500' : ''}>
          {value.length}/{maxTags}
        </span>
      </div>

      {/* Dropdown suggestions simple */}
      {isOpen && options.length > 0 && (
        <div className="border-border bg-background absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border shadow-lg shadow-black/10">
          <ul ref={listRef} className="p-1">
            {options.map((option, index) => (
              <li
                key={option}
                className={cn(
                  'cursor-pointer rounded-md px-3 py-2 text-sm transition-colors',
                  index === focusedIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted',
                  option.startsWith('Créer "') && 'text-muted-foreground italic'
                )}
                onMouseDown={() => addTag(option)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
