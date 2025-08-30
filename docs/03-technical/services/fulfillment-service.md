# Fulfillment Service (Hybrid) - Make the CHANGE

 Scope: Route orders between micro-hub stock and partner dropship, compute shipping, manage inventory and shipments.

## Responsibilities
- Check availability and reserve micro-stock hero products; create shipments per route.
- Compute shipping costs by items weight/dimensions and destination.
- Track shipment status and update orders lifecycle.

## Routing Logic
- For each order item:
  - If product.fulfillment_method = stock → route `mtc_micro_hub`.
  - Else route to partner (dropship) based on producer_id.
- Combine items by route into shipments; compute per-shipment weights.

## Inventory
- On order create: create `reserved` movements; upon ship: `out` movements; on cancel: `released`.
- Low-stock alerts from `inventory_status_overview` view; notify ops.

## Data
- Tables: inventory, inventory_movements, shipments.

## Security
- Admin-only manual overrides; audit every movement and status change.

## Observability
- Metrics: route split %, pick/ship SLA, exceptions; stockout frequency.

## Testing
- Mixed carts; oversell race; multi-shipment orders; carrier edge-cases.

## References
- `api/orders-endpoints.md`, `api/products-endpoints.md`, `database-schema.md`.

## Shipping Policy (MVP)
- Ambassadeur actif: livraison gratuite (0 points) par défaut.
- MVP: livraison gratuite pour tous (peut être révisé ultérieurement). La fonction `calculateShippingCosts` doit retourner 0, avec possibilité d'évolution via feature flag.
