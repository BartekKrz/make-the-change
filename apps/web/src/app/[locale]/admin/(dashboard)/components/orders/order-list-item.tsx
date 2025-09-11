'use client'

import {  User, Calendar, DollarSign } from 'lucide-react'

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import { formatDate, formatCurrency } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils'

import type { FC, ReactNode } from 'react'

type Order =  {
  id: string
  customerName: string
  status: string
  createdAt: string
  total: number | null
}

type OrderListItemProps =  {
  order: Order
  actions?: ReactNode
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': { return 'yellow'
    }
    case 'shipped': { return 'blue'
    }
    case 'delivered': { return 'green'
    }
    case 'cancelled': { return 'red'
    }
    default: { return 'gray'
    }
  }
}

export const OrderListItem: FC<OrderListItemProps> = ({ order, actions }) => {
  const header = (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
        #
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground truncate">
          Commande #{order.id.slice(0, 8)}
        </h3>
        <Badge color={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      </div>
    </div>
  )

  const metadata = (
    <div className="space-y-2">
      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <User className="w-4 h-4 text-primary/70 md:group-hover:text-primary group-active:text-primary transition-colors duration-200" />
        <span className="text-sm">{order.customerName}</span>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500/70" />
          <span className="text-sm">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <DollarSign className="w-4 h-4 text-green-500/70" />
          <span className="text-sm">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <AdminListItem
      actions={actions}
      header={header}
      href={`/admin/orders/${order.id}`}
      metadata={metadata}
    />
  )
}
