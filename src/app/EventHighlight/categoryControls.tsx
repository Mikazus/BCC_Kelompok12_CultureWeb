import type { SortOrder } from "./types"
import type { EventCategoryOption } from "@/Services/eventService"
import Image, { type ImageLoaderProps } from "next/image"

type CategoryControlsProps = {
  categoryOptions: EventCategoryOption[]
  activeCategoryId: string
  sortOrder: SortOrder
  onCategoryChange: (categoryId: string) => void
  onSortOrderChange: (sortOrder: SortOrder) => void
}

const CategoryControls = ({
  categoryOptions,
  activeCategoryId,
  sortOrder,
  onCategoryChange,
  onSortOrderChange,
}: CategoryControlsProps) => {
  const passthroughLoader = ({ src }: ImageLoaderProps) => src

  const formatEventCount = (value: number | undefined) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return null
    }

    const safeCount = Math.max(0, value)
    return `${safeCount} Event`
  }

  return (
    <section className="relative bg-[#f6f1e9] pb-16 pt-8">
      <div className="mx-auto w-[92%] max-w-338">
        <div className="mb-10 text-center text-[#2f2416]">
          <p className="text-2xl font-semibold">Jelajahi</p>
          <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">Semua Kategori</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryOptions.map((category) => {
            const isActive = activeCategoryId === category.id
            const eventCountLabel = formatEventCount(category.event_count)

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`flex min-h-40 flex-col items-center justify-center rounded-2xl border px-6 text-center text-[#3d2f1c] transition-colors ${
                  isActive
                    ? "border-[#6f5737] bg-[#eadfcd]"
                    : "border-[#6f5737] bg-[#f7f2ea] hover:bg-[#efe5d5]"
                }`}
              >
                {category.icon ? (
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={category.icon}
                    alt={`${category.name} icon`}
                    width={36}
                    height={36}
                    className="mb-4 h-9 w-9"
                  />
                ) : (
                  <div className="mb-4 h-9 w-9 rounded-full border border-[#6f5737]/40" aria-hidden="true" />
                )}
                <p className="text-xl font-semibold">{category.name}</p>
                {eventCountLabel ? <p className="mt-2 text-lg">{eventCountLabel}</p> : null}
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
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={`rounded-full border px-3 py-1.5 ${
              activeCategoryId === ""
                ? "border-[#6b5330] bg-[#d8c2a0] text-[#251a0e]"
                : "border-[#8e7652] bg-[#f4ece3] text-[#3d2f1c]"
            }`}
          >
            Semua
          </button>
        </div>

        {categoryOptions.length === 0 ? (
          <p className="mt-4 text-center text-sm text-[#6b5638]">Kategori belum tersedia saat ini.</p>
        ) : null}
      </div>
    </section>
  )
}

export default CategoryControls