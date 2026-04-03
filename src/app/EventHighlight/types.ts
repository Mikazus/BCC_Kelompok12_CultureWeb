import type { StaticImageData } from "next/image"

export type EventCategory = string

export type SortOrder = "asc" | "desc"

export type CategoryFilter = "Semua" | EventCategory

export type EventCard = {
  id: number | string
  slug?: string
  title: string
  category: EventCategory
  location: string
  dateLabel: string
  priceLabel: string
  summary?: string
  stockLabel?: string
  image: string | StaticImageData
}