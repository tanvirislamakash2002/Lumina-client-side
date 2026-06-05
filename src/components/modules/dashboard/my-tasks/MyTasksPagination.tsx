"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";

interface MyTasksPaginationProps {
    currentPage: number;
    totalPages: number;
}

export function MyTasksPagination({ currentPage, totalPages }: MyTasksPaginationProps) {
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