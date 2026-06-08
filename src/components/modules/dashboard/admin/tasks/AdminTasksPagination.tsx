"use client";

import { Pagination } from "@/components/ui/pagination";

interface AdminTasksPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function AdminTasksPagination({
    currentPage,
    totalPages,
    onPageChange,
}: AdminTasksPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}