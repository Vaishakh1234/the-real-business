"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

interface DataTablePaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

export function DataTablePagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  isLoading,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(total / limit);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pageBtnClass =
    "h-9 w-9 min-h-[44px] min-w-[44px] sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0";

  return (
    <div className="flex flex-col gap-2 border-t border-admin-card-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3">
      {/* Mobile: one compact row (rows + count); wraps only if needed. Desktop: same row, more spacing. */}
      <div className="flex min-w-0 w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 sm:w-auto sm:flex-1 sm:justify-start sm:gap-x-6">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-xs whitespace-nowrap sm:text-sm">
            Rows per page
          </p>
          <Select
            value={String(limit)}
            onValueChange={(v) => {
              onLimitChange(Number(v));
              onPageChange(1);
            }}
            disabled={isLoading}
          >
            <SelectTrigger
              className="h-9 w-[4rem] min-h-[44px] sm:h-8 sm:min-h-0 sm:w-[4.25rem]"
              aria-label="Rows per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground text-xs tabular-nums sm:text-sm">
          Showing {start}–{end} of {total}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:shrink-0 sm:justify-end">
        <Button
          variant="outline"
          size="icon"
          className={pageBtnClass}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {totalPages <= 5 ? (
          Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "default" : "outline"}
              size="icon"
              className={pageBtnClass}
              onClick={() => onPageChange(i + 1)}
              disabled={isLoading}
              aria-label={`Page ${i + 1}`}
              aria-current={page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </Button>
          ))
        ) : (
          <>
            <Button
              variant={page === 1 ? "default" : "outline"}
              size="icon"
              className={pageBtnClass}
              onClick={() => onPageChange(1)}
              disabled={isLoading}
              aria-label="Page 1"
            >
              1
            </Button>
            {page > 3 && (
              <div className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            {page > 2 && page < totalPages - 1 && (
              <Button
                variant="default"
                size="icon"
                className={pageBtnClass}
                disabled={isLoading}
                aria-label={`Page ${page}`}
              >
                {page}
              </Button>
            )}

            {page < totalPages - 2 && (
              <div className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <Button
              variant={page === totalPages ? "default" : "outline"}
              size="icon"
              className={pageBtnClass}
              onClick={() => onPageChange(totalPages)}
              disabled={isLoading}
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          className={pageBtnClass}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
