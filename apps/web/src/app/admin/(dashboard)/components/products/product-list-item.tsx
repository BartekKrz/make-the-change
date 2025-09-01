'use client'

import { AdminListItem } from '@/app/admin/(dashboard)/components/ui/admin-list-item'
import { ProductListHeader } from './product-list-header'
import { ProductListMetadata } from './product-list-metadata'
import type { FC, ReactNode } from 'react'

type Product =  {
  id: string
  name: string
  slug: string
  is_active: boolean
  featured?: boolean
  price_points: number
  stock_quantity: number | null
}

type ProductListItemProps =  {
  product: Product
  actions?: ReactNode
}

export const ProductListItem: FC<ProductListItemProps> = ({ product, actions }) => (
  <AdminListItem
    href={`/admin/products/${product.id}`}
    header={<ProductListHeader product={product} />}
    metadata={<ProductListMetadata product={product} />}
    actions={actions}
  />
)
