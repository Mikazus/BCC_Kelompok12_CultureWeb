"use client"

import { useEffect, useMemo, useState } from "react"
import { getCategories, getEventsByQuery } from "@/Services/eventService"
import { getApiErrorMessage } from "@/lib/apiError"
import Engage from "../dashboard/engage"
import Footer from "../dashboard/footer"
import CategoryControls from "./categoryControls"
import EventGrid from "./eventGrid"
import Hero from "./hero"
import type { EventCard, SortOrder } from "./types"
import type { EventCategoryOption } from "@/Services/eventService"
import type { ApidogModel } from "@/types/api/event"

const EventDetailPage = () => {
	const [events, setEvents] = useState<EventCard[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [apiCategories, setApiCategories] = useState<EventCategoryOption[]>([])
	const [activeCategoryId, setActiveCategoryId] = useState("")
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

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
					category_id: activeCategoryId,
					limit: "5",
					page: "1",
					search: "",
					sort_by: "created_at",
					sort_order: sortOrder,
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
	}, [activeCategoryId, sortOrder])

	const categoryOptions = useMemo<EventCategoryOption[]>(() => {
		return apiCategories
	}, [apiCategories])

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
				activeCategoryId={activeCategoryId}
				sortOrder={sortOrder}
				onCategoryChange={setActiveCategoryId}
				onSortOrderChange={setSortOrder}
			/>
			<EventGrid events={events} />
			<Engage />
			<Footer />
		</main>
	)
}

export default EventDetailPage
