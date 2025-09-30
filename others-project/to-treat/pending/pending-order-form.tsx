import { GetPendingOrdersResponseItem } from '@/src/api/dashboard/orders/get-pending-orders';
import { useModalContext } from '@/src/utils/use-modal/use-modal';
import { FC, useCallback } from 'react';
import { useETAForm, etaFormOpts } from '../shared/order-eta-form-context';
import { useOrderLoopSound } from '../shared/utils/use-order-loop-sound';
import { OrderDetails } from './components/details';
import { OrderActions } from './components/order-actions';
import { Popup } from '../../shared/popup';
import { usePrintTicket } from '@/src/hooks/use-print-ticket';
import { usePrinter } from '@/src/features/printers/printer-provider';

type PendingOrdersFormProps = {
  order: GetPendingOrdersResponseItem;
};

export const PendingOrderForm: FC<PendingOrdersFormProps> = ({ order }) => {
  const modal = useModalContext();
  const { printTickets } = usePrintTicket();

  const { state } = usePrinter();

  const handlePrintTickets = useCallback(() => {
    if (!state.connected.printer) return; // Printer usage is optional, skip if not connected

    printTickets({
      ...order,
      etaUtc: order.etaUTC ?? order.requestedAtUTC ?? order.sentAtUTC,
      orderItems: order.orderItems.map((orderItem) => ({
        ...orderItem,
        orderItemOptions: [...orderItem.orderItemOptions]
      }))
    });
  }, [order, printTickets, state.connected.printer]);

  const etaForm = useETAForm({
    ...etaFormOpts,
    defaultValues: {
      eta: order.requestedAtUTC ?? order.sentAtUTC
    },
    onSubmit: () => modal.close()
  });

  useOrderLoopSound();

  return (
    <Popup>
      <etaForm.AppForm>
        <OrderDetails order={order} />
        <OrderActions
          sentAtUTC={order.sentAtUTC}
          requestedAtUTC={order.requestedAtUTC}
          orderId={order.id}
          onOrderAccepted={handlePrintTickets}
        />
      </etaForm.AppForm>
    </Popup>
  );
};
