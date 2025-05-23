import { AppSidebar } from "@/components/app-sidebar";
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
import CarsPanel from "./panels/cars/CarsPanel";
import CarsForm from "./panels/cars/CarsForm";
import { Toaster } from "@/components/ui/toaster";
import ContractsPanel from "./panels/contracts/ContractsPanel";
import ContractsForm from "./panels/contracts/ContractsForm";
import AdminRoute from "../protected/AdminRoute";
import ChatInterface from "./rag-interface/RagInterface";

export const adminRouter = [
  {
    element: <AdminRoute />,
    children: [
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            path: "cars",
            element: <CarsPanel />,
          },
          {
            path: "cars/update/:id",
            element: <CarsForm />,
          },
          {
            path: "cars/create",
            element: <CarsForm />,
          },
          {
            path: "contracts",
            element: <ContractsPanel />,
          },
          {
            path: "contracts/update/:id",
            element: <ContractsForm />,
          },
          {
            path: "chat/",
            element: <ChatInterface />,
          },
        ],
      },]
  }
];

function AdminLayout() {
  const location = useLocation();
  const resourceName = location.pathname
    .split("admin")?.[1]
    .replace("/", " ")
    .trim()
    .split("/")
    .join(" ");
  const displayName = resourceName
    ? resourceName[0].toLocaleUpperCase() + resourceName.substring(1)
    : "";
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Managing M-Motors resources
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
