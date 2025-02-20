export type ListResponse<T> = {
  results: T[]
  next: string;
  previous: string;
  count: number;
}

export type InfiniteQueryResponse<T> = {
  pages: Array<Page<T>>
  pageParams: string;
}

export type Page<T> = {
  results: T[]
}
