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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { fetchWithAuth } from "@/lib/queries";

const fetchCarData = async (
  pageIndex: number,
  pageSize: number
): Promise<CarListResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}car/?page=${
      pageIndex + 1
    }&page_size=${pageSize}`,
    {
      credentials: "include",
    }
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
  const navigate = useNavigate();

  const { pageIndex, pageSize } = pagination;

  const { data, error, isLoading, refetch } = useQuery<CarListResponse>({
    queryKey: ["cars", pageIndex, pageSize],
    queryFn: () => fetchCarData(pageIndex, pageSize),
  });

  const table = useReactTable({
    data: data?.results || [],
    columns: [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => row.original.id && handleUpdate(row.original.id)}
            >
              Update
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => row.original.id && handleDelete(row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.count ? Math.ceil(data.count / pageSize) : 1,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const handleDelete = async (id: number) => {
    try {
      await fetchWithAuth(`${import.meta.env.VITE_API_URL}car/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleUpdate = (id: number) => {
    navigate("/admin/cars/update/" + id);
  };

  const handleCreate = () => {
    navigate("/admin/cars/create/");
  };

  return (
    <div>
      <div className=" pb-3">
        <Button onClick={handleCreate} className="">
          Create
        </Button>
      </div>

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
