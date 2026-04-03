"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getEventBySlug, getEventComments, getEvents, postEventComment } from "@/Services/eventService"
import { getApiErrorMessage } from "@/lib/apiError"
import { getAuthTokenCookie } from "@/lib/authCookie"
import Footer from "../dashboard/footer"
import CommentSection from "./comment"
import { eventComments, eventDetailData, type EventComment, type EventDetailData } from "./data"
import DetailCard from "./details"
import Hero from "./hero"

const EventDetailContent = () => {
	const searchParams = useSearchParams()
	const slug = searchParams.get("slug")?.trim() || ""
	const [detail, setDetail] = useState<EventDetailData>(eventDetailData)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [comments, setComments] = useState<EventComment[]>(eventComments)
	const [isCommentLoading, setIsCommentLoading] = useState(false)
	const [isCommentPosting, setIsCommentPosting] = useState(false)
	const [commentError, setCommentError] = useState<string | null>(null)

	useEffect(() => {
		let isMounted = true

		const loadEventDetail = async () => {
			try {
				const selectedEvent = slug ? await getEventBySlug(slug) : null
				const firstEvent = selectedEvent || (await getEvents())[0]

				if (!isMounted || !firstEvent) {
					return
				}

				setDetail({
					eventId: firstEvent.id,
					title: firstEvent.title,
					subtitle: firstEvent.summary || eventDetailData.subtitle,
					category: firstEvent.category,
					dateLabel: firstEvent.dateLabel,
					location: firstEvent.location,
					priceLabel: firstEvent.priceLabel,
					ticketLabel: firstEvent.stockLabel || eventDetailData.ticketLabel,
					description: firstEvent.summary || eventDetailData.description,
					image: firstEvent.image,
				})
			} catch (error) {
				if (isMounted) {
					setErrorMessage(getApiErrorMessage(error, "Gagal memuat detail event dari API."))
				}
			}
		}

		void loadEventDetail()

		return () => {
			isMounted = false
		}
	}, [slug])

	useEffect(() => {
		let isMounted = true
		const eventId = String(detail.eventId || "").trim()

		if (!eventId) {
			return
		}

		const loadComments = async () => {
			setIsCommentLoading(true)
			setCommentError(null)

			try {
				const commentItems = await getEventComments(eventId)
				if (isMounted) {
					setComments(commentItems)
				}
			} catch (error) {
				if (isMounted) {
					setCommentError(getApiErrorMessage(error, "Gagal memuat komentar event dari API."))
				}
			} finally {
				if (isMounted) {
					setIsCommentLoading(false)
				}
			}
		}

		void loadComments()

		return () => {
			isMounted = false
		}
	}, [detail.eventId])

	const handleCommentSubmit = async (comment: string, parentId?: string) => {
		const eventId = String(detail.eventId || "").trim()
		if (!eventId) {
			setCommentError("Event ID tidak ditemukan.")
			return false
		}

		const token = getAuthTokenCookie()
		if (!token) {
			setCommentError("Silakan login terlebih dahulu untuk mengirim komentar.")
			return false
		}

		setIsCommentPosting(true)
		setCommentError(null)

		try {
			await postEventComment(eventId, token, comment, parentId)
			const updatedComments = await getEventComments(eventId)
			setComments(updatedComments)
			return true
		} catch (error) {
			setCommentError(getApiErrorMessage(error, "Gagal mengirim komentar."))
			return false
		} finally {
			setIsCommentPosting(false)
		}
	}

	return (
		<main className="bg-[#f6f1e9] pb-0 pt-16 text-[#2f2416]">
			<Hero detail={detail} />
			{errorMessage ? (
				<section className="mx-auto mt-4 w-[92%] max-w-338 rounded-2xl border border-[#d6b07a] bg-[#fff4e2] p-4 text-sm text-[#7a4c1c]">
					{errorMessage}
				</section>
			) : null}
			<DetailCard detail={detail} />
			<CommentSection
				comments={comments}
				isLoading={isCommentLoading}
				errorMessage={commentError}
				isPosting={isCommentPosting}
				onSubmitComment={handleCommentSubmit}
			/>
			<Footer />
		</main>
	)
}

const EventDetailPage = () => {
	return (
		<Suspense fallback={<main className="bg-[#f6f1e9] pb-0 pt-16 text-[#2f2416]" />}>
			<EventDetailContent />
		</Suspense>
	)
}

export default EventDetailPage
