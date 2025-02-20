import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
} from "@tanstack/react-table";
import { List } from "../../common/list";
import { Contract, ContractListResponse } from "./types";
import { columns } from "./ContractsColumn";
import { DataTablePagination } from "../../common/pagination";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    const data = await response.json();
    console.log("Données récupérées depuis l'API :", data);
    return data;
};

const updateContractStatus = async (id: number, status: string) => {
    const url = `${import.meta.env.VITE_API_URL}contract/${id}/?admin=true`;

    const response = await fetchWithAuth(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        console.error(
            "Failed to update contract status. Status:",
            response.status
        );
        const errorMessage = await response.text();
        console.error("Response:", errorMessage);
        throw new Error(
            `Failed to update contract status. Status: ${response.status}`
        );
    }
    return response.json();
};

function ContractsPanel() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { pageIndex, pageSize } = pagination;
    const queryClient = useQueryClient();

    const { data, error, isLoading, refetch } = useQuery<ContractListResponse>({
        queryKey: ["contracts", pageIndex, pageSize],
        queryFn: () => fetchContractData(pageIndex, pageSize),
    });

    const mutation = useMutation({
        mutationFn: (variables: { id: number; status: string }) =>
            updateContractStatus(variables.id, variables.status),
        onSuccess: (updatedContract: Contract) => {
            queryClient.setQueryData<ContractListResponse>(
                ["contracts", pageIndex, pageSize],
                (oldData) => {
                    if (!oldData) return oldData;

                    const updatedResults = oldData.results.map((contract) =>
                        contract.id === updatedContract.id
                            ? { ...contract, status: updatedContract.status }
                            : contract
                    );

                    return { ...oldData, results: updatedResults };
                }
            );
        },
    });

    const table = useReactTable({
        data: data?.results || [],
        columns: [
            ...columns,
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Select
                            onValueChange={(value) =>
                                row.original.id &&
                                mutation.mutate({
                                    id: row.original.id,
                                    status: value,
                                })
                            }
                            value={row.original.status}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVE">Approve</SelectItem>
                                <SelectItem value="REJECTED">
                                    Rejected
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                `${import.meta.env.VITE_API_URL}contract/${id}/?admin=true`,
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

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Contracts Management
                </CardTitle>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent>
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <span>Loading contracts...</span>
                    </div>
                )}

                {error && (
                    <div className="text-red-600">
                        <p>Error: {error.message}</p>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
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
            </CardContent>
        </Card>
    );
}

export default ContractsPanel;
