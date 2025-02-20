import CarsList from "./CarsList";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ClientSidebar } from "@/components/client-sidebar";
import { ClientContracts } from "./ClientContracts";
import ProtectedRoute from "../protected/ProtectedRoute";


export const clientRouter = [
    {
        path: "/",
        element: <ClientLayout />,
        children: [
            {
                path: "/",
                element: < CarsList />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/contracts",
                        element: < ClientContracts />,
                    },
                    {
                        path: "/contract/:id",
                        element: < ClientContracts />,
                    },
                ]
            }

        ],
    },
];

function ClientLayout() {
    const location = useLocation();
    const resourceName = location.pathname
    const displayName = resourceName
        ? resourceName[0].toLocaleUpperCase() + resourceName.substring(1)
        : "";
    return (
        <>
            <SidebarProvider>
                <ClientSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        M-Motors Cars
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {resourceName && resourceName != "/" && (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{displayName}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    <div className="p-3">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster />
        </>
    );
}
