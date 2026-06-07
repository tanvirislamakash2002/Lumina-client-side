"use client";

import { Pagination } from "@/components/ui/pagination";

interface TeamPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function TeamPagination({
    currentPage,
    totalPages,
    onPageChange,
}: TeamPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}