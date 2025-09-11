'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { type FC } from 'react';

type PaginationData = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type MinimalPaginationProps = {
  pagination?: PaginationData;
  className?: string;
  onPageChange?: (page: number) => void;
};

export const MinimalPagination: FC<MinimalPaginationProps> = ({ pagination, className = '', onPageChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pagination) return null;

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const { currentPage, totalPages, totalItems } = pagination;

  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col py-4 px-4 sm:px-6 md:px-8 sm:flex-row items-center justify-between gap-2 sm:gap-4 ${className} border-t border-border shadow-2xl  w-full`}
    >
      {}
      <div className='hidden sm:block text-sm text-muted-foreground'>
        Page {currentPage} sur {totalPages} • {totalItems.toLocaleString()} éléments
      </div>

      {}
      <div className='flex items-center gap-1'>
        {}
        <button
          aria-label='Page précédente'
          className='group cursor-pointer flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors rounded-md hover:bg-muted/40'
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='hidden sm:inline'>Précédent</span>
        </button>

        {}
        <div className='hidden sm:flex items-center gap-1 mx-2'>
          {generatePageNumbers().map((page, index) =>
            page === 'ellipsis' ? (
              <div key={`ellipsis-${index}`} className='flex h-8 w-8 items-center justify-center text-muted-foreground'>
                <MoreHorizontal className='h-4 w-4' />
              </div>
            ) : (
              <button
                key={page}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={`Page ${page}`}
                className={`h-8 cursor-pointer w-8 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  currentPage === page
                    ? 'bg-gradient-to-br from-primary via-primary/90 to-orange-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {}
                {currentPage === page && (
                  <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none' />
                )}
                <span className='relative z-10'>{page}</span>
              </button>
            )
          )}
        </div>

        {}
        <div className='flex sm:hidden items-center px-2 py-1 text-sm text-muted-foreground'>
          {currentPage} / {totalPages}
        </div>

        {}
        <button
          aria-label='Page suivante'
          className='group cursor-pointer flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors rounded-md hover:bg-muted/40'
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <span className='hidden sm:inline'>Suivant</span>
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>

      {}
      <div className='sm:hidden text-xs text-muted-foreground text-center leading-none'>
        {totalItems.toLocaleString()} éléments
      </div>
    </div>
  );
};

type DisabledPaginationProps = {
  currentPage?: number;
  className?: string;
};

export const DisabledPagination: FC<DisabledPaginationProps> = ({ currentPage = 1, className = '' }) => {
  return (
    <div
      className={`flex flex-col py-4 px-4 sm:px-6 md:px-8 sm:flex-row items-center justify-between gap-2 sm:gap-4 ${className} border-t border-border shadow-2xl w-full`}
    >
      {}
      <div className='hidden sm:block text-sm text-muted-foreground/60'>Page {currentPage} • Chargement...</div>

      {}
      <div className='flex items-center gap-1'>
        {}
        <div className='flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-sm text-muted-foreground/50 rounded-md pointer-events-none opacity-50'>
          <ChevronLeft className='h-4 w-4' />
          <span className='hidden sm:inline'>Précédent</span>
        </div>

        {}
        <div className='hidden sm:flex items-center gap-1 mx-2'>
          {currentPage > 1 && (
            <div className='h-8 w-8 rounded-md text-sm font-medium text-muted-foreground/40 flex items-center justify-center'>
              {currentPage - 1}
            </div>
          )}

          {}
          <div className='h-8 w-8 rounded-md text-sm font-medium bg-gradient-to-br from-primary/60 via-primary/50 to-orange-500/60 text-white/80 flex items-center justify-center shadow-lg shadow-primary/15 relative overflow-hidden'>
            {}
            <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none' />
            <span className='relative z-10'>{currentPage}</span>
          </div>

          {currentPage < 10 && (
            <div className='h-8 w-8 rounded-md text-sm font-medium text-muted-foreground/40 flex items-center justify-center'>
              {currentPage + 1}
            </div>
          )}

          {}
          <div className='flex h-8 w-8 items-center justify-center text-muted-foreground/40'>
            <MoreHorizontal className='h-4 w-4' />
          </div>
        </div>

        {}
        <div className='flex sm:hidden items-center px-2 py-1 text-sm text-muted-foreground/60'>{currentPage} / ⋯</div>

        {}
        <div className='flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-sm text-muted-foreground/50 rounded-md pointer-events-none opacity-50'>
          <span className='hidden sm:inline'>Suivant</span>
          <ChevronRight className='h-4 w-4' />
        </div>
      </div>

      {}
      <div className='sm:hidden text-xs text-muted-foreground/60 text-center leading-none'>
        Chargement des données...
      </div>
    </div>
  );
};
