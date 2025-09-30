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

export const MinimalPagination: FC<MinimalPaginationProps> = ({
  pagination,
  className = '',
  onPageChange,
}) => {
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
        pages.push(
          1,
          'ellipsis',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          'ellipsis',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          'ellipsis',
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:gap-4 sm:px-6 md:px-8 ${className} border-border w-full border-t shadow-2xl`}
    >
      {}
      <div className="text-muted-foreground hidden text-sm sm:block">
        Page {currentPage} sur {totalPages} • {totalItems.toLocaleString()}{' '}
        éléments
      </div>

      {}
      <div className="flex items-center gap-1">
        {}
        <button
          aria-label="Page précédente"
          className="group text-muted-foreground hover:text-foreground hover:bg-muted/40 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50 sm:px-3 sm:py-1.5"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        {}
        <div className="mx-2 hidden items-center gap-1 sm:flex">
          {generatePageNumbers().map((page, index) =>
            page === 'ellipsis' ? (
              <div
                key={`ellipsis-${index}`}
                className="text-muted-foreground flex h-8 w-8 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <button
                key={page}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={`Page ${page}`}
                className={`relative h-8 w-8 cursor-pointer overflow-hidden rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'from-primary via-primary/90 shadow-primary/25 hover:shadow-primary/30 bg-gradient-to-br to-orange-500 text-white shadow-lg hover:scale-105 hover:shadow-xl'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {}
                {currentPage === page && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20" />
                )}
                <span className="relative z-10">{page}</span>
              </button>
            )
          )}
        </div>

        {}
        <div className="text-muted-foreground flex items-center px-2 py-1 text-sm sm:hidden">
          {currentPage} / {totalPages}
        </div>

        {}
        <button
          aria-label="Page suivante"
          className="group text-muted-foreground hover:text-foreground hover:bg-muted/40 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50 sm:px-3 sm:py-1.5"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {}
      <div className="text-muted-foreground text-center text-xs leading-none sm:hidden">
        {totalItems.toLocaleString()} éléments
      </div>
    </div>
  );
};

type DisabledPaginationProps = {
  currentPage?: number;
  className?: string;
};

export const DisabledPagination: FC<DisabledPaginationProps> = ({
  currentPage = 1,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:gap-4 sm:px-6 md:px-8 ${className} border-border w-full border-t shadow-2xl`}
    >
      {}
      <div className="text-muted-foreground/60 hidden text-sm sm:block">
        Page {currentPage} • Chargement...
      </div>

      {}
      <div className="flex items-center gap-1">
        {}
        <div className="text-muted-foreground/50 pointer-events-none flex items-center gap-1 rounded-md px-2 py-1 text-sm opacity-50 sm:px-3 sm:py-1.5">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Précédent</span>
        </div>

        {}
        <div className="mx-2 hidden items-center gap-1 sm:flex">
          {currentPage > 1 && (
            <div className="text-muted-foreground/40 flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium">
              {currentPage - 1}
            </div>
          )}

          {}
          <div className="from-primary/60 via-primary/50 shadow-primary/15 relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br to-orange-500/60 text-sm font-medium text-white/80 shadow-lg">
            {}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20" />
            <span className="relative z-10">{currentPage}</span>
          </div>

          {currentPage < 10 && (
            <div className="text-muted-foreground/40 flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium">
              {currentPage + 1}
            </div>
          )}

          {}
          <div className="text-muted-foreground/40 flex h-8 w-8 items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
          </div>
        </div>

        {}
        <div className="text-muted-foreground/60 flex items-center px-2 py-1 text-sm sm:hidden">
          {currentPage} / ⋯
        </div>

        {}
        <div className="text-muted-foreground/50 pointer-events-none flex items-center gap-1 rounded-md px-2 py-1 text-sm opacity-50 sm:px-3 sm:py-1.5">
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      {}
      <div className="text-muted-foreground/60 text-center text-xs leading-none sm:hidden">
        Chargement des données...
      </div>
    </div>
  );
};
