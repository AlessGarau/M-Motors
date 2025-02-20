import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const fetchCarById = async (id: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}car/${id}/`);
    if (!response.ok) {
        throw new Error("Failed to fetch car details");
    }
    return response.json();
};

const fetchContractById = async (id: string) => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}contract/${id}/`);
    if (!response.ok) {
        throw new Error("Failed to fetch contract details");
    }
    return response.json();
};

const saveContract = async (formData: FormData, id?: string) => {
    const url = id
        ? `${import.meta.env.VITE_API_URL}contract/${id}/`
        : `${import.meta.env.VITE_API_URL}contract/`;

    const response = await fetchWithAuth(url, {
        method: id ? "PUT" : "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to save contract");
    }

    return response.json();
};

const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
};

interface ICar {
    id: string;
    brand: string;
    image: null;
    kilometers: number;
    model: string;
    price: number;
    service_type: string;
    year: number;
}

export default function ContractsForm() {
    const { id } = useParams<{ id: string }>();
    const [car, setCar] = useState<ICar | null>(null);
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const { toast } = useToast();
    const [checkboxValues, setCheckboxValues] = useState({
        sav_included: false,
        assistance_included: false,
        assurance_included: false,
        technical_inspection_included: false,
        purchase_option: false,
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            car: 0,
            start_date: "",
            end_date: "",
            sav_included: false,
            assistance_included: false,
            assurance_included: false,
            technical_inspection_included: false,
            purchase_option: false,
        },
    });

    const { data, error, isLoading, isSuccess } = useQuery({
        queryKey: ["contract", id],
        queryFn: () => (id ? fetchContractById(id) : null),
        enabled: !!id,
    });

    useEffect(() => {
        if (isSuccess) {
            Object.keys(data).forEach((key) => setValue(key as any, data[key]));

            if (data.start_date) {
                const start = new Date(data.start_date);
                setStartDate(start);
                setValue("start_date", start.toLocaleDateString("en-CA"));
            }

            if (data.end_date) {
                const end = new Date(data.end_date);
                setEndDate(end);
                setValue("end_date", end.toLocaleDateString("en-CA"));
            }

            setCheckboxValues({
                sav_included: data.sav_included || false,
                assistance_included: data.assistance_included || false,
                assurance_included: data.assurance_included || false,
                technical_inspection_included: data.technical_inspection_included || false,
                purchase_option: data.purchase_option || false,
            });
        }

        if (data?.car) {
            fetchCarById(data.car).then((carData) => {
                setCar(carData);
            });
        } else {
            const carId = getQueryParam('carId');
            if (carId) {
                fetchCarById(carId).then((carData) => {
                    console.log(carData);
                    setCar(carData);
                });
            }
        }

    }, [isSuccess, data, setValue]);

    const mutation = useMutation({
        mutationFn: (formData: FormData) => saveContract(formData, id),
        onSuccess: () => {
            toast({
                description: id
                    ? "Contract updated successfully!"
                    : "Contract added successfully!",
                variant: "default",
            });
        },
        onError: () => {
            toast({
                title: "Please try again.",
                description: "Failed to save contract.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = async (formValues: any) => {
        const formData = new FormData();
        Object.keys(formValues).forEach((key) => {
            console.log(key, formValues[key]);
            formData.append(key, formValues[key]);
        });
        if (formData.has("id")) formData.delete("id");
        if (formData.has("status")) formData.delete("status");
        if (formData.has("pdf_file")) formData.delete("pdf_file");
        if (formData.has("created_at")) formData.delete("created_at");
        if (formData.has("updated_date")) formData.delete("updated_date");
        if (formData.has("user")) formData.delete("user");

        mutation.mutate(formData);
    };

    if (isLoading) return <p>Loading contract details...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <Card className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">{id ? "Edit Contract" : "New Contract"}</h1>
            <Separator className="mb-4" />
            <div className="flex flex-col gap-4 mb-4">
                <div>
                    <label className="font-bold ">Brand</label>
                    <Input
                        type="text"
                        value={car?.brand}
                        disabled
                        className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    />
                </div>
                <div>
                    <label className="font-bold ">Kilometers</label>
                    <Input
                        type="text"
                        value={car?.kilometers}
                        disabled
                        className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    />
                </div>
                <div>
                    <label className="font-bold ">Model</label>
                    <Input
                        type="text"
                        value={car?.model}
                        disabled
                        className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    />
                </div>
                <div>
                    <label className="font-bold ">Price</label>
                    <Input
                        type="text"
                        value={car?.price}
                        disabled
                        className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    />
                </div>
                <div>
                    <label className="font-bold ">Service Type</label>
                    <Input
                        type="text"
                        value={car?.service_type}
                        disabled
                        className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    />
                </div>
                <div>
                    <label className="font-bold ">Year</label>
                    <Input
                        type="text"
                        value={car?.year}
                        disabled
                        className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    />
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-bold">Contract start date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" {...register("start_date", { required: "Start Date is required" })}>
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => {
                                    setStartDate(date);
                                    setValue("start_date", date!.toLocaleDateString("en-CA"));
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.start_date && (
                        <p className="text-red-500">{errors.start_date.message}</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="font-bold">Contract end date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" {...register("end_date", { required: "End Date is required" })}>
                            <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={(date) => {
                                    setEndDate(date);
                                    setValue("end_date", date!.toLocaleDateString("en-CA"));
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.end_date && (
                        <p className="text-red-500">{errors.end_date.message}</p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="sav_included"
                        checked={checkboxValues.sav_included}
                        onCheckedChange={(value) => {
                            setCheckboxValues((prev) => ({ ...prev, sav_included: value as boolean }));
                            setValue("sav_included", value as boolean);
                        }}
                        {...register("sav_included")}
                    />
                    <label
                        htmlFor="sav_included"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >Maintenance and after-sales service included</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="assistance_included"
                        checked={checkboxValues.assistance_included}
                        onCheckedChange={(value) => {
                            setCheckboxValues((prev) => ({ ...prev, assistance_included: value as boolean }));
                            setValue("assistance_included", value as boolean);
                        }}
                        {...register("assistance_included")}
                    />
                    <label
                        htmlFor="assistance_included"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >Breakdown assistance included</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="assurance_included"
                        checked={checkboxValues.assurance_included}
                        onCheckedChange={(value) => {
                            setCheckboxValues((prev) => ({ ...prev, assurance_included: value as boolean }));
                            setValue("assurance_included", value as boolean);
                        }}
                        {...register("assurance_included")}
                    />
                    <label
                        htmlFor="assurance_included"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >All-risk insurance included</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="technical_inspection_included"
                        checked={checkboxValues.technical_inspection_included}
                        onCheckedChange={(value) => {
                            setCheckboxValues((prev) => ({ ...prev, technical_inspection_included: value as boolean }));
                            setValue("technical_inspection_included", value as boolean);
                        }}
                        {...register("technical_inspection_included")}
                    />
                    <label
                        htmlFor="technical_inspection_included"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >Technical inspection included</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="purchase_option"
                        checked={checkboxValues.purchase_option}
                        onCheckedChange={(value) => {
                            setCheckboxValues((prev) => ({ ...prev, purchase_option: value as boolean }));
                            setValue("purchase_option", value as boolean);
                        }}
                        {...register("purchase_option")}
                    />
                    <label
                        htmlFor="purchase_option"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >Purchase option included</label>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Saving..." : id ? "Update Contract" : "Add Contract"}
                </Button>
            </form>
        </Card>
    );
}
