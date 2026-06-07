"use client";

import { Pagination } from "@/components/ui/pagination";

interface AdminUsersPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function AdminUsersPagination({
    currentPage,
    totalPages,
    onPageChange,
}: AdminUsersPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}