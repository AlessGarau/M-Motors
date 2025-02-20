import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/queries";

const fetchContractById = async (id: string, isAdmin: boolean) => {
    const url = isAdmin
        ? `${import.meta.env.VITE_API_URL}contract/${id}/?admin=true`
        : `${import.meta.env.VITE_API_URL}contract/${id}/`;

    const response = await fetchWithAuth(url);
    if (!response.ok) {
        throw new Error("Failed to fetch contract details");
    }
    return response.json();
};

const updateContractStatus = async (id: string, status: string) => {
    const url = `${import.meta.env.VITE_API_URL}contract/${id}/?admin=true`;

    const response = await fetchWithAuth(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Failed to update contract status");
    }

    return response.json();
};

export default function ContractsForm() {
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();

    const isAdmin = window.location.search.includes("admin=true");

    const {
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            status: "",
        },
    });

    const { data, error, isLoading, isSuccess } = useQuery({
        queryKey: ["contract", id],
        queryFn: () => (id ? fetchContractById(id, isAdmin) : null),
        enabled: !!id,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setValue("status", data.status);
        }
    }, [isSuccess, data, setValue]);

    const mutation = useMutation({
        mutationFn: (status: string) =>
            updateContractStatus(id as string, status),
        onSuccess: () => {
            toast({
                description: "Contract status updated successfully!",
                variant: "default",
            });
        },
        onError: () => {
            toast({
                title: "Please try again.",
                description: "Failed to update contract status.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = async (formValues: any) => {
        if (isAdmin) {
            mutation.mutate(formValues.status);
        }
    };

    if (isLoading) return <p>Loading contract details...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <Card className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Update Contract Status</h1>
            <Separator className="mb-4" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {isAdmin ? (
                    <div>
                        <Label>Status</Label>
                        <Select
                            onValueChange={(value) => setValue("status", value)}
                            defaultValue={data?.status}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVE">Approve</SelectItem>
                                <SelectItem value="REJECTED">
                                    Rejected
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <p className="text-gray-500">
                        Status: <strong>{data?.status}</strong>
                    </p>
                )}

                {isAdmin && (
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? "Updating..." : "Update Status"}
                    </Button>
                )}
            </form>
        </Card>
    );
}
