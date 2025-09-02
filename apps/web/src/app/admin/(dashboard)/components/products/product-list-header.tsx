'use client'

import { Star } from 'lucide-react'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { getInitials } from '@/app/admin/(dashboard)/components/ui/format-utils'
import { ProductImage, getMainProductImage } from '@/components/ProductImage'
import { FC } from 'react'

type Product =  {
  id: string
  name: string
  slug: string
  is_active: boolean
  featured?: boolean
  images?: string[]
}

type ProductListHeaderProps =  {
  product: Product
}

export const ProductListHeader: FC<ProductListHeaderProps> = ({ product }) => {
  const mainImage = getMainProductImage(product.images);
  const initials = getInitials(product.name);

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Image ou initiales */}
      <div className="flex-shrink-0">
        <ProductImage
          src={mainImage}
          alt={product.name}
          size="xs"
          fallbackType="initials"
          initials={initials}
        />
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
  );
};
