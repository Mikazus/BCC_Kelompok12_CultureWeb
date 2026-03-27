import api from "@/lib/api"
import type { MyTicket, TicketApiItem, TicketListResponse } from "@/types/api/ticket"

const TICKETS_ENDPOINT = "/me/tickets"

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

const extractTicketArray = (payload: unknown): TicketApiItem[] => {
  if (Array.isArray(payload)) {
    return payload as TicketApiItem[]
  }

  if (!isObject(payload)) {
    return []
  }

  const response = payload as TicketListResponse

  if (Array.isArray(response.data)) {
    return response.data
  }

  if (isObject(response.data)) {
    const nestedData = response.data as Record<string, unknown>
    if (Array.isArray(nestedData.data)) {
      return nestedData.data as TicketApiItem[]
    }

    if (Array.isArray(nestedData.tickets)) {
      return nestedData.tickets as TicketApiItem[]
    }
  }

  if (Array.isArray(response.tickets)) {
    return response.tickets
  }

  if (Array.isArray(response.results)) {
    return response.results
  }

  return []
}

const formatDateLabel = (rawDate: string) => {
  const parsed = new Date(rawDate)

  if (Number.isNaN(parsed.getTime())) {
    return rawDate
  }

  return parsed.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const formatTimeLabel = (rawDate: string, fallback = "-") => {
  const parsed = new Date(rawDate)

  if (Number.isNaN(parsed.getTime())) {
    return fallback
  }

  return parsed.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const normalizeNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value
  }

  if (typeof value !== "string") {
    return undefined
  }

  const digits = value.replace(/[^\d]/g, "")
  if (!digits) {
    return undefined
  }

  const parsed = Number(digits)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined
  }

  return parsed
}

const normalizeTicket = (item: TicketApiItem, index: number): MyTicket => {
  const safeItem = isObject(item) ? item : {}
  const eventObj = isObject(safeItem.event) ? (safeItem.event as Record<string, unknown>) : null

  const id = firstString(safeItem, ["id", "ticket_id", "uuid"], `ticket-${index + 1}`)
  const orderId = firstString(safeItem, ["order_id", "orderId", "invoice_id", "invoiceId"], "-")

  const eventTitle =
    firstString(safeItem, ["event_title", "eventTitle", "title"], "") ||
    (eventObj ? firstString(eventObj, ["title", "name", "event_name"], "") : "") ||
    `Event ${index + 1}`

  const eventDateRaw =
    firstString(safeItem, ["event_date", "date", "start_date", "start_at"], "") ||
    (eventObj ? firstString(eventObj, ["date", "event_date", "start_date", "start_at"], "") : "")

  const eventTime =
    firstString(safeItem, ["event_time", "time", "start_time"], "") ||
    (eventObj ? firstString(eventObj, ["time", "event_time", "start_time"], "") : "") ||
    formatTimeLabel(eventDateRaw, "-")

  const location =
    firstString(safeItem, ["location", "venue", "place"], "") ||
    (eventObj ? firstString(eventObj, ["location", "venue", "place", "city"], "") : "") ||
    "Lokasi belum tersedia"

  const category =
    firstString(safeItem, ["category", "event_category"], "") ||
    (eventObj ? firstString(eventObj, ["category", "type", "category_name"], "") : "") ||
    "Budaya"

  const ticketType = firstString(safeItem, ["ticket_type", "type", "tier"], "Reguler")

  const imageUrl =
    firstString(safeItem, ["image", "image_url", "thumbnail"], "") ||
    (eventObj ? firstString(eventObj, ["image", "image_url", "thumbnail", "banner"], "") : "") ||
    undefined

  const qrValue =
    firstString(safeItem, ["qr_code", "qrCode", "qr_value", "barcode"], "") ||
    orderId ||
    id

  const totalAmount =
    normalizeNumber(safeItem.total_amount) ??
    normalizeNumber(safeItem.totalAmount) ??
    normalizeNumber(safeItem.gross_amount) ??
    normalizeNumber(safeItem.grossAmount) ??
    normalizeNumber(safeItem.amount) ??
    normalizeNumber(safeItem.price) ??
    (eventObj
      ? normalizeNumber(eventObj.total_amount) ??
        normalizeNumber(eventObj.totalAmount) ??
        normalizeNumber(eventObj.price)
      : undefined)

  const paymentStatus =
    firstString(safeItem, ["payment_status", "paymentStatus", "transaction_status", "status"], "") ||
    "settlement"

  return {
    id,
    orderId,
    eventTitle,
    eventDate: eventDateRaw ? formatDateLabel(eventDateRaw) : "Tanggal belum tersedia",
    eventTime,
    location,
    category,
    ticketType,
    imageUrl,
    qrValue,
    totalAmount,
    paymentStatus,
  }
}

export const getMyTickets = async (token: string): Promise<MyTicket[]> => {
  const response = await api.get<TicketListResponse>(TICKETS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const list = extractTicketArray(response.data)
  return list.map((item, index) => normalizeTicket(item, index))
}
