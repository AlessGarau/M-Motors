import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
} from "@tanstack/react-table";
import { List } from "../../common/list";
import { ContractListResponse } from "./types";
import { columns } from "./ContractsColumn";
import { DataTablePagination } from "../../common/pagination";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { fetchWithAuth } from "@/lib/queries";

const fetchContractData = async (
    pageIndex: number,
    pageSize: number
): Promise<ContractListResponse> => {
    const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}contract/?page=${
            pageIndex + 1
        }&page_size=${pageSize}&admin=true`,
        {
            credentials: "include",
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch contracts data");
    }
    return response.json();
};

function ContractsPanel() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const navigate = useNavigate();

    const { pageIndex, pageSize } = pagination;

    const { data, error, isLoading, refetch } = useQuery<ContractListResponse>({
        queryKey: ["contracts", pageIndex, pageSize],
        queryFn: () => fetchContractData(pageIndex, pageSize),
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
                            onClick={() =>
                                row.original.id && handleUpdate(row.original.id)
                            }
                        >
                            Update Status
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                row.original.id && handleDelete(row.original.id)
                            }
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
            await fetchWithAuth(
                `${import.meta.env.VITE_API_URL}contract/${id}/`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            refetch();
        } catch (error) {
            console.error("Failed to delete contract", error);
        }
    };

    const handleUpdate = (id: number) => {
        console.log("Navigating to update form for contract ID:", id);
        navigate(`/admin/contracts/update/${id}?admin=true`);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Contracts Management</h1>

            {isLoading && (
                <div className="flex justify-center items-center">
                    <span>Loading contracts...</span>
                </div>
            )}

            {error && (
                <div className="text-red-600">
                    <p>Error: {error.message}</p>
                    <button onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !error && data && (
                <>
                    <List table={table} />
                    <DataTablePagination
                        table={table}
                        setPagination={setPagination}
                    />
                </>
            )}
        </div>
    );
}

export default ContractsPanel;
