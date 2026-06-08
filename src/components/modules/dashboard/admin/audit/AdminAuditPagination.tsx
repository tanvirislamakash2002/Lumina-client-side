"use client";

import { Pagination } from "@/components/ui/pagination";

interface AdminAuditPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function AdminAuditPagination({
    currentPage,
    totalPages,
    onPageChange,
}: AdminAuditPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}