export const PROMOTOR_EVENT_PAYMENT_CONTEXT_KEY = "promotor_event_payment_context"

export type PromotorEventPaymentContext = {
  eventId?: string
  eventTitle: string
  paymentUrl?: string
  paymentToken?: string
  createdAt: string
}

const isBrowser = () => typeof window !== "undefined"

export const savePromotorEventPaymentContext = (context: PromotorEventPaymentContext) => {
  if (!isBrowser()) {
    return
  }

  try {
    localStorage.setItem(PROMOTOR_EVENT_PAYMENT_CONTEXT_KEY, JSON.stringify(context))
  } catch {
    // Ignore storage failures and continue with query params fallback.
  }
}

export const readPromotorEventPaymentContext = (): PromotorEventPaymentContext | null => {
  if (!isBrowser()) {
    return null
  }

  try {
    const raw = localStorage.getItem(PROMOTOR_EVENT_PAYMENT_CONTEXT_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<PromotorEventPaymentContext>
    if (typeof parsed.eventTitle !== "string" || typeof parsed.createdAt !== "string") {
      return null
    }

    return {
      eventTitle: parsed.eventTitle,
      createdAt: parsed.createdAt,
      eventId: typeof parsed.eventId === "string" ? parsed.eventId : undefined,
      paymentUrl: typeof parsed.paymentUrl === "string" ? parsed.paymentUrl : undefined,
      paymentToken: typeof parsed.paymentToken === "string" ? parsed.paymentToken : undefined,
    }
  } catch {
    return null
  }
}

export const clearPromotorEventPaymentContext = () => {
  if (!isBrowser()) {
    return
  }

  try {
    localStorage.removeItem(PROMOTOR_EVENT_PAYMENT_CONTEXT_KEY)
  } catch {
    // Ignore storage failures
  }
}
