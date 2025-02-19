import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CarInfiniteResponse, CarListResponse } from "../admin/panels/cars/types";


const fetchCarData = async ({ pageParam = 1 }): Promise<CarListResponse> => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}car/?page=${pageParam}&page_size=10`,
        { credentials: "include" }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return response.json();
};

function CarsList() {
    const navigate = useNavigate();
    const { ref, inView } = useInView();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery<CarListResponse, Error, CarInfiniteResponse, CarListResponse[], number>({
        queryKey: ["cars"],
        queryFn: ({ pageParam = 1 }) => fetchCarData({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.next ? allPages.length + 1 : undefined;
        },
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);


    return (
        <div>

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
                <div className="flex flex-wrap gap-2 justify-center">
                    {data?.pages.flatMap(page => page.results).map((car: Car) => (
                        <Card className="w-1/3 shadow rounded flex items-center">
                            <CardHeader>
                                <CardTitle>{car.brand} - {car.model}</CardTitle>
                                <CardDescription>
                                    <ul>
                                        <li>Kilometers: {car.kilometers}</li>
                                        <li>Price: {car.price} €</li>
                                        <li>Type: {car.service_type === "RENTAL" ? "rental" : "sale"}</li>
                                        <li>Year: {car.year}</li>
                                    </ul>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {car.image && <img src={car.image} alt="" />}
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => navigate(`/contract/${car.id}`)}>
                                    Apply for the car
                                </Button>
                            </CardFooter>
                        </Card>

                    ))}
                </div>
            )}
            <div ref={ref} className="flex justify-center items-center mt-4">
                {isFetchingNextPage && <span>Loading more...</span>}
            </div>
        </div>
    );
}

export default CarsList;
