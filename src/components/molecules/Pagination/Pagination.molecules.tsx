import { Button } from "@/components/atoms";
import Select from "@/components/atoms/Select";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

type PaginationProps = {
  total: number;
  page: number;
  limit: number;
  onPageChange: (data: number) => void;
  onLimitChange: (data: string) => void;
};
const limitOptions = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
];

export default function Pagination({
  total,
  page,
  limit,
  onLimitChange,
  onPageChange,
}: PaginationProps) {
  const totalPage = useMemo(() => Math.ceil(total / limit), [limit, total]);

  return (
    <div className="flex gap-6 mobile:flex-col mobile: items-center">
      <Select
        label="Limit Items: "
        value={limit.toString()}
        options={limitOptions}
        onChange={(data) => onLimitChange(data)}
      />
      <div className="flex gap-2">
        <Button
          variants="info"
          disabled={page <= 1}
          onClick={() => page > 1 && onPageChange(page - 1)}
        >
          <AiOutlineArrowLeft />
        </Button>
        {new Array(totalPage).fill(null).map((_, index) => (
          <Button
            variants={page === index + 1 ? "primary" : "info"}
            key={index}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variants="info"
          disabled={page >= totalPage}
          onClick={() => page < totalPage && onPageChange(page + 1)}
        >
          <AiOutlineArrowRight />
        </Button>
      </div>
    </div>
  );
}
