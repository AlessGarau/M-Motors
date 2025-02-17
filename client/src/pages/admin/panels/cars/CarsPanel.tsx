import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { List } from "../../common/list";
import { CarListResponse } from "./types";
import { columns } from "./CarsColumn";
import { DataTablePagination } from "../../common/pagination";

const fetchCarData = async (
  pageIndex: number,
  pageSize: number
): Promise<CarListResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}car/?page=${
      pageIndex + 1
    }&page_size=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

function CarsPanel() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex, pageSize } = pagination;

  const { data, error, isLoading } = useQuery<CarListResponse>({
    queryKey: ["cars", pageIndex, pageSize],
    queryFn: () => fetchCarData(pageIndex, pageSize),
  });

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.count ? Math.ceil(data.count / pageSize) : 1,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div>
      <h1 className="text-xl font-bold pb-3">List</h1>

      {isLoading && (
        <div className="flex justify-center items-center">
          <span>Loading...</span>
        </div>
      )}

      {error && (
        <div className="text-red-600">
          <p>Error: {error.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          <List table={table} />
          <DataTablePagination table={table} setPagination={setPagination} />
        </>
      )}
    </div>
  );
}

export default CarsPanel;
