// Import necessary hooks and components
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
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

const fetchCarById = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}car/${id}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch car details");
  }
  return response.json();
};

const saveCar = async (formData: FormData, id?: string) => {
  const url = id
    ? `${import.meta.env.VITE_API_URL}car/${id}/`
    : `${import.meta.env.VITE_API_URL}car/`;

  const response = await fetchWithAuth(url, {
    method: id ? "PUT" : "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to save car");
  }

  return response.json();
};

export default function CarsForm() {
  const { id } = useParams<{ id: string }>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      service_type: "SALE",
      brand: "",
      model: "",
      year: "",
      kilometers: "",
      price: "",
      image: null,
    },
  });

  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ["car", id],
    queryFn: () => (id ? fetchCarById(id) : null),
    enabled: !!id,
  });

  useEffect(() => {
    if (isSuccess) {
      Object.keys(data).forEach((key) => setValue(key as any, data[key]));
      if (data.image) {
        setImagePreview(data.image);
      }
    }
  }, [isSuccess]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => saveCar(formData, id),
    onSuccess: () => {
      toast({
        description: id
          ? "Car updated successfully!"
          : "Car added successfully!",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Please try again.",
        description: "Failed to save car.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (formValues: any) => {
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key === "image" && formValues.image instanceof File) {
        formData.append(key, formValues.image);
      } else {
        formData.append(key, formValues[key]);
      }
    });

    mutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file as any);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (isLoading) return <p>Loading car details...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit Car" : "Add Car"}</h1>
      <Separator className="mb-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Service Type Dropdown */}
        <div>
          <Label>Service Type</Label>
          <Select
            onValueChange={(value) => setValue("service_type", value)}
            defaultValue="SALE"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SALE">Sale</SelectItem>
              <SelectItem value="RENTAL">Rental</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div>
          <Label>Brand</Label>
          <Input
            type="text"
            {...register("brand", { required: "Brand is required" })}
          />
          {errors.brand && (
            <p className="text-red-500">{errors.brand.message}</p>
          )}
        </div>

        {/* Model */}
        <div>
          <Label>Model</Label>
          <Input
            type="text"
            {...register("model", { required: "Model is required" })}
          />
          {errors.model && (
            <p className="text-red-500">{errors.model.message}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <Label>Year</Label>
          <Input
            type="number"
            {...register("year", { required: "Year is required", min: 1886 })}
          />
          {errors.year && <p className="text-red-500">{errors.year.message}</p>}
        </div>

        {/* Kilometers */}
        <div>
          <Label>Kilometers</Label>
          <Input
            type="number"
            {...register("kilometers", {
              required: "Kilometers are required",
              min: 0,
            })}
          />
          {errors.kilometers && (
            <p className="text-red-500">{errors.kilometers.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            {...register("price", { required: "Price is required", min: 0 })}
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <Label>Car Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />

          {/* Show current image if available */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-gray-500 text-sm">Current Image:</p>
              <img
                src={imagePreview}
                alt="Car"
                className="mt-2 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : id ? "Update Car" : "Add Car"}
        </Button>
      </form>
    </Card>
  );
}
