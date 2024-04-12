import { Event } from '@prisma/client';

export interface PaginationResultsProps {
  status: string;
  payload: Event[];
  page: number;
  docs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  prevLink: string | null;
  nextLink: string | null;
}
