export type TicketApiItem = {
  [key: string]: unknown
}

export type TicketListResponse = {
  data?: TicketApiItem[] | { data?: TicketApiItem[]; tickets?: TicketApiItem[] }
  tickets?: TicketApiItem[]
  results?: TicketApiItem[]
  [key: string]: unknown
}

export type MyTicket = {
  id: string
  orderId: string
  eventTitle: string
  eventDate: string
  eventTime: string
  location: string
  category: string
  ticketType: string
  imageUrl?: string
  qrValue: string
  totalAmount?: number
  paymentStatus?: string
}
