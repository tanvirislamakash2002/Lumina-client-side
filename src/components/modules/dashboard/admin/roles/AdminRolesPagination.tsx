"use client";

import { Pagination } from "@/components/ui/pagination";

interface AdminRolesPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function AdminRolesPagination({
    currentPage,
    totalPages,
    onPageChange,
}: AdminRolesPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}