"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";

interface TasksPaginationProps {
    currentPage: number;
    totalPages: number;
}

export function TasksPagination({ currentPage, totalPages }: TasksPaginationProps) {
    const router = useRouter();

    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set("page", page.toString());
        router.push(url.pathname + url.search);
    };

    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
}