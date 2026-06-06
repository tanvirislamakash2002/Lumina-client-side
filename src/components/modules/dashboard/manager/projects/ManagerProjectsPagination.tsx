"use client";

import { Pagination } from "@/components/ui/pagination";

interface ManagerProjectsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function ManagerProjectsPagination({
    currentPage,
    totalPages,
    onPageChange,
}: ManagerProjectsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}