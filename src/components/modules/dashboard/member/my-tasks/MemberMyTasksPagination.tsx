"use client";

import { Pagination } from "@/components/ui/pagination";

interface MemberMyTasksPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function MemberMyTasksPagination({
    currentPage,
    totalPages,
    onPageChange,
}: MemberMyTasksPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
}