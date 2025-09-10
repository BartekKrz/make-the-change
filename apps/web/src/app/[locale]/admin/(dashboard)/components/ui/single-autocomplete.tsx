'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { ChevronDown, X } from 'lucide-react';

export interface SingleAutocompleteProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  suggestions?: string[];
  placeholder?: string;
  allowCreate?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SingleAutocomplete: React.FC<SingleAutocompleteProps> = ({
  value = '',
  onChange,
  suggestions = [],
  placeholder = 'Rechercher...',
  allowCreate = true,
  disabled = false,
  className
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtrer les suggestions
  const filteredSuggestions = suggestions.filter(
    suggestion => suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Ajouter l'option "Créer" si allowCreate et input ne correspond à aucune suggestion
  const options = [...filteredSuggestions];
  if (allowCreate && inputValue.trim() && 
      !suggestions.some(s => s.toLowerCase() === inputValue.toLowerCase())) {
    options.push(`Créer "${inputValue.trim()}"`);
  }

  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const selectOption = (option: string) => {
    const cleanValue = option.startsWith('Créer "') ? option.slice(7, -1) : option;
    setInputValue(cleanValue);
    onChange(cleanValue);
    closeDropdown();
  };

  const clearValue = () => {
    setInputValue('');
    onChange(undefined);
    inputRef.current?.focus();
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
        selectOption(options[focusedIndex]);
      } else if (allowCreate && inputValue.trim()) {
        selectOption(inputValue.trim());
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
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

  // Synchroniser avec la valeur externe
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

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
      {/* Input avec clear button */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            openDropdown();
            setFocusedIndex(-1);
            // Si on tape directement, on update immédiatement si allowCreate
            if (allowCreate) {
              onChange(e.target.value || undefined);
            }
          }}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 bg-background border border-border rounded-lg text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'pr-20', // Espace pour les boutons
            className
          )}
        />
        
        {/* Boutons à droite */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={clearValue}
              className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded transition-colors"
              disabled={disabled}
            >
              <X size={14} />
            </button>
          )}
          
          <ChevronDown
            size={16}
            className={cn(
              'text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </div>

      {/* Indication du mode */}
      <div className="text-xs text-muted-foreground mt-1">
        {allowCreate ? 'Tapez pour rechercher ou créer' : 'Sélectionnez dans la liste'}
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
                onMouseDown={() => selectOption(option)}
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