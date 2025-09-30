import { OrderMode } from '@/src/api/dashboard/orders/common-interface';
import { t } from '@lingui/core/macro';

export const getOrderModeLabel = (mode: OrderMode) => {
  switch (mode) {
    case 'Delivery':
      return t`Livraison`;
    case 'Takeaway':
      return t`À emporter`;
    default: {
      const _exhaustiveCheck: never = mode;
      return _exhaustiveCheck;
    }
  }
};
