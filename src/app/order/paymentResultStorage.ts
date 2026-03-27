export const LATEST_PAYMENT_CONTEXT_KEY = "latest_midtrans_payment_context"

export type PaymentContext = {
  orderId?: string
  eventTitle: string
  quantity: number
  total: number
  purchaserEmail?: string
  createdAt: string
}

const isBrowser = () => typeof window !== "undefined"

export const savePaymentContext = (context: PaymentContext) => {
  if (!isBrowser()) {
    return
  }

  try {
    localStorage.setItem(LATEST_PAYMENT_CONTEXT_KEY, JSON.stringify(context))
  } catch {
    // Ignore storage failures, success page will fallback to query defaults.
  }
}

export const readPaymentContext = (): PaymentContext | null => {
  if (!isBrowser()) {
    return null
  }

  try {
    const raw = localStorage.getItem(LATEST_PAYMENT_CONTEXT_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<PaymentContext>
    if (
      typeof parsed.eventTitle !== "string" ||
      typeof parsed.quantity !== "number" ||
      typeof parsed.total !== "number" ||
      typeof parsed.createdAt !== "string"
    ) {
      return null
    }

    return {
      eventTitle: parsed.eventTitle,
      quantity: parsed.quantity,
      total: parsed.total,
      createdAt: parsed.createdAt,
      orderId: typeof parsed.orderId === "string" ? parsed.orderId : undefined,
      purchaserEmail: typeof parsed.purchaserEmail === "string" ? parsed.purchaserEmail : undefined,
    }
  } catch {
    return null
  }
}
