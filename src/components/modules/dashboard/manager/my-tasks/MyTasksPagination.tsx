"use client";

import { Pagination } from "@/components/ui/pagination";

interface MyTasksPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function MyTasksPagination({
    currentPage,
    totalPages,
    onPageChange,
}: MyTasksPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}