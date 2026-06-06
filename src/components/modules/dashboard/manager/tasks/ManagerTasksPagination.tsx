"use client";

import { Pagination } from "@/components/ui/pagination";

interface ManagerTasksPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function ManagerTasksPagination({
    currentPage,
    totalPages,
    onPageChange,
}: ManagerTasksPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}