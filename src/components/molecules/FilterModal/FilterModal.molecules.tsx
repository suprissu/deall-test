// #region IMPORTS
import { Button, Input } from "@/components/atoms";
import { ProductResponse } from "@/domains/Types.domains";
import React, { useCallback, useMemo, useState } from "react";
import { AiFillFilter, AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-modal";
// #endregion IMPORTS

type FilterProps = {
  products: ProductResponse;
  onFilterChange: (data: {
    title: string;
    brand: string;
    category: string;
    price: string;
  }) => void;
};

Modal.setAppElement("#__next");
export default function Filter({ products, onFilterChange }: FilterProps) {
  const [isFilterShow, setFilterShow] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    title: [],
    brand: [],
    category: [],
  });
  const [priceRange, setPriceRange] = useState({ min: "0", max: "0" });

  const productsOptions = useMemo(
    () => [...new Set([...products.products.map((data) => data.title)])],
    [products.products]
  );

  const brandsOptions = useMemo(
    () => [...new Set([...products.products.map((data) => data.brand)])],
    [products.products]
  );

  const categoriesOptions = useMemo(
    () => [...new Set([...products.products.map((data) => data.category)])],
    [products.products]
  );

  const filter = useMemo(
    () => [
      {
        name: "title",
        options: productsOptions,
      },
      {
        name: "brand",
        options: brandsOptions,
      },
      {
        name: "category",
        options: categoriesOptions,
      },
    ],
    [brandsOptions, categoriesOptions, productsOptions]
  );

  const handleRemoveFilter = useCallback(
    (sectionName: string, data: string) => {
      setFilters((prev) => ({
        ...prev,
        [sectionName]: prev[sectionName].filter((flt) => flt !== data),
      }));
    },
    []
  );

  const handleAddFilter = useCallback((sectionName: string, data: string) => {
    setFilters((prev) => ({
      ...prev,
      [sectionName]: [...prev[sectionName], data],
    }));
  }, []);

  const handleApplyFilter = useCallback(() => {
    onFilterChange({
      title: filters.title.join(";"),
      brand: filters.brand.join(";"),
      category: filters.category.join(";"),
      price: `${priceRange.min}-${priceRange.max}`,
    });
    setFilterShow(false);
  }, [
    filters.brand,
    filters.category,
    filters.title,
    onFilterChange,
    priceRange.max,
    priceRange.min,
  ]);

  return (
    <>
      <Button
        variants="info"
        types="outline"
        className="flex gap-2"
        onClick={() => setFilterShow(true)}
      >
        <p>Filter</p>
        <AiFillFilter />
      </Button>
      <Modal
        isOpen={isFilterShow}
        onAfterOpen={() => setFilterShow(true)}
        onRequestClose={() => setFilterShow(false)}
      >
        <header className="flex justify-between items-center">
          <h3 className="text-xl mb-4 font-bold">Filter</h3>
          <AiOutlineCloseCircle
            className="w-6 h-6 text-info-400 cursor-pointer hover:text-primary-500"
            onClick={() => setFilterShow(false)}
          />
        </header>
        <div className="flex flex-col gap-8">
          {filter.map((data, index) => (
            <section key={index}>
              <h4 className="capitalize text-info-500">{data.name}</h4>
              <div className="grid grid-cols-2 gap-4 border-t pt-2 mt-2">
                {data.options.map((opt) => {
                  const id = opt.toLowerCase().replaceAll(" ", "-");

                  return (
                    <div className="flex items-center gap-2" key={id}>
                      <input
                        type="checkbox"
                        id={id}
                        name={id}
                        className="cursor-pointer"
                        checked={filters[data.name].includes(opt)}
                        onChange={(e) =>
                          e.target.checked
                            ? handleAddFilter(data.name, opt)
                            : handleRemoveFilter(data.name, opt)
                        }
                      />
                      <label className="cursor-pointer" htmlFor={id}>
                        {opt}
                      </label>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
          <section>
            <h4 className="capitalize text-info-500">Price</h4>
            <div className="flex items-center gap-2 border-t pt-2 mt-2">
              <Input
                placeholder="Min Price ($0)"
                onChange={(e) => {
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }));
                }}
              />
              {"-"}
              <Input
                placeholder={`Max Price ($${
                  products.products.sort().reverse().pop()?.price
                })`}
                onChange={(e) => {
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }));
                }}
              />
            </div>
          </section>
          <div className="flex items-center justify-end border-t pt-2 mt-2">
            <Button variants="success" onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
