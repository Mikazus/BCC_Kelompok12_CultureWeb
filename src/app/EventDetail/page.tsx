"use client"

import { useEffect, useMemo, useState } from "react"
import { getCategories, getEventsByQuery } from "@/Services/eventService"
import { getApiErrorMessage } from "@/lib/apiError"
import CategoryControls from "./categoryControls"
import { eventCards as fallbackEventCards } from "./data"
import EventGrid from "./eventGrid"
import Hero from "./hero"
import type { CategoryFilter, EventCard, SortOrder } from "./types"
import type { EventCategoryOption } from "@/Services/eventService"

const EventDetailPage = () => {
	const [events, setEvents] = useState<EventCard[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [apiCategories, setApiCategories] = useState<EventCategoryOption[]>([])
	const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Semua")
	const [sortOrder, setSortOrder] = useState<SortOrder>("category-asc")

	useEffect(() => {
		let isMounted = true

		const loadCategories = async () => {
			try {
				const categories = await getCategories()
				if (isMounted) {
					setApiCategories(categories)
				}
			} catch {
				if (isMounted) {
					setApiCategories([])
				}
			}
		}

		void loadCategories()

		return () => {
			isMounted = false
		}
	}, [])

	const selectedCategoryId = useMemo(() => {
		if (activeCategory === "Semua") {
			return ""
		}

		const matched = apiCategories.find((item) => item.name === activeCategory)
		return matched?.id || ""
	}, [activeCategory, apiCategories])

	useEffect(() => {
		let isMounted = true

		const loadEvents = async () => {
			setIsLoading(true)
			setErrorMessage(null)

			try {
				const apiEvents = await getEventsByQuery({
					limit: 5,
					page: 1,
					search: activeCategory === "Semua" ? "" : activeCategory,
					categoryId: selectedCategoryId,
					sortBy: "created_at",
					sortOrder: sortOrder === "category-asc" ? "asc" : "desc",
				})

				if (!isMounted) {
					return
				}

				if (apiEvents.length === 0) {
					setEvents(fallbackEventCards)
					setErrorMessage("Data event untuk kategori ini masih kosong. Menampilkan data cadangan.")
				} else {
					setEvents(apiEvents)
				}
			} catch (error) {
				if (!isMounted) {
					return
				}

				setEvents(fallbackEventCards)
				setErrorMessage(getApiErrorMessage(error, "Gagal memuat data event dari API."))
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		void loadEvents()

		return () => {
			isMounted = false
		}
	}, [activeCategory, selectedCategoryId, sortOrder])

	const categories = useMemo<CategoryFilter[]>(() => {
		const derivedCategories = [...new Set(events.map((item) => item.category))]
		const effectiveCategories = apiCategories.length > 0 ? apiCategories.map((item) => item.name) : derivedCategories
		return ["Semua", ...effectiveCategories]
	}, [apiCategories, events])

	useEffect(() => {
		if (activeCategory !== "Semua" && !categories.includes(activeCategory)) {
			setActiveCategory("Semua")
		}
	}, [activeCategory, categories])

	const filteredCards = useMemo(() => {
		const baseCards =
			activeCategory === "Semua"
				? events
				: events.filter((item) => item.category === activeCategory)

		const sorted = [...baseCards].sort((a, b) => {
			const categoryCompare = a.category.localeCompare(b.category)
			if (categoryCompare !== 0) {
				return sortOrder === "category-asc" ? categoryCompare : -categoryCompare
			}
			return a.title.localeCompare(b.title)
		})

		return sorted
	}, [activeCategory, events, sortOrder])

	return (
		<main className="bg-[#f6f1e9] pb-16 pt-16 text-[#2f2416]">
			<Hero />
			{isLoading ? (
				<section className="mx-auto mt-10 w-[92%] max-w-338 rounded-2xl border border-[#d8c9ad] bg-[#fbf7ef] p-5 text-sm text-[#6f5938]">
					Memuat data event...
				</section>
			) : null}
			{errorMessage ? (
				<section className="mx-auto mt-4 w-[92%] max-w-338 rounded-2xl border border-[#d6b07a] bg-[#fff4e2] p-4 text-sm text-[#7a4c1c]">
					{errorMessage}
				</section>
			) : null}
			<CategoryControls
				categories={categories}
				activeCategory={activeCategory}
				sortOrder={sortOrder}
				onCategoryChange={setActiveCategory}
				onSortOrderChange={setSortOrder}
			/>
			<EventGrid events={filteredCards} />
		</main>
	)
}

export default EventDetailPage
