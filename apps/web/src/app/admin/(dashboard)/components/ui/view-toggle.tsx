"use client"
import { type FC } from 'react'
import { Button } from '@/components/ui/button'
import { LayoutGrid, List, MapPin } from 'lucide-react'

export type ViewMode = 'grid' | 'list' | 'map'

type ViewToggleProps = {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  availableViews?: ViewMode[]
}

const VIEW_CONFIG = {
  grid: { icon: LayoutGrid, label: 'Grille' },
  list: { icon: List, label: 'Liste' },
  map: { icon: MapPin, label: 'Carte' }
} as const

export const ViewToggle: FC<ViewToggleProps> = ({
  value,
  onChange,
  availableViews = ['grid', 'list']
}) => {
  if (availableViews.length <= 1) return null

  return (
    <div className='inline-flex items-center gap-1 rounded-xl border border-border/60 dark:border-border/40 bg-background/50 dark:bg-card/60 backdrop-blur-sm p-1'>
      {availableViews.map((viewMode) => {
        const { icon: Icon, label } = VIEW_CONFIG[viewMode]
        const isActive = value === viewMode

        return (
          <Button
            key={viewMode}
            size='sm'
            variant={isActive ? 'default' : 'outline'}
            onClick={() => onChange(viewMode)}
            icon={<Icon className='h-4 w-4' />}
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}
