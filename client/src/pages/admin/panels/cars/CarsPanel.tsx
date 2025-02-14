import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { List } from "../../common/list";
import { CarListResponse } from "./types";
import { columns } from "./CarsColumn";
import { DataTablePagination } from "../../common/pagination";

function CarsPanel() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Default rows per page

  const { data, error, isLoading } = useQuery<CarListResponse>({
    queryKey: ["car", pageIndex, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}car/?page=${
          pageIndex + 1
        }&page_size=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: data?.count ? Math.ceil(data.count / pageSize) : 1,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold">Cars List</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading data.</p>}

      {!isLoading && !error && (
        <>
          <List data={table.getRowModel().rows.map((row) => row.original)} columns={columns} />
          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}

export default CarsPanel;
