import { Music2, Palette, PersonStanding, Tag } from "lucide-react"

import type { CategoryFilter, SortOrder } from "./types"

type CategoryControlsProps = {
  categories: CategoryFilter[]
  activeCategory: CategoryFilter
  sortOrder: SortOrder
  onCategoryChange: (category: CategoryFilter) => void
  onSortOrderChange: (sortOrder: SortOrder) => void
}

const CategoryControls = ({
  categories,
  activeCategory,
  sortOrder,
  onCategoryChange,
  onSortOrderChange,
}: CategoryControlsProps) => {
  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase()

    if (lower.includes("musik")) {
      return Music2
    }

    if (lower.includes("tari")) {
      return PersonStanding
    }

    if (lower.includes("pameran") || lower.includes("seni")) {
      return Palette
    }

    return Tag
  }

  return (
    <section className="relative mx-auto mt-10 w-full overflow-hidden bg-[#ebe7e3] px-4 py-8 sm:px-8 md:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 top-0 h-48 w-48 rounded-full border-[6px] border-[#d9c6b8] opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-2 h-56 w-56 rounded-full border-[6px] border-[#d9c6b8] opacity-35"
      />

      <div className="mx-auto w-full max-w-338">
        <h2 className="text-center text-4xl font-black tracking-tight text-[#17120d]">Kategori</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols xl:grid-cols-4">
          {categories.filter((category) => category !== "Semua").map((category, index) => {
            const isActive = activeCategory === category
            const Icon = getCategoryIcon(category)
            const placeholderCount = 12 + index * 3

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`rounded-xl border px-4 py-5 text-center transition-colors ${
                  isActive
                    ? "border-[#6b5330] bg-[#f4ece3]"
                    : "border-[#6b5330] bg-transparent hover:bg-[#f1e8dd]"
                }`}
              >
                <Icon className="mx-auto h-10 w-10 text-[#5c472b]" aria-hidden="true" />
                <p className="mt-2 text-[32px] font-black leading-none text-[#17120d]">{category}</p>
                <p className="mt-1 text-[28px] text-[#2f2416]">{placeholderCount} Event</p>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-[#5d4a2c]">
          <span>Urutan:</span>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(event) => onSortOrderChange(event.target.value as SortOrder)}
            className="rounded-full border border-[#8e7652] bg-[#f4ece3] px-3 py-1.5 text-sm text-[#3d2f1c] outline-none focus:ring-2 focus:ring-[#b79d71]/40"
          >
            <option value="category-asc">Kategori A-Z</option>
            <option value="category-desc">Kategori Z-A</option>
          </select>
          <button
            type="button"
            onClick={() => onCategoryChange("Semua")}
            className={`rounded-full border px-3 py-1.5 ${
              activeCategory === "Semua"
                ? "border-[#6b5330] bg-[#d8c2a0] text-[#251a0e]"
                : "border-[#8e7652] bg-[#f4ece3] text-[#3d2f1c]"
            }`}
          >
            Semua
          </button>
        </div>
      </div>
    </section>
  )
}

export default CategoryControls