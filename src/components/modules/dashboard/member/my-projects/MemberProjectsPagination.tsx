"use client";

import { Pagination } from "@/components/ui/pagination";

interface MemberProjectsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function MemberProjectsPagination({
    currentPage,
    totalPages,
    onPageChange,
}: MemberProjectsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}