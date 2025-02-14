export type ListResponse<T> = {
    results: T[]
    next: string;
    previous: string;
    count: number;
  }
  