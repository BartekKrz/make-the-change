'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { ChevronDown, X } from 'lucide-react';

export interface TagsAutocompleteProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
}

export const TagsAutocomplete: React.FC<TagsAutocompleteProps> = ({
  value = [],
  onChange,
  suggestions = [],
  placeholder = 'Rechercher des tags...',
  maxTags = 10,
  disabled = false,
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtrer les suggestions qui ne sont pas déjà sélectionnées
  const availableSuggestions = suggestions.filter(
    suggestion => !value.includes(suggestion) && 
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Ajouter l'option "Créer" si l'input ne correspond à aucune suggestion
  const options = [...availableSuggestions];
  if (inputValue.trim() && !suggestions.some(s => s.toLowerCase() === inputValue.toLowerCase())) {
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
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && options[focusedIndex]) {
        addTag(options[focusedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);


  return (
    <div 
      ref={containerRef}
      className={cn('relative', className)}
    >
      {/* Tags sélectionnés + Input */}
      <div
        className={cn(
          'min-h-[44px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm',
          'focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary',
          'flex flex-wrap gap-1.5 items-center',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tags existants */}
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-primary/60 hover:text-primary hover:bg-primary/20 rounded-sm w-3 h-3 flex items-center justify-center transition-colors"
              disabled={disabled}
            >
              <X size={10} />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            openDropdown();
            setFocusedIndex(-1);
          }}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || value.length >= maxTags}
          className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
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
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Tapez pour rechercher ou créer</span>
        <span className={value.length >= maxTags ? 'text-orange-500' : ''}>
          {value.length}/{maxTags}
        </span>
      </div>

      {/* Dropdown suggestions simple */}
      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-background shadow-lg shadow-black/10">
          <ul ref={listRef} className="p-1">
            {options.map((option, index) => (
              <li
                key={option}
                className={cn(
                  'px-3 py-2 text-sm cursor-pointer rounded-md transition-colors',
                  index === focusedIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted',
                  option.startsWith('Créer "') && 'italic text-muted-foreground'
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