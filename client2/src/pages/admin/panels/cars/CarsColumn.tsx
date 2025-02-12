import { ColumnDef } from "@tanstack/react-table";
import { Car } from "./types";

export const columns: ColumnDef<Car>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "service_type", header: "Service Type" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "year", header: "Year" },
  { accessorKey: "kilometers", header: "Kilometers" },
  { accessorKey: "price", header: "Price ($)" },
];
