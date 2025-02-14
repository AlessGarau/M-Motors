import { ListResponse } from "../../common/types";

export type Car = {
  id: number;
  brand: string;
  service_type: string;
  model: string;
  year: number;
  kilometers: number;
  price: number;
};
export type CarResponse = Car;
export type CarListResponse = ListResponse<Car>

