# Orders Endpoints - Make the CHANGE

 tRPC Router: `orders` (+ `cart`) | Priority: High | Weeks: 9-12

## Scope
Cart operations, order creation with points debit, hybrid fulfillment (micro-stock + dropship), order lifecycle and tracking.

## Router Definition (panier persistant: `carts`/`cart_items`)
```ts
export const ordersRouter = router({
  cart: router({
    add: protectedProcedure.input(cartAddSchema).mutation(addToCart),
    remove: protectedProcedure.input(cartRemoveSchema).mutation(removeFromCart),
    updateQty: protectedProcedure.input(cartUpdateQtySchema).mutation(updateCartQty),
    get: protectedProcedure.query(getCart),
    clear: protectedProcedure.mutation(clearCart),
  }),

  create: protectedProcedure.input(orderCreateSchema).mutation(createOrder),
  list: protectedProcedure.input(paginationSchema).query(listOrders),
  byId: protectedProcedure.input(idSchema).query(getOrderById),
  cancel: protectedProcedure.input(idSchema).mutation(cancelOrder),
  updateStatus: adminProcedure.input(orderStatusSchema).mutation(updateOrderStatus),
  shippingRate: protectedProcedure.input(shippingRateSchema).query(calculateShippingRate),
})
```

## Schemas
```ts
export const cartAddSchema = z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1) })
export const cartRemoveSchema = z.object({ itemId: z.string().uuid() })
export const cartUpdateQtySchema = z.object({ itemId: z.string().uuid(), quantity: z.number().int().min(1) })

export const orderCreateSchema = z.object({
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })).min(1),
  shippingAddress: addressSchema,
  deliveryInstructions: z.string().max(256).optional(),
  deliverySlot: z.string().max(50).optional(),
  source: z.enum(['web','mobile','admin']).default('web'),
})

export const orderStatusSchema = z.object({ id: z.string().uuid(), status: z.enum(['pending','confirmed','processing','shipped','delivered','cancelled']), notes: z.string().optional() })
export const shippingRateSchema = z.object({ items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })), destination: addressSchema })

export const idSchema = z.object({ id: z.string().uuid() })
export const addressSchema = z.object({ firstName: z.string(), lastName: z.string(), street: z.string(), city: z.string(), postalCode: z.string(), country: z.string().length(2) })
export const paginationSchema = z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100).default(20) })
```

## Flow (Create Order)
1) Validate cart and availability; compute points required and shipping rate.
2) Begin transaction: reserve stock for `stock` items; verify user points; debit points; create order and items snapshots.
3) Determine fulfillment route per item: `mtc_micro_hub` vs partner dropship.
4) Create shipment records; release reservations on failure.
5) Commit; send confirmation and push; analytics tracking.

## Security
- Atomicity enforced with DB transactions; idempotency key `ord:${userId}:${hash(items)}`.
- Prevent oversell via `quantity_reserved` and movements.

## Shipping Rules
- Ambassadeurs (abonnement actif): `shipping_cost_points = 0` (livraison gratuite).
- MVP: frais de livraison à 0 pour tous (peut évoluer). L’API `shippingRate` renvoie 0 par défaut.

## Errors
- INSUFFICIENT_POINTS, OUT_OF_STOCK, INVALID_CART, DUPLICATE_ORDER, FULFILLMENT_UNAVAILABLE.

## Testing
- Mixed cart stock+dropship; oversell race; reservation release; refund on cancel.

## Observability
- Metrics: order conversion, fulfillment split %, delivery SLAs; errors by stage.

## Outputs
- `cart.get` → `CartDTO`
- `create` → `OrderDetailDTO`
- `list` → `Paginated<OrderSummaryDTO>`
- `byId` → `OrderDetailDTO`
- `shippingRate` → `{ amountPoints: number, breakdown?: Record<string, number> }` (MVP returns `{ amountPoints: 0 }`)

See DTOs in `schemas/response-models.md`.

## References
- See `services/fulfillment-service.md` for routing and shipping costs, `services/points-service.md` for debits/refunds.
