import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchWithAuth } from "@/lib/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import { Contract, ContractResponse } from "./types";

const fetchUserContracts = async (
  pageParam = 1
): Promise<ContractResponse> => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}contract/?page=${pageParam}&page_size=10`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contracts");
  }

  return response.json();
};

const downloadContractPDF = async (contractId: number) => {
  try {
    const response = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}contract/${contractId}/download/`
    );

    if (!response.ok) {
      throw new Error("Failed to download PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `contract_${contractId}.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};

export function ClientContracts() {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<ContractResponse, Error>({
    queryKey: ["contracts"],
    queryFn: ({ pageParam = 1 }) => fetchUserContracts(pageParam as number),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.next
        ? new URL(lastPage.next).searchParams.get("page")
        : null;
      return nextPage ? Number(nextPage) : undefined;
    },
    initialPageParam: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <span>Loading...</span>
      </div>
    );

  if (error instanceof Error)
    return (
      <div className="text-red-600">
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );

  const handleUpdate = (contractId: number) => {
    navigate(`/contracts/update/${contractId}`);
  };

  const handleDelete = async (contractId: number) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}contract/${contractId}/`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete contract");
      } else {
        window.location.reload();
      }

    } catch (error) {
      console.error("Error deleting Contract:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contracts</h1>
      <Separator className="mb-4" />

      {data?.pages?.flatMap((page) => page.results).length ? (
        <div className="flex flex-wrap gap-4 justify-center w-full">
          {data.pages
            .flatMap((page: ContractResponse) => page.results)
            .map((contract: Contract) => (
              <Card
                className="w-1/3 shadow rounded flex flex-col items-center"
                key={contract.id}
              >
                <CardHeader>
                  <CardTitle>Contract #{contract.id}</CardTitle>
                  <CardDescription>
                    <ul>
                      <li>Status: {contract.status}</li>
                      <li>
                        Start Date:{" "}
                        {new Date(contract.start_date).toLocaleDateString()}
                      </li>
                      <li>
                        End Date:{" "}
                        {new Date(contract.end_date).toLocaleDateString()}
                      </li>
                    </ul>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contract.pdf_file ? (
                    <div className="flex flex-wrap items-center gap-1">
                      <Button
                        variant={"outline"}
                        onClick={() => handleUpdate(contract.id)}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => downloadContractPDF(contract.id)}
                      >
                        Download PDF
                      </Button>
                      <Button
                        onClick={() => handleDelete(contract.id)}
                        variant={"destructive"}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">No PDF available</p>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <p className="text-gray-500">No contracts found.</p>
      )}

      <div ref={ref} className="flex justify-center items-center mt-4">
        {isFetchingNextPage && <span>Loading more...</span>}
      </div>
    </div>
  );
}
