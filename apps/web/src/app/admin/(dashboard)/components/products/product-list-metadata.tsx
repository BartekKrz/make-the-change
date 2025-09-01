'use client'

import { Zap, Box } from 'lucide-react'
import { FC } from 'react'

type Product =  {
  price_points: number
  stock_quantity: number | null
}

type ProductListMetadataProps = {
  product: Product
}

export const ProductListMetadata: FC<ProductListMetadataProps> = ({ product }) => (
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
    </div>
  </div>
)
