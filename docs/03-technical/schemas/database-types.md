# Database Types & Enums - Make the CHANGE

 Scope: Canonical enums and constraints referenced by backend logic.

## Enums
- user_level: explorateur | protecteur | ambassadeur
- kyc_status: pending | light | complete
- subscription_tier: ambassadeur_standard | ambassadeur_premium
- billing_frequency: monthly | annual
- investment_type: ruche | olivier | parcelle_familiale
- project_status: active | funded | closed | suspended
- order_status: pending | confirmed | processing | shipped | delivered | cancelled
- shipment_status: pending | picked | shipped | in_transit | delivered | exception
- fulfillment_method: stock | dropship
- inventory_movement: in | out | reserved | released | adjustment

## Constraints
- Unique slugs for projects/products/categories/producers.
- Foreign keys with `ON DELETE CASCADE` for child rows (items, movements, updates).
- Numeric guards: nonnegative points and stock, positive amounts.

## Indices (critical)
- investments: (user_id, status), (points_expiry_date)
- points_transactions: (user_id, created_at), (expires_at WHERE amount>0)
- projects: GIST(location) WHERE status='active'
- orders: (user_id, created_at DESC)

## References
- See `database-schema.md` for full DDL.

