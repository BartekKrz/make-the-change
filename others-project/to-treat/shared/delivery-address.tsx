import { FC } from 'react';

import { useModalContext } from '@/src/utils/use-modal/use-modal';
import { InfoItem } from './info-item';
import { AddressModal } from '../../shared/address-modal';
import { useShopContext } from '@/src/providers/shop-provider';

type DeliveryAddressProps = {
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
};

export const DeliveryAddress: FC<DeliveryAddressProps> = ({ deliveryAddress, deliveryLatitude, deliveryLongitude }) => {
  const { shop } = useShopContext();
  const modal = useModalContext();

  if (shop.address.latitude === 0 && shop.address.longitude === 0) return;
  if (deliveryLatitude === 0 && deliveryLongitude === 0) return;

  return (
    <>
      <InfoItem iconName='property-location' text={deliveryAddress} onPress={() => modal.toggle('delivery-distance')} />
      <AddressModal
        shopCoordinates={{
          latitude: shop.address.latitude,
          longitude: shop.address.longitude
        }}
        deliveryCoordinates={{
          latitude: deliveryLatitude,
          longitude: deliveryLongitude
        }}
        deliveryAddress={deliveryAddress}
        isOpen={modal.currentModal === 'delivery-distance'}
        onClose={modal.close}
      />
    </>
  );
};
