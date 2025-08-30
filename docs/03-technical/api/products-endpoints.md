# Products Endpoints - Make the CHANGE

 tRPC Router: `products` | Priority: High | Weeks: 9-12

## Scope
Public catalog/search/detail; admin CRUD; hybrid inventory updates for hero products.

## Router Definition
```ts
export const productsRouter = router({
  list: publicProcedure.input(productFiltersSchema).query(listProducts),
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(getProductBySlug),
  categories: publicProcedure.query(listCategories),
  search: publicProcedure.input(searchSchema).query(searchProducts),
  recommendations: protectedProcedure.query(getRecommendations),

  admin: router({
    create: adminProcedure.input(productCreateSchema).mutation(createProduct),
    update: adminProcedure.input(productUpdateSchema).mutation(updateProduct),
    updateStock: adminProcedure.input(stockUpdateSchema).mutation(updateStock),
    
    // NOUVEAU: Inventory management complet
    getStockAlerts: adminProcedure.query(getStockAlerts),
    getStockHistory: adminProcedure.input(stockHistorySchema).query(getStockHistory),
    processReorder: adminProcedure.input(reorderSchema).mutation(processReorder),
    getInventoryOverview: adminProcedure.input(inventoryOverviewSchema).query(getInventoryOverview),
    updateInventoryThresholds: adminProcedure.input(thresholdsUpdateSchema).mutation(updateInventoryThresholds),
  })
})
```

## Outputs
- `list` → `Paginated<ProductSummaryDTO>`
- `bySlug` → `ProductDetailDTO`
- `categories` → `Array<{ id: string; name: string; slug: string }>`
- `search` → `Paginated<ProductSummaryDTO>`
- `recommendations` → `Array<ProductSummaryDTO>`
- `admin.create` → `ProductDTO`
- `admin.update` → `ProductDTO`
- `admin.updateStock` → `{ success: boolean, newStock: number }`
- `admin.getStockAlerts` → `Array<StockAlertDTO>`
- `admin.getStockHistory` → `Paginated<StockMovementDTO>`
- `admin.processReorder` → `ReorderDTO`
- `admin.getInventoryOverview` → `InventoryOverviewDTO`
- `admin.updateInventoryThresholds` → `ProductThresholdsDTO`

See DTOs in `schemas/response-models.md`.

## Schemas
```ts
export const productFiltersSchema = z.object({
  category: z.string().uuid().optional(),
  producer: z.string().uuid().optional(),
  pointsRange: z.tuple([z.number().min(0), z.number().min(0)]).optional(),
  inStock: z.boolean().optional(),
  userLevel: z.enum(['explorateur','protecteur','ambassadeur']).optional(),
  pagination: paginationSchema,
  sort: z.enum(['price','popularity','newest']).default('popularity'),
  q: z.string().max(64).optional(),
})

export const productCreateSchema = z.object({
  name: z.string(), category_id: z.string().uuid(), producer_id: z.string().uuid(),
  price_points: z.number().int().positive(), fulfillment_method: z.enum(['stock','dropship']),
  is_hero_product: z.boolean().default(false), description: z.string().optional(), images: z.array(z.string().url()).default([]),
  stock_quantity: z.number().int().min(0).optional(), min_tier: z.enum(['explorateur','protecteur','ambassadeur']).default('explorateur')
})
export const productUpdateSchema = z.object({ id: z.string().uuid(), updates: z.record(z.any()) })

export const stockUpdateSchema = z.object({
  productId: z.string().uuid(), quantity: z.number().int(), movement_type: z.enum(['in','out','adjustment']), reason: z.string()
})

export const searchSchema = z.object({ q: z.string().min(2), pagination: paginationSchema })

// NOUVEAU: Schémas inventory management complet
export const stockHistorySchema = z.object({
  productId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  operation: z.enum(['restock', 'sale', 'adjustment', 'damage']).optional(),
  pagination: z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100).default(20) }),
})

export const reorderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
  partnerId: z.string().uuid(),
  expectedDeliveryDate: z.date(),
  unitCost: z.number().min(0),
  notes: z.string().optional(),
})

export const inventoryOverviewSchema = z.object({
  partnerId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  stockStatus: z.enum(['low', 'medium', 'high', 'out_of_stock', 'all']).default('all'),
})

export const thresholdsUpdateSchema = z.object({
  productId: z.string().uuid(),
  thresholds: z.object({
    lowStockAlert: z.number().int().min(0),
    reorderPoint: z.number().int().min(0),
    maxStock: z.number().int().min(1),
  }),
})
```

## Business Rules
- Enforce `min_tier` visibility; restrict premium products.
- For `stock` items: maintain `inventory` and `inventory_movements`; raise low stock alerts.
- For `dropship` items: stock not decremented locally; rely on partner feed hooks if any.

## Security
- Admin only for create/update/stock; validate SKU/hero constraints.

## Errors
- PRODUCT_NOT_FOUND, CATEGORY_NOT_FOUND, INVALID_STOCK_OPERATION.

## Testing
- Filters/sorting, tier restriction, stock movements atomicity and alert emission.

## Observability
- Metrics: product views, conversion, stock alerts rate; hero rotation days.

## References
- See `services/fulfillment-service.md` for stock routing and shipment costs.
