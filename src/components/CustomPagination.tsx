"use client";
import React, { useState, useMemo, ReactNode } from "react";
import { Pagination } from "react-headless-pagination";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

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

      <Pagination
        currentPage={page}
        setCurrentPage={handlePageChange}
        totalPages={totalPages}
        edgePageCount={1}
        middlePagesSiblingCount={1}
        truncableText="..."
        truncableClassName="text-white px-3 py-2"
        className="flex gap-2 items-center flex-wrap mt-4 list-none"
      >
        <Pagination.PrevButton
          className="text-midnight bg-aqua px-3 py-2 rounded-lg"
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </Pagination.PrevButton>

        <Pagination.PageButton
          activeClassName="bg-ultra-pink text-midnight no-underline"
          inactiveClassName="text-midnight bg-neon-violet no-underline"
          className="px-3 py-2 rounded-lg text-[1.1rem]"
        />

        <Pagination.NextButton
          className="text-midnight bg-aqua px-3 py-2 rounded-lg"
          aria-label="Next page"
        >
          <FaChevronRight />
        </Pagination.NextButton>
      </Pagination>
    </div>
  );
};
