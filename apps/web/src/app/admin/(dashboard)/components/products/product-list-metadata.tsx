'use client'

import { Zap, Box, User } from 'lucide-react'
import { type FC } from 'react'

type Product =  {
  price_points: number
  stock_quantity: number | null
  producer?: {
    id: string
    name: string
    slug: string
  } | null
}

type ProductListMetadataProps = {
  product: Product
}

export const ProductListMetadata: FC<ProductListMetadataProps> = ({product}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Zap className="w-4 h-4 text-primary/70 md:group-hover:text-primary group-active:text-primary transition-colors duration-200" />
        <span className="text-sm">{product.price_points} pts</span>
      </div>

      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Box className="w-4 h-4 text-orange-500/70 md:group-hover:text-orange-500 group-active:text-orange-500 transition-colors duration-200" />
        <span className="text-sm">Stock: {product.stock_quantity ?? 0}</span>
      </div>

      {product.producer && (
        <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
          <User className="w-4 h-4 text-blue-500/70 md:group-hover:text-blue-500 group-active:text-blue-500 transition-colors duration-200" />
          <span className="text-sm">{product.producer.name}</span>
        </div>
      )}
    </div>
  </div>
)
