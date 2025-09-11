"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Types pour le composant
export type ModernDatePickerProps = {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  showTodayButton?: boolean
  showClearButton?: boolean
  required?: boolean
  error?: boolean
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
}

// Utilitaires de date modernes (sans dépendances externes)
const dateUtils = {
  format: (date: Date, format: string, locale: string = 'fr-FR'): string => {
    const options: Intl.DateTimeFormatOptions = {}

    switch (format) {
      case 'dd/MM/yyyy': {
        options.day = '2-digit'
        options.month = '2-digit'
        options.year = 'numeric'
        break
      }
      case 'MM/dd/yyyy': {
        options.month = '2-digit'
        options.day = '2-digit'
        options.year = 'numeric'
        break
      }
      case 'yyyy-MM-dd': {
        options.year = 'numeric'
        options.month = '2-digit'
        options.day = '2-digit'
        break
      }
      default: {
        return date.toLocaleDateString(locale)
      }
    }

    return date.toLocaleDateString(locale, options)
  },

  parse: (dateString: string, format: string): Date | null => {
    if (!dateString) return null

    // Support multiple formats
    const formats = [
      /^(\d{2})\/(\d{2})\/(\d{4})$/, // dd/MM/yyyy
      /^(\d{2})\/(\d{2})\/(\d{2})$/, // dd/MM/yy
      /^(\d{4})-(\d{2})-(\d{2})$/,  // yyyy-MM-dd
      /^(\d{2})\.(\d{2})\.(\d{4})$/ // dd.MM.yyyy
    ]

    for (const regex of formats) {
      const match = dateString.match(regex)
      if (match) {
        let year, month, day

        if (regex === formats[0] || regex === formats[3]) {
          // dd/MM/yyyy or dd.MM.yyyy
          day = Number.parseInt(match[1])
          month = Number.parseInt(match[2]) - 1 // JavaScript months are 0-indexed
          year = Number.parseInt(match[3])
        } else if (regex === formats[1]) {
          // dd/MM/yy
          day = Number.parseInt(match[1])
          month = Number.parseInt(match[2]) - 1
          year = 2000 + Number.parseInt(match[3])
        } else {
          // yyyy-MM-dd
          year = Number.parseInt(match[1])
          month = Number.parseInt(match[2]) - 1
          day = Number.parseInt(match[3])
        }

        const date = new Date(year, month, day)
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
          return date
        }
      }
    }

    return null
  },

  isValid: (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime())
  },

  isSameDay: (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  },

  isToday: (date: Date): boolean => {
    const today = new Date()
    return dateUtils.isSameDay(date, today)
  },

  isBefore: (date1: Date, date2: Date): boolean => {
    return date1.getTime() < date2.getTime()
  },

  isAfter: (date1: Date, date2: Date): boolean => {
    return date1.getTime() > date2.getTime()
  },

  startOfDay: (date: Date): Date => {
    const newDate = new Date(date)
    newDate.setHours(0, 0, 0, 0)
    return newDate
  },

  addMonths: (date: Date, months: number): Date => {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + months)
    return newDate
  },

  subMonths: (date: Date, months: number): Date => {
    return dateUtils.addMonths(date, -months)
  },

  startOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  },

  endOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
  },

  eachDayOfInterval: (start: Date, end: Date): Date[] => {
    const days: Date[] = []
    const current = new Date(start)

    while (current <= end) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  },

  isSameMonth: (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth()
  }
}

// Composant Popover simple et moderne
const Popover: React.FC<{
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ children, open, onOpenChange }) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && !(event.target as Element).closest('[data-popover]')) {
        onOpenChange(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])

  return <>{children}</>
}

const PopoverTrigger: React.FC<{
  children: React.ReactNode
  asChild?: boolean
}> = ({ children }) => {
  return <>{children}</>
}

const PopoverContent: React.FC<{
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
}> = ({ children, className, align = 'start', side = 'bottom', sideOffset = 4 }) => {
  return (
    <div
      data-popover
      className={cn(
        "absolute z-50 bg-background border border-border rounded-lg shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      style={{
        [side === 'bottom' ? 'top' : (side === 'top' ? 'bottom' : 'left')]: `calc(100% + ${sideOffset}px)`,
        [align === 'start' ? 'left' : (align === 'end' ? 'right' : 'left')]: align === 'center' ? '50%' : '0',
        transform: align === 'center' ? 'translateX(-50%)' : undefined
      }}
    >
      {children}
    </div>
  )
}

// Composant Input moderne
const Input: React.FC<{
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  onClick?: () => void
  readOnly?: boolean
}> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className,
  onClick,
  readOnly = false
}) => {
  return (
    <input
      disabled={disabled}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      type={type}
      value={value}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onChange={onChange}
      onClick={onClick}
    />
  )
}

// Hook personnalisé pour la gestion du calendrier
function useCalendar(initialDate?: Date | null) {
  const [currentMonth, setCurrentMonth] = React.useState(initialDate || new Date())

  const goToPreviousMonth = React.useCallback(() => {
    setCurrentMonth(prev => dateUtils.subMonths(prev, 1))
  }, [])

  const goToNextMonth = React.useCallback(() => {
    setCurrentMonth(prev => dateUtils.addMonths(prev, 1))
  }, [])

  const goToToday = React.useCallback(() => {
    setCurrentMonth(new Date())
  }, [])

  return {
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    setCurrentMonth
  }
}

// Composant principal ModernDatePicker
export const ModernDatePicker = React.forwardRef<HTMLDivElement, ModernDatePickerProps>(({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  disabled = false,
  minDate,
  maxDate,
  className,
  showTodayButton = true,
  showClearButton = true,
  required = false,
  error = false,
  helperText,
  size = 'md',
  variant = 'default',
  ...props
}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const { currentMonth, goToPreviousMonth, goToNextMonth, goToToday, setCurrentMonth } = useCalendar(value)

  // Synchroniser la valeur avec l'input
  React.useEffect(() => {
    if (value && dateUtils.isValid(value)) {
      setInputValue(dateUtils.format(value, 'dd/MM/yyyy'))
    } else {
      setInputValue('')
    }
  }, [value])

  // Gestionnaire de sélection de date
  const handleDateSelect = React.useCallback((date: Date) => {
    onChange?.(date)
    setOpen(false)
  }, [onChange])

  // Gestionnaire de saisie manuelle
  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setInputValue(input)

    // Essayer de parser la date saisie
    const parsedDate = dateUtils.parse(input, 'dd/MM/yyyy')
    if (parsedDate && dateUtils.isValid(parsedDate)) {
      // Vérifier les contraintes
      if (minDate && dateUtils.isBefore(parsedDate, dateUtils.startOfDay(minDate))) return
      if (maxDate && dateUtils.isAfter(parsedDate, dateUtils.startOfDay(maxDate))) return
      onChange?.(parsedDate)
    }
  }, [minDate, maxDate, onChange])

  // Gestionnaire d'effacement
  const handleClear = React.useCallback(() => {
    onChange?.(null)
    setInputValue('')
  }, [onChange])

  // Générer les jours du mois
  const monthDays = React.useMemo(() => {
    const start = dateUtils.startOfMonth(currentMonth)
    const end = dateUtils.endOfMonth(currentMonth)
    return dateUtils.eachDayOfInterval(start, end)
  }, [currentMonth])

  // Vérifier si une date est sélectionnable
  const isDateSelectable = React.useCallback((date: Date) => {
    if (minDate && dateUtils.isBefore(date, dateUtils.startOfDay(minDate))) return false
    if (maxDate && dateUtils.isAfter(date, dateUtils.startOfDay(maxDate))) return false
    return true
  }, [minDate, maxDate])

  // Classes de taille
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  }

  // Classes de variant
  const variantClasses = {
    default: 'border-input bg-background',
    filled: 'border-transparent bg-muted',
    outlined: 'border-2 border-primary bg-transparent'
  }

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              readOnly
              disabled={disabled}
              placeholder={placeholder}
              required={required}
              type="text"
              value={inputValue}
              className={cn(
                "pr-10 cursor-pointer transition-all duration-200",
                sizeClasses[size],
                variantClasses[variant],
                error && "border-destructive focus-visible:ring-destructive",
                disabled && "cursor-not-allowed opacity-50",
                !disabled && "hover:border-primary/50 focus:border-primary"
              )}
              onChange={handleInputChange}
              onClick={() => !disabled && setOpen(true)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              {value && showClearButton && (
                <button
                  className="p-0.5 rounded-full hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                >
                  <XIcon className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
              <CalendarIcon
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-colors",
                  !disabled && "group-hover:text-primary"
                )}
              />
            </div>
          </div>
        </PopoverTrigger>

        <AnimatePresence>
          {open && (
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="fixed z-50"
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <PopoverContent
                align="start"
                className="w-auto p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
                side="bottom"
                sideOffset={8}
              >
                {/* Header du calendrier */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                  <Button
                    className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                    size="sm"
                    variant="ghost"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>

                  <motion.h2
                    key={currentMonth.toISOString()}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold text-foreground px-4"
                    initial={{ opacity: 0, y: 10 }}
                  >
                    {currentMonth.toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </motion.h2>

                  <Button
                    className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                    size="sm"
                    variant="ghost"
                    onClick={goToNextMonth}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 gap-1 p-4 bg-muted/30">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                    <div
                      key={day}
                      className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grille des jours */}
                <motion.div
                  layout
                  className="grid grid-cols-7 gap-1 p-4 pt-0"
                >
                  {monthDays.map((date: Date) => {
                    const isSelected = value && dateUtils.isSameDay(date, value)
                    const isCurrentMonth = dateUtils.isSameMonth(date, currentMonth)
                    const isTodayDate = dateUtils.isToday(date)
                    const selectable = isDateSelectable(date)

                    return (
                      <motion.button
                        key={date.toISOString()}
                        layout
                        animate={{ opacity: 1, scale: 1 }}
                        disabled={!selectable}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={selectable ? { scale: 1.1, backgroundColor: 'var(--primary)' } : {}}
                        whileTap={selectable ? { scale: 0.9 } : {}}
                        className={cn(
                          "h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 relative",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          isSelected && "bg-primary text-primary-foreground shadow-lg",
                          isTodayDate && !isSelected && "bg-accent text-accent-foreground ring-2 ring-accent",
                          !isSelected && !isTodayDate && selectable && "hover:bg-primary/10 hover:text-primary hover:shadow-md",
                          !selectable && "text-muted-foreground cursor-not-allowed opacity-50",
                          !isCurrentMonth && "text-muted-foreground/30"
                        )}
                        onClick={() => selectable && handleDateSelect(date)}
                      >
                        {date.getDate()}

                        {/* Indicateur pour aujourd'hui */}
                        {isTodayDate && !isSelected && (
                          <motion.div
                            animate={{ scale: 1 }}
                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                            initial={{ scale: 0 }}
                          />
                        )}

                        {/* Indicateur pour date sélectionnée */}
                        {isSelected && (
                          <motion.div
                            animate={{ scale: 1 }}
                            className="absolute inset-0 rounded-lg ring-2 ring-white/50"
                            initial={{ scale: 0 }}
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </motion.div>

                {/* Actions du bas */}
                <div className="flex items-center justify-between p-4 border-t border-border/50 bg-gradient-to-r from-muted/50 to-background/50">
                  <div className="flex space-x-2">
                    {showTodayButton && (
                      <Button
                        className="text-xs h-7 px-3 hover:bg-primary/10 hover:text-primary transition-colors"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          goToToday()
                          const today = new Date()
                          if (isDateSelectable(today)) {
                            handleDateSelect(today)
                          }
                        }}
                      >
                        Aujourd&apos;hui
                      </Button>
                    )}
                  </div>

                  {/* Affichage de la date sélectionnée */}
                  {value && (
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md"
                      initial={{ opacity: 0 }}
                    >
                      {dateUtils.format(value, 'dd/MM/yyyy')}
                    </motion.div>
                  )}
                </div>
              </PopoverContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Popover>

      {/* Texte d'aide avec animation */}
      <AnimatePresence>
        {helperText && (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            className={cn(
              "text-xs mt-2 transition-colors",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})

ModernDatePicker.displayName = "ModernDatePicker"

// Hook pour utiliser facilement le DatePicker avec la validation
export function useModernDatePicker(initialValue?: Date | null) {
  const [value, setValue] = React.useState<Date | null>(initialValue || null)
  const [error, setError] = React.useState<string>('')

  const validate = React.useCallback((date: Date | null, minDate?: Date, maxDate?: Date) => {
    if (!date) {
      setError('')
      return true
    }

    if (minDate && dateUtils.isBefore(date, dateUtils.startOfDay(minDate))) {
      setError(`La date doit être après le ${dateUtils.format(minDate, 'dd/MM/yyyy')}`)
      return false
    }

    if (maxDate && dateUtils.isAfter(date, dateUtils.startOfDay(maxDate))) {
      setError(`La date doit être avant le ${dateUtils.format(maxDate, 'dd/MM/yyyy')}`)
      return false
    }

    setError('')
    return true
  }, [])

  return {
    value,
    setValue,
    error,
    setError,
    validate,
    isValid: !error
  }
}
