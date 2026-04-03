import api from "@/lib/api"

export type CheckoutActivity = {
	activity: string
	event: string
	time: string
	price: string
}

export type CheckoutTicketPayload = {
	holder_name: string
	identity_type: string
	identity_number: string
	holder_phone: string
	holder_email: string
	notes?: string
}

export type CheckoutPayload = {
	event_id: string
	tickets: CheckoutTicketPayload[]
}

export const submitCheckout = async (payload: CheckoutPayload, token: string) => {
	const response = await api.post("/checkout", payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	})

	return response.data
}

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null

const firstString = (item: Record<string, unknown>, keys: string[], fallback = "") => {
	for (const key of keys) {
		const value = item[key]
		if (typeof value === "string" && value.trim()) {
			return value.trim()
		}
	}

	return fallback
}

const extractArray = (payload: unknown): Record<string, unknown>[] => {
	if (Array.isArray(payload)) {
		return payload.filter(isObject)
	}

	if (!isObject(payload)) {
		return []
	}

	if (Array.isArray(payload.data)) {
		return payload.data.filter(isObject)
	}

	if (isObject(payload.data)) {
		const nested = payload.data as Record<string, unknown>
		if (Array.isArray(nested.data)) {
			return nested.data.filter(isObject)
		}
		if (Array.isArray(nested.tickets)) {
			return nested.tickets.filter(isObject)
		}
		if (Array.isArray(nested.checkouts)) {
			return nested.checkouts.filter(isObject)
		}
	}

	if (Array.isArray(payload.tickets)) {
		return payload.tickets.filter(isObject)
	}

	if (Array.isArray(payload.checkouts)) {
		return payload.checkouts.filter(isObject)
	}

	if (Array.isArray(payload.results)) {
		return payload.results.filter(isObject)
	}

	return []
}

const formatRelativeTime = (rawDate: string) => {
	const parsed = new Date(rawDate)
	if (Number.isNaN(parsed.getTime())) {
		return "Baru saja"
	}

	const diffMs = Date.now() - parsed.getTime()
	const diffMinutes = Math.max(Math.floor(diffMs / 60000), 0)

	if (diffMinutes < 1) {
		return "Baru saja"
	}

	if (diffMinutes < 60) {
		return `${diffMinutes} menit lalu`
	}

	const diffHours = Math.floor(diffMinutes / 60)
	if (diffHours < 24) {
		return `${diffHours} jam lalu`
	}

	const diffDays = Math.floor(diffHours / 24)
	return `${diffDays} hari lalu`
}

const formatPrice = (raw: unknown) => {
	if (typeof raw === "number" && Number.isFinite(raw)) {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0,
		}).format(raw)
	}

	if (typeof raw === "string" && raw.trim()) {
		const normalized = Number(raw.replace(/[^\d]/g, ""))
		if (!Number.isNaN(normalized) && Number.isFinite(normalized) && normalized > 0) {
			return new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				maximumFractionDigits: 0,
			}).format(normalized)
		}
		return raw
	}

	return "Rp 0"
}

export const getCheckoutActivities = async (token: string): Promise<CheckoutActivity[]> => {
	const endpoint = process.env.NEXT_PUBLIC_PROMOTOR_ACTIVITY_ENDPOINT?.trim() || "/me/tickets"

	const response = await api.get<unknown>(endpoint, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	const rows = extractArray(response.data)

	return rows.slice(0, 5).map((item, index) => {
		const eventObj = isObject(item.event) ? item.event : null
		const eventName =
			firstString(item, ["event_title", "eventTitle", "title"], "") ||
			(eventObj ? firstString(eventObj, ["title", "name", "event_name"], "") : "") ||
			`Event ${index + 1}`

		const createdAt =
			firstString(item, ["created_at", "createdAt", "paid_at", "updated_at"], "") ||
			(eventObj ? firstString(eventObj, ["created_at", "updated_at"], "") : "")

		const amount =
			item.total_amount ??
			item.totalAmount ??
			item.gross_amount ??
			item.grossAmount ??
			item.amount ??
			item.price

		return {
			activity: "Pembelian Ticket",
			event: eventName,
			time: createdAt ? formatRelativeTime(createdAt) : "Baru saja",
			price: formatPrice(amount),
		}
	})
}
