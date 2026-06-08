"use client";

import { Pagination } from "@/components/ui/pagination";

interface AdminProjectsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function AdminProjectsPagination({
    currentPage,
    totalPages,
    onPageChange,
}: AdminProjectsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}