import { ColumnDef } from "@tanstack/react-table";
import { Car } from "./types";
// import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Car>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "service_type", header: "Service Type" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "year", header: "Year" },
  { accessorKey: "kilometers", header: "Kilometers" },
  { accessorKey: "price", header: "Price ($)" },
];
