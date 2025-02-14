import { ColumnDef } from "@tanstack/react-table";
import { Car } from "./types";
// import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Car>[] = [
  // {
  //   accessorKey: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  { accessorKey: "id", header: "ID" },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "service_type", header: "Service Type" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "year", header: "Year" },
  { accessorKey: "kilometers", header: "Kilometers" },
  { accessorKey: "price", header: "Price ($)" },
];
