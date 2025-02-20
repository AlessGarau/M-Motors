import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

type navItem = {
    title: string;
    url: string;
    items?: navItem[];
    isActive?: boolean;
};

const data: navItem[] = [
    { title: "Cars", url: "/" },
]

export function ClientSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isAdmin, user, handleLogout } = useAuth()
    const navigate = useNavigate()
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">M-Motors</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {user ? <Button onClick={handleLogout}>Logout</Button>: <Button onClick={() => navigate("/login")}>Login</Button>}
            </SidebarHeader>
            <SidebarContent className="gap-0">
                {/* We create a collapsible SidebarGroup for each parent. */}
                {data.map((item) => (
                    <SidebarMenu>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={item.isActive}
                                >
                                    <a href={item.url}>{item.title}</a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>

                        </SidebarMenuSub>
                    </SidebarMenu>
                ))}
                {user && <SidebarMenu>
                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                                asChild
                            >
                                <a href="/contracts">Contracts</a>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </SidebarMenu>
                }
                {isAdmin && <SidebarMenu>
                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                                asChild
                            >
                                <a href="/admin/cars">Admin page</a>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </SidebarMenu>
                }
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
