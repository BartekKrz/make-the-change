import Link from 'next/link'
import { FC } from 'react'

const OrderNotFound: FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-2">Commande introuvable</h1>
      <p className="text-sm text-gray-600 mb-4">Vérifiez l&apos;identifiant et réessayez.</p>
      <Link href="/admin/orders" className="text-primary text-sm">← Retour aux commandes</Link>
    </div>
  )
}

export default OrderNotFound
