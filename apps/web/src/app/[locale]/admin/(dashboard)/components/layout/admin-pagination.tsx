'use client'

import { type FC } from 'react'
import { MinimalPagination } from '@/app/[locale]/admin/(dashboard)/components/ui/minimal-pagination'

type PaginationInfo = {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

type AdminPaginationProps = {
  pagination: PaginationInfo
  className?: string
}

export const AdminPagination: FC<AdminPaginationProps> = ({
  pagination,
  className = ''
}) => (
  <div className={`mt-6 ${className}`}>
    <MinimalPagination pagination={pagination} />
  </div>
)
