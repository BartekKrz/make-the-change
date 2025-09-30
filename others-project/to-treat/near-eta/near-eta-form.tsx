import { FC, useState } from 'react';
import { OrderActions } from './components/order-actions';
import { useModalContext } from '@/src/utils/use-modal/use-modal';
import { OrderDetails } from './components/details';
import { useETAForm, etaFormOpts } from '../shared/order-eta-form-context';
import { useOrderLoopSound } from '../shared/utils/use-order-loop-sound';
import { GetActiveOrdersResponseItem } from '@/src/api/dashboard/orders/get-active-orders';
import { Popup } from '../../shared/popup';

type NearETAFormProps = {
  order: GetActiveOrdersResponseItem;
};

export const NearETAForm: FC<NearETAFormProps> = ({ order }) => {
  const modal = useModalContext();

  const etaForm = useETAForm({
    ...etaFormOpts,
    defaultValues: {
      eta: order.etaUTC
    },
    onSubmit: () => modal.close()
  });

  const [orderStatus, setOrderStatus] = useState(order.status);

  useOrderLoopSound();

  return (
    <Popup>
      <etaForm.AppForm>
        <OrderDetails setOrderStatus={setOrderStatus} orderStatus={orderStatus} order={order} />
        <OrderActions orderStatus={orderStatus} etaUtc={order.etaUTC} orderId={order.id} orderMode={order.orderMode} />
      </etaForm.AppForm>
    </Popup>
  );
};
