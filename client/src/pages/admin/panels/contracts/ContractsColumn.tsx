import { ColumnDef } from "@tanstack/react-table";
import { Contract } from "./types";

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString(),
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString(),
  }
];
