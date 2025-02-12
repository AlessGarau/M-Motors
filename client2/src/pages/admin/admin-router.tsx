import { Outlet, useLocation } from "react-router-dom";
import CarsPanel from "./panels/cars/CarsPanel";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";

export const adminRouter = [
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "cars",
        element: <CarsPanel />,
      },
    ],
  },
];

function AdminLayout() {
  const location = useLocation();
  const resourceName = location.pathname
    .split("admin")?.[1]
    .replace("/", " ")
    .trim();
  const displayName =
    resourceName[0].toLocaleUpperCase() + resourceName.substring(1);
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
                    Gestion des resources M-Motors
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
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
