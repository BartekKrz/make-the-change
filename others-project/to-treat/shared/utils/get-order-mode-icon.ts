import { OrderMode } from '@/src/api/dashboard/orders/common-interface';
import { AppetitoIconName } from '@/src/components/ui/appetito-icon';

export const ORDER_MODE_ICONS: Record<OrderMode, AppetitoIconName> = {
  ['Delivery']: 'vespa-front',
  ['Takeaway']: 'takeaway-2'
} as const;
