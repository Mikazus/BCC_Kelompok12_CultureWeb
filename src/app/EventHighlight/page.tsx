"use client"

import { useEffect, useMemo, useState } from "react"
import { getCategories, getEventsByQuery } from "@/Services/eventService"
import { getApiErrorMessage } from "@/lib/apiError"
import Engage from "../dashboard/engage"
import Footer from "../dashboard/footer"
import CategoryControls from "./categoryControls"
import EventGrid from "./eventGrid"
import Hero from "./hero"
import type { CategoryFilter, EventCard, SortOrder } from "./types"
import type { EventCategoryOption } from "@/Services/eventService"
import type { ApidogModel } from "@/types/api/event"

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

	useEffect(() => {
		let isMounted = true

		const loadEvents = async () => {
			setIsLoading(true)
			setErrorMessage(null)

			try {
				const queryOptions: ApidogModel = {
					category_id: "",
					limit: "10",
					page: "1",
					search: "",
					sort_by: "created_at",
					sort_order: sortOrder === "category-asc" ? "asc" : "desc",
				}

				const apiEvents = await getEventsByQuery(queryOptions)

				if (!isMounted) {
					return
				}

				setEvents(apiEvents)
			} catch (error) {
				if (!isMounted) {
					return
				}

				setEvents([])
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
	}, [sortOrder])

	const categories = useMemo<CategoryFilter[]>(() => {
		const categorySet = new Set<string>()

		for (const item of apiCategories) {
			if (item.name.trim()) {
				categorySet.add(item.name)
			}
		}

		for (const item of events) {
			if (item.category.trim()) {
				categorySet.add(item.category)
			}
		}

		return ["Semua", ...categorySet]
	}, [apiCategories, events])

	const categoryOptions = useMemo<EventCategoryOption[]>(() => {
		const countByCategory = events.reduce<Record<string, number>>((accumulator, item) => {
			accumulator[item.category] = (accumulator[item.category] || 0) + 1
			return accumulator
		}, {})

		const categoryMetaByName = new Map<string, EventCategoryOption>()
		apiCategories.forEach((category) => {
			categoryMetaByName.set(category.name, category)
		})

		return categories
			.filter((category) => category !== "Semua")
			.map((category) => ({
				id: categoryMetaByName.get(category)?.id || category,
				name: category,
				icon: categoryMetaByName.get(category)?.icon,
				event_count: countByCategory[category] || 0,
			}))
	}, [apiCategories, categories, events])

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
		<main className="bg-[#f6f1e9] pb-0 pt-16 text-[#2f2416]">
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
				categoryOptions={categoryOptions}
				activeCategory={activeCategory}
				sortOrder={sortOrder}
				onCategoryChange={setActiveCategory}
				onSortOrderChange={setSortOrder}
			/>
			<EventGrid events={filteredCards} />
			<Engage />
			<Footer />
		</main>
	)
}

export default EventDetailPage
