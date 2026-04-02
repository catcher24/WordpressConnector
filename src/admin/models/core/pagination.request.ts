export class PaginationRequest {
  filter?: string | undefined;
  orderBy?: string | undefined;
  page = 1;
  pageSize = 20;

  constructor(filter: string | undefined, orderBy: string | undefined, page: number, pageSize: number) {
    this.filter = filter;
    this.orderBy = orderBy;
    this.page = page;
    this.pageSize = pageSize;
  }

  static getCount(pageSize = 20): PaginationRequest {
    return new PaginationRequest("", "", 1, pageSize);
  }

  toSearchParams(): URLSearchParams {
    let params = new URLSearchParams();
    params.set('page', this.page.toString());
    params.set('pageSize', this.pageSize.toString());

    if (this.filter !== undefined && this.filter !== null && this.filter !== '') {
      params.set('filter', this.filter);
    }

    if (this.orderBy !== undefined && this.orderBy !== null && this.orderBy !== '') {
      params.set('orderBy', this.orderBy);
    }

    return params;
  }
}
