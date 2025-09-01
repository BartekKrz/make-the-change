'use client'

import {  Star } from 'lucide-react'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { getInitials } from '@/app/admin/(dashboard)/components/ui/format-utils'
import { FC } from 'react'

type Product =  {
  id: string
  name: string
  slug: string
  is_active: boolean
  featured?: boolean
}

type ProductListHeaderProps =  {
  product: Product
}

export const ProductListHeader: FC<ProductListHeaderProps> = ({ product }) => (
  <div className="flex items-center gap-2 md:gap-3">
    {}
    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
      {getInitials(product.name)}
    </div>

    <div className="flex items-center gap-2 flex-1 min-w-0">
      <h3 className="text-base font-medium text-foreground truncate">
        {product.name}
      </h3>

      <span className="font-mono text-xs text-muted-foreground">{product.slug}</span>

      <Badge color={product.is_active ? 'green' : 'red'}>
        {product.is_active ? 'actif' : 'inactif'}
      </Badge>

      {product.featured && <Star className="w-4 h-4 text-yellow-500" />}
    </div>
  </div>
)
