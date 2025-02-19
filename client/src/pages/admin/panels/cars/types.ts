import { InfiniteQueryResponse, ListResponse } from "../../common/types";

export type Car = {
  id: number;
  brand: string;
  service_type: string;
  model: string;
  year: number;
  kilometers: number;
  price: number;
  image: string;
};
export type CarResponse = Car;
export type CarListResponse = ListResponse<Car>
export type CarInfiniteResponse = InfiniteQueryResponse<Car>

