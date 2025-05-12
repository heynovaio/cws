"use client";
import React, { useState, useMemo, ReactNode } from "react";
import { Pagination } from "react-headless-pagination";

interface CustomPaginationProps {
  children: ReactNode[];
  itemsPerPage?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export const CustomPagination = ({
  children,
  itemsPerPage = 9,
  initialPage = 0,
  onPageChange,
}: CustomPaginationProps) => {
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.ceil(children.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    return children.slice(start, end);
  }, [children, page, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {currentItems}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          setCurrentPage={handlePageChange}
          totalPages={totalPages}
          edgePageCount={1}
          middlePagesSiblingCount={1}
          truncableText="..."
          truncableClassName="text-white px-3 py-2 text-bodyLarge font-bold"
          className="flex gap-2 items-center flex-wrap mt-4 list-none justify-center"
        >
          <Pagination.PageButton
            activeClassName="bg-ultra-pink border-ultra-pink border-2  focus:rounded-full hover-ultrapink"
            inactiveClassName="bg-dark-purple-background border-white border-2  focus:rounded-full"
            className="w-10 h-10 flex items-center justify-center rounded-full  focus:outline-none focus:ring-2 focus:ring-aqua font-bold no-underline cursor-pointer"
          />
        </Pagination>
      )}
    </div>
  );
};
