import { QrCode } from '@prisma/client';

export interface PaginationResultsProps {
  status: string;
  payload: QrCode[];
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
