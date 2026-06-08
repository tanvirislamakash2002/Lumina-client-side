"use client";

import { Pagination } from "@/components/ui/pagination";

interface AdminLogsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function AdminLogsPagination({
    currentPage,
    totalPages,
    onPageChange,
}: AdminLogsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}