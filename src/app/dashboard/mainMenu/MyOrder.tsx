"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaRegCalendar } from "react-icons/fa6"
import { HiMapPin } from "react-icons/hi2"
import { LuClock3 } from "react-icons/lu"

import Footer from "../footer"
import { getMyTickets } from "@/Services/ticketService"
import type { MyTicket } from "@/types/api/ticket"
import { getApiErrorMessage } from "@/lib/apiError"
import { getAuthTokenCookie } from "@/lib/authCookie"
import { readPaymentContext } from "../../order/paymentResultStorage"

const SIDEBAR_ITEMS = [
	{ label: "Profil Saya", href: "#" },
	{ label: "Ticket Saya", href: "/dashboard/mainMenu", active: true },
	{ label: "Riwayat Transaksi", href: "/dashboard/history" },
]

const formatContextDate = (createdAt: string) => {
	const parsed = new Date(createdAt)
	if (Number.isNaN(parsed.getTime())) {
		return "Tanggal belum tersedia"
	}

	return parsed.toLocaleDateString("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	})
}

const createFallbackTicketFromContext = (): MyTicket | null => {
	const context = readPaymentContext()
	if (!context) {
		return null
	}

	const fallbackOrderId = context.orderId?.trim() || "-"
	const fallbackId = context.orderId?.trim() || `local-${context.createdAt}`

	return {
		id: fallbackId,
		orderId: fallbackOrderId,
		eventTitle: context.eventTitle,
		eventDate: formatContextDate(context.createdAt),
		eventTime: "-",
		location: "Lokasi akan diperbarui",
		category: "Budaya",
		ticketType: `Reguler x${Math.max(1, context.quantity)}`,
		qrValue: context.orderId?.trim() || fallbackId,
		totalAmount: context.total,
		paymentStatus: "settlement",
	}
}

const MyOrder = () => {
	const [tickets, setTickets] = useState<MyTicket[]>([])
	const [fallbackTicket, setFallbackTicket] = useState<MyTicket | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	useEffect(() => {
		setFallbackTicket(createFallbackTicketFromContext())

		const loadTickets = async () => {
			setIsLoading(true)
			setErrorMessage(null)

			const token = getAuthTokenCookie()
			if (!token) {
				setErrorMessage("Sesi login tidak ditemukan. Silakan login kembali.")
				setIsLoading(false)
				return
			}

			try {
				const data = await getMyTickets(token)
				setTickets(data)
			} catch (error) {
				setErrorMessage(getApiErrorMessage(error, "Gagal memuat tiket Anda."))
			} finally {
				setIsLoading(false)
			}
		}

		void loadTickets()
	}, [])

	const displayTickets = useMemo(() => {
		if (!fallbackTicket) {
			return tickets
		}

		const existsInApi = tickets.some((ticket) => {
			if (fallbackTicket.orderId !== "-" && ticket.orderId === fallbackTicket.orderId) {
				return true
			}

			return ticket.eventTitle === fallbackTicket.eventTitle && ticket.eventDate === fallbackTicket.eventDate
		})

		if (existsInApi) {
			return tickets
		}

		return [fallbackTicket, ...tickets]
	}, [tickets, fallbackTicket])

	const nearestTicket = useMemo(() => {
		if (displayTickets.length === 0) {
			return null
		}

		return displayTickets[0]
	}, [displayTickets])

	const otherTickets = useMemo(() => {
		if (displayTickets.length <= 1) {
			return []
		}

		return displayTickets.slice(1)
	}, [displayTickets])

	return (
		<main className="min-h-screen bg-[#f6f1e9] pt-20 text-[#2f2416]">
			<section className="mx-auto w-[92%] max-w-338 pb-16">
				<div className="mt-8 grid gap-5 lg:grid-cols-[0.24fr_0.76fr] lg:gap-6">
					<aside className="self-start rounded-2xl border border-[#9f7a3f]/70 bg-[#f8f3eb] p-4 shadow-[0_6px_14px_rgba(70,45,10,0.08)]">
						<h2 className="text-base font-semibold">Menu Utama</h2>
						<div className="mt-4 space-y-2 text-sm">
							{SIDEBAR_ITEMS.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									className={`block rounded-md px-3 py-2.5 transition-colors ${
										item.active ? "bg-[#a7864f] text-white" : "text-[#5f4a2e] hover:bg-[#efe2ce]"
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
						<div className="mt-4 border-t border-[#d9c6a1] pt-4">
							<Link href="/sign-in" className="text-sm font-semibold text-[#ce4a31]">
								Keluar
							</Link>
						</div>
					</aside>

					<section>
						<h1 className="text-5xl font-semibold leading-tight text-[#3f2f1a]">Tiket Saya</h1>
						<p className="mt-1 text-sm text-[#6f5c40]">Kelola Tiket Anda Disini !</p>

						{isLoading ? (
							<div className="mt-6 rounded-2xl border border-[#9f7a3f]/45 bg-[#f8f3eb] p-6 text-sm text-[#6d583a]">
								Memuat tiket...
							</div>
						) : null}

						{!isLoading && errorMessage ? (
							<div className="mt-6 rounded-2xl border border-[#c97d6a] bg-[#fff1ee] p-5 text-sm text-[#9a2e2e]">
								{errorMessage}
							</div>
						) : null}

						{!isLoading && !errorMessage && !nearestTicket ? (
							<div className="mt-6 rounded-2xl border border-[#9f7a3f]/45 bg-[#f8f3eb] p-6 text-sm text-[#6d583a]">
								Belum ada tiket yang bisa ditampilkan.
							</div>
						) : null}

						{!isLoading && !errorMessage && nearestTicket ? (
							<>
								<p className="mt-8 text-sm font-semibold text-[#4e3d24]">Acara Terdekat</p>
								<article className="mt-3 rounded-2xl border border-[#8d6b39] bg-[#fcf9f4] p-4 sm:p-5">
									<div className="grid items-center gap-4 lg:grid-cols-[1fr_190px]">
										<div>
											<span className="inline-flex items-center rounded-full border border-[#8c7352] bg-[#f6f0e5] px-2.5 py-1 text-[11px] font-semibold text-[#2d2113]">
												<span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#2d2113]" />
												Mendatang
											</span>
											<h2 className="mt-3 text-[36px] font-semibold leading-tight text-[#1f1408]">{nearestTicket.eventTitle}</h2>

											<div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#3f3120]">
												<p className="inline-flex items-center gap-2">
													<FaRegCalendar className="h-4 w-4" />
													{nearestTicket.eventDate}
												</p>
												<p className="inline-flex items-center gap-2">
													<LuClock3 className="h-4 w-4" />
													{nearestTicket.eventTime}
												</p>
												<p className="inline-flex items-center gap-2">
													<HiMapPin className="h-4 w-4" />
													{nearestTicket.location}
												</p>
											</div>

											<div className="mt-6 flex flex-wrap items-center gap-3">
												<Link
													href="/EventHighlight"
													className="inline-flex h-10 min-w-38 items-center justify-center rounded-full bg-[#a7864f] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#8f6f3e]"
												>
													Detail Acara
												</Link>
												<a
													href={`/api/ticket/pdf?order_id=${encodeURIComponent(nearestTicket.orderId)}`}
													className="inline-flex h-10 min-w-38 items-center justify-center rounded-full border border-[#bca27a] bg-white px-8 text-sm font-semibold text-[#493724] transition-colors hover:bg-[#f8f3eb]"
												>
													Download PDF
												</a>
											</div>
										</div>

										<div className="flex items-center justify-center rounded-xl border border-[#ccb793] bg-white p-3">
											<Image
												src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(nearestTicket.qrValue)}`}
												alt="QR Ticket"
												width={170}
												height={170}
												unoptimized
												className="rounded-md"
											/>
										</div>
									</div>
								</article>

								{otherTickets.length > 0 ? <p className="mt-9 text-sm font-semibold">Tiket Lainnya</p> : null}
								<div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
									{otherTickets.map((ticket) => (
										<article key={ticket.id} className="overflow-hidden rounded-2xl border border-[#bca27a] bg-white">
											<div className="h-43 w-full bg-[#e9dcc5]">
												{ticket.imageUrl ? (
													<Image src={ticket.imageUrl} alt={ticket.eventTitle} width={480} height={240} className="h-full w-full object-cover" unoptimized />
												) : null}
											</div>
											<div className="p-4">
												<h3 className="text-2xl font-semibold text-[#1f1408]">{ticket.eventTitle}</h3>
												<p className="mt-3 inline-flex items-center gap-2 text-sm text-[#4d3b24]">
													<FaRegCalendar className="h-4 w-4" />
													{ticket.eventDate}
												</p>
												<p className="mt-2 inline-flex items-center gap-2 text-sm text-[#4d3b24]">
													<HiMapPin className="h-4 w-4" />
													{ticket.location}
												</p>
												<a
													href={`/api/ticket/pdf?order_id=${encodeURIComponent(ticket.orderId)}`}
													className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full border border-[#bca27a] text-sm font-semibold text-[#4a3924] transition-colors hover:bg-[#f8f3eb]"
												>
													Lihat Tiket
												</a>
											</div>
										</article>
									))}
								</div>
							</>
						) : null}
					</section>
				</div>
			</section>

			<Footer />
		</main>
	)
}

export default MyOrder
