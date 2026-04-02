export abstract class PaginatedModel<T> {
  items!: T[];
  empty!: boolean;
  filter!: string;
  orderBy!: string;
  page!: number;
  pageSize!: number;
  totalPages!: number;
  totalResults!: number;
  metaData!: Record<string, any>;
}
