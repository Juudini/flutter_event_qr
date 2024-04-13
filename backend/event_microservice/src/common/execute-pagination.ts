export type Sort = 'asc' | 'desc';

interface ExecutePaginationProps {
  limit: number;
  page: number;
  sort: Sort;
  endpointName: string;
  docs: number;
  items: any;
}

export const executePagination = ({
  page,
  limit,
  sort,
  endpointName,
  docs,
  items,
}: ExecutePaginationProps) => {
  const baseUrl: string = `/api/${endpointName}?limit=${limit}&sort=${sort}`;

  const totalPages: number = Math.ceil(docs / limit);

  const hasPrevPage: boolean = page > 1;
  const hasNextPage: boolean = page < totalPages;

  const prevPage: number | null = hasPrevPage ? page - 1 : null;
  const nextPage: number | null = hasNextPage ? page + 1 : null;
  const status: number | string = items.length === 0 ? 'error' : 'success';
  const prevLink: string | null = hasPrevPage
    ? `${baseUrl}&page=${prevPage}`
    : null;
  const nextLink: string | null = hasNextPage
    ? `${baseUrl}&page=${nextPage}`
    : null;

  const results = {
    status,
    payload: items,
    page,
    docs,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    prevLink,
    nextLink,
  };

  if (page >= totalPages) {
    results.nextPage = null;
    results.nextLink = null;
  }
  if (status == 'error') {
    results.prevLink = null;
  }

  return results;
};
