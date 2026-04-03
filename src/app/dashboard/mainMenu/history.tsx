"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaRegCalendar } from "react-icons/fa6"
import { HiMapPin } from "react-icons/hi2"
import { LuClock3 } from "react-icons/lu"
import { Ticket } from "lucide-react"

import Footer from "../footer"
import { getMyTickets } from "@/Services/ticketService"
import type { MyTicket } from "@/types/api/ticket"
import { getApiErrorMessage } from "@/lib/apiError"
import { getAuthTokenCookie } from "@/lib/authCookie"
import { readPaymentContext } from "../../order/paymentResultStorage"

const SIDEBAR_ITEMS = [
	{ label: "Profil Saya", href: "/dashboard/mainMenu/myProfile" },
	{ label: "Ticket Saya", href: "/dashboard/mainMenu" },
	{ label: "Riwayat Transaksi", href: "/dashboard/history", active: true },
]

const FILTERS = [
	{ key: "all", label: "Semua Waktu" },
	{ key: "7d", label: "7 Hari Terakhir" },
	{ key: "30d", label: "30 Hari Terakhir" },
] as const

type FilterKey = (typeof FILTERS)[number]["key"]

type HistoryRecord = {
	id: string
	orderId: string
	eventTitle: string
	eventDate: string
	eventTime: string
	location: string
	imageUrl?: string
	totalAmount?: number
	status: string
}

const formatCurrency = (value?: number) => {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
		return "Gratis"
	}

	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value)
}

const monthMap: Record<string, number> = {
	januari: 0,
	februari: 1,
	maret: 2,
	april: 3,
	mei: 4,
	juni: 5,
	juli: 6,
	agustus: 7,
	september: 8,
	oktober: 9,
	november: 10,
	desember: 11,
}

const parseDateLabel = (label: string): Date | null => {
	const direct = new Date(label)
	if (!Number.isNaN(direct.getTime())) {
		return direct
	}

	const trimmed = label.includes(",") ? label.split(",").slice(1).join(",").trim() : label.trim()
	const match = trimmed.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/)
	if (!match) {
		return null
	}

	const day = Number(match[1])
	const monthName = match[2].toLowerCase()
	const year = Number(match[3])
	const monthIndex = monthMap[monthName]

	if (!Number.isFinite(day) || !Number.isFinite(year) || monthIndex === undefined) {
		return null
	}

	const parsed = new Date(year, monthIndex, day)
	if (Number.isNaN(parsed.getTime())) {
		return null
	}

	return parsed
}

const withinDays = (dateLabel: string, days: number) => {
	const parsed = parseDateLabel(dateLabel)
	if (!parsed) {
		return false
	}

	const now = Date.now()
	const diff = now - parsed.getTime()
	const max = days * 24 * 60 * 60 * 1000

	return diff >= 0 && diff <= max
}

const normalizeStatus = (statusRaw?: string) => {
	const normalized = (statusRaw || "").toLowerCase()
	if (normalized.includes("settlement") || normalized.includes("capture") || normalized.includes("success")) {
		return "Berhasil"
	}

	if (normalized.includes("pending")) {
		return "Pending"
	}

	return "Berhasil"
}

const createFallbackHistory = (): HistoryRecord | null => {
	const context = readPaymentContext()
	if (!context) {
		return null
	}

	const parsedCreatedAt = new Date(context.createdAt)
	const dateLabel = Number.isNaN(parsedCreatedAt.getTime())
		? "Tanggal belum tersedia"
		: parsedCreatedAt.toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		})

	return {
		id: context.orderId?.trim() || `local-${context.createdAt}`,
		orderId: context.orderId?.trim() || "-",
		eventTitle: context.eventTitle,
		eventDate: dateLabel,
		eventTime: "-",
		location: "Lokasi akan diperbarui",
		totalAmount: context.total,
		status: "Berhasil",
	}
}

const History = () => {
	const router = useRouter()
	const [records, setRecords] = useState<HistoryRecord[]>([])
	const [fallbackRecord, setFallbackRecord] = useState<HistoryRecord | null>(null)
	const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [detailError, setDetailError] = useState<string | null>(null)
	const [openingDetailId, setOpeningDetailId] = useState<string | null>(null)

	useEffect(() => {
		setFallbackRecord(createFallbackHistory())

		const loadHistory = async () => {
			setIsLoading(true)
			setErrorMessage(null)

			const token = getAuthTokenCookie()
			if (!token) {
				setErrorMessage("Sesi login tidak ditemukan. Silakan login kembali.")
				setIsLoading(false)
				return
			}

			try {
				const tickets = await getMyTickets(token)
				const mapped: HistoryRecord[] = tickets.map((ticket: MyTicket) => ({
					id: ticket.id,
					orderId: ticket.orderId,
					eventTitle: ticket.eventTitle,
					eventDate: ticket.eventDate,
					eventTime: ticket.eventTime,
					location: ticket.location,
					imageUrl: ticket.imageUrl,
					totalAmount: ticket.totalAmount,
					status: normalizeStatus(ticket.paymentStatus),
				}))

				setRecords(mapped)
			} catch (error) {
				setErrorMessage(getApiErrorMessage(error, "Gagal memuat riwayat transaksi."))
			} finally {
				setIsLoading(false)
			}
		}

		void loadHistory()
	}, [])

	const mergedRecords = useMemo(() => {
		if (!fallbackRecord) {
			return records
		}

		const exists = records.some((item) => {
			if (fallbackRecord.orderId !== "-" && item.orderId === fallbackRecord.orderId) {
				return true
			}

			return item.eventTitle === fallbackRecord.eventTitle && item.eventDate === fallbackRecord.eventDate
		})

		if (exists) {
			return records
		}

		return [fallbackRecord, ...records]
	}, [records, fallbackRecord])

	const filteredRecords = useMemo(() => {
		if (activeFilter === "all") {
			return mergedRecords
		}

		if (activeFilter === "7d") {
			return mergedRecords.filter((item) => withinDays(item.eventDate, 7))
		}

		return mergedRecords.filter((item) => withinDays(item.eventDate, 30))
	}, [mergedRecords, activeFilter])

	const totalTransactions = useMemo(() => {
		return filteredRecords.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
	}, [filteredRecords])

	const resolveEventTargetFromTicketDetail = (payload: unknown) => {
		if (typeof payload !== "object" || payload === null) {
			return null
		}

		const data = payload as Record<string, unknown>
		const nested = typeof data.data === "object" && data.data !== null ? (data.data as Record<string, unknown>) : null
		const eventFromData = typeof data.event === "object" && data.event !== null ? (data.event as Record<string, unknown>) : null
		const eventFromNested = nested && typeof nested.event === "object" && nested.event !== null ? (nested.event as Record<string, unknown>) : null

		const candidates = [data, nested, eventFromData, eventFromNested]

		for (const item of candidates) {
			if (!item) {
				continue
			}

			const slugCandidate = item.slug
			if (typeof slugCandidate === "string" && slugCandidate.trim()) {
				return { type: "slug" as const, value: slugCandidate.trim() }
			}

			const idCandidate = item.event_id ?? item.id
			if ((typeof idCandidate === "string" || typeof idCandidate === "number") && String(idCandidate).trim()) {
				return { type: "id" as const, value: String(idCandidate).trim() }
			}
		}

		return null
	}

	const handleOpenDetail = async (item: HistoryRecord) => {
		setDetailError(null)

		const token = getAuthTokenCookie()
		if (!token) {
			setDetailError("Sesi login tidak ditemukan. Silakan login kembali.")
			return
		}

		const ticketId = item.id?.trim()
		if (!ticketId || ticketId.startsWith("local-")) {
			setDetailError("Detail acara belum tersedia untuk transaksi lokal. Tunggu hingga data tersinkron dari server.")
			return
		}

		setOpeningDetailId(ticketId)

		try {
			const response = await fetch(`/api/me/tickets/${encodeURIComponent(ticketId)}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const raw = await response.text()
				let message = "Gagal memuat detail acara."

				try {
					const parsed = JSON.parse(raw) as { message?: unknown }
					if (typeof parsed.message === "string" && parsed.message.trim()) {
						message = parsed.message
					}
				} catch {
					if (raw.trim()) {
						message = raw
					}
				}

				throw new Error(message)
			}

			const json = (await response.json()) as unknown
			const target = resolveEventTargetFromTicketDetail(json)

			if (!target) {
				router.push("/EventDetail")
				return
			}

			if (target.type === "slug") {
				router.push(`/EventDetail?slug=${encodeURIComponent(target.value)}`)
				return
			}

			router.push(`/EventDetail?eventId=${encodeURIComponent(target.value)}`)
		} catch (error) {
			setDetailError(getApiErrorMessage(error, "Gagal membuka detail acara."))
		} finally {
			setOpeningDetailId(null)
		}
	}

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
						<h1 className="wrap-break-word text-4xl font-semibold leading-tight text-[#3f2f1a] sm:text-5xl">Riwayat Transaksi</h1>
						{detailError ? (
							<p className="mt-3 rounded-xl border border-[#d59f8f] bg-[#fff2ef] px-4 py-3 text-sm text-[#8d2f2f]">{detailError}</p>
						) : null}

						<div className="mt-8 grid gap-3 md:grid-cols-[1fr_180px]">
							<div className="mobile-stack-scroll rounded-xl border border-[#9f7a3f]/70 bg-[#f8f3eb] p-3">
								<div className="flex min-w-max flex-nowrap gap-2 md:min-w-0 md:flex-wrap">
									{FILTERS.map((filter) => (
										<button
											key={filter.key}
											type="button"
											onClick={() => setActiveFilter(filter.key)}
											className={`h-9 rounded-md px-4 text-xs font-semibold transition-colors ${
												activeFilter === filter.key
													? "bg-[#a7864f] text-white"
													: "text-[#5f4a2e] hover:bg-[#efe2ce]"
											}`}
										>
											{filter.label}
										</button>
									))}
								</div>
							</div>

							<div className="rounded-xl border border-[#9f7a3f]/70 bg-[#f8f3eb] px-4 py-3">
								<p className="text-xs text-[#6f5c40]">Total Transaksi</p>
								<p className="mt-0.5 text-3xl font-semibold text-[#3f2f1a]">{formatCurrency(totalTransactions)}</p>
							</div>
						</div>

						{isLoading ? (
							<div className="mt-6 rounded-2xl border border-[#9f7a3f]/45 bg-[#f8f3eb] p-6 text-sm text-[#6d583a]">
								Memuat riwayat transaksi...
							</div>
						) : null}

						{!isLoading && errorMessage ? (
							<div className="mt-6 rounded-2xl border border-[#c97d6a] bg-[#fff1ee] p-5 text-sm text-[#9a2e2e]">
								{errorMessage}
							</div>
						) : null}

						{!isLoading && !errorMessage && filteredRecords.length === 0 ? (
							<div className="mt-6 rounded-2xl border border-[#9f7a3f]/45 bg-[#f8f3eb] p-6 text-sm text-[#6d583a]">
								Belum ada riwayat transaksi pada rentang waktu ini.
							</div>
						) : null}

						<div className="mt-4 space-y-4">
							{filteredRecords.map((item) => (
								<article
									key={item.id}
									className="rounded-2xl border border-[#8d6b39] bg-[#fcf9f4] p-3 sm:p-4"
								>
									<div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_auto]">
										<div className="grid gap-3 sm:grid-cols-[95px_1fr] sm:items-center">
											<div className="h-20 w-full overflow-hidden rounded-lg bg-[#e7d8bf]">
												{item.imageUrl ? (
													<Image
														src={item.imageUrl}
														alt={item.eventTitle}
														width={120}
														height={80}
														className="h-full w-full object-cover"
														unoptimized
													/>
												) : null}
											</div>
											<div>
												<div className="mb-1 flex items-center gap-2">
													<span className="rounded-full bg-[#e4f8e8] px-2 py-0.5 text-[11px] font-semibold text-[#25863b]">
														{item.status}
													</span>
													<span className="text-[11px] text-[#6f5c40]">INV/{item.orderId}</span>
												</div>
												<h3 className="text-xl font-semibold leading-tight text-[#1f1408] sm:text-2xl">{item.eventTitle}</h3>
												<div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#3f3120]">
													<p className="inline-flex items-center gap-2">
														<FaRegCalendar className="h-4 w-4" />
														{item.eventDate}
													</p>
													<p className="inline-flex items-center gap-2">
														<LuClock3 className="h-4 w-4" />
														{item.eventTime}
													</p>
													<p className="inline-flex items-center gap-2">
														<HiMapPin className="h-4 w-4" />
														{item.location}
													</p>
												</div>
											</div>
										</div>

										<div className="text-left lg:text-right">
											<p className="text-xs text-[#6f5c40]">Total Pembayaran</p>
											<p className="mt-1 text-2xl font-semibold text-[#1f1408] sm:text-3xl">{formatCurrency(item.totalAmount)}</p>
										</div>

										<div className="flex w-full items-center gap-2 sm:w-auto">
											<button
												type="button"
												onClick={() => handleOpenDetail(item)}
												disabled={openingDetailId === item.id}
												className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#a7864f] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#8f6f3e] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-24 sm:flex-none"
											>
												{openingDetailId === item.id ? "Buka..." : "Detail"}
											</button>
											<a
												href={`/api/ticket/pdf?order_id=${encodeURIComponent(item.orderId)}`}
												className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#b9965a] text-white transition-colors hover:bg-[#a7864f]"
												aria-label="Download tiket"
											>
												<Ticket className="h-4 w-4" />
											</a>
										</div>
									</div>
								</article>
							))}
						</div>
					</section>
				</div>
			</section>

			<Footer />
		</main>
	)
}

export default History
