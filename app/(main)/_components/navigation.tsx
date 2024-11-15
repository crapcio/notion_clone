"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, MenuIcon, Plus, PlusCircle, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";

const Navigation = () => {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.documents.create);

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    const documents = useQuery(api.documents.get);
    useEffect (() => {
        if (isMobile){
            collapse();
        }else{
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile){
            collapse();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp); // исправлено
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = e.clientX;

        // Ограничиваем ширину
        newWidth = Math.min(480, Math.max(240, newWidth));

        // Изменение стилей sidebar и navbar
        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.left = `${newWidth}px`;
            navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
        }
    };

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp); // удаление события mouseup
    };

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current){
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty(
                "width",
                isMobile ? "0": "calc(100% - 240px)",
            );
            navbarRef.current.style.setProperty(
                "left",
                isMobile ? "100%" : "240px",
            );
            setTimeout(() => setIsResetting(false), 300);
        }
    }

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current){
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0%");
            setTimeout(() => setIsResetting(false), 300)
        }
    }

    const handleCreate = () => {
        const promise = create({title: "Untitled"})


        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!", 
            error: "Failed to create a new note."
        });
    }

    return ( 
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile ? "w-0" : "w-60" // Устанавливаем начальную ширину в зависимости от isMobile
                )}
            >
                <div
                    role="button"
                    onClick={collapse}
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 transition",
                        isMobile ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"
                    )}
                >
                    <ChevronLeft className="h-6 w-6"/>  
                </div>

                {/* Контент навигации */}
                <div>
                    <UserItem />
                    <Item 
                    label="Search"
                    icon={Search}
                    isSearch
                    onClick={() => {}}
                    />
                    <Item 
                    label="Settings"
                    icon={Settings}
                    
                    onClick={() => {}}
                    />
                    <Item onClick={handleCreate} label="New page" icon={PlusCircle}/>
                </div>
                <div className="mt-4">
                        <DocumentList />
                        <Item 
                        onClick={handleCreate}
                        icon={Plus}
                        label="Add a page"
                        />
                </div>

                {/* Обработчик изменения размера */}
                <div
                    onMouseDown={handleMouseDown} // обработчик для начала изменения размера
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>

            {/* Navbar */}
            <div
                
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[99999]",
                    isMobile ? "left-0 w-full" : "left-60 w-[calc(100%-240px)]",
                    isResetting && "transition-all ease-in-out duration-300"
                )}
            >
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && <MenuIcon onClick={resetWidth} className="h-6 w-6 text-muted-foreground"/>}
                </nav>
            </div>
        </>
    );
}

export default Navigation;
