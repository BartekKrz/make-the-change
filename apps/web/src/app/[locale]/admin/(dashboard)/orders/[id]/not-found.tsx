import Link from 'next/link';
import { type FC } from 'react';

const OrderNotFound: FC = () => {
  return (
    <div className="p-8">
      <h1 className="mb-2 text-xl font-semibold">Commande introuvable</h1>
      <p className="mb-4 text-sm text-gray-600">
        Vérifiez l&apos;identifiant et réessayez.
      </p>
      <Link className="text-primary text-sm" href="/admin/orders">
        ← Retour aux commandes
      </Link>
    </div>
  );
};

export default OrderNotFound;
