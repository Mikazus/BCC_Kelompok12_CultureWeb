import dashImage from "@/image/dash.png";
import api from "@/lib/api";
import type { EventCard } from "@/app/EventHighlight/types";
import type {
  ApidogModel,
  CreateEventPayload,
  CreateEventResponse,
  EventApiItem,
  EventAttendeeApiItem,
  EventAttendeeListResponse,
  EventAttendeeQueryOptions,
  EventListResponse,
} from "../types/api/event";
import type { EventComment } from "@/app/EventDetail/data";

const DEFAULT_EVENTS_ENDPOINT = "/events";
const FALLBACK_EVENTS_ENDPOINT = "/event";
const DEFAULT_MY_EVENTS_ENDPOINT = "/me/events";
const DEFAULT_CATEGORIES_ENDPOINT = "/categories";
const DEFAULT_EVENT_DETAIL_ENDPOINT_PREFIX = "/events";

export type EventQueryOptions = ApidogModel;

export type EventCategoryOption = {
  id: string;
  name: string;
  icon?: string;
  event_count?: number;
};

export type PromotorAttendee = {
  id: string;
  fullName: string;
  ticketCategory: string;
  paymentStatus: "lunas" | "menunggu" | "dibatalkan";
  registeredAt: string;
  checkedIn: boolean;
  ticketCode: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const firstString = (item: Record<string, unknown>, keys: string[], fallback: string) => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
};

const firstNumber = (item: Record<string, unknown>, keys: string[], fallback: number | string) => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const asNumber = Number(value);
      if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
        return asNumber;
      }
      return value;
    }
  }

  return fallback;
};

const normalizeDate = (raw: string) => {
  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const normalizePrice = (item: Record<string, unknown>) => {
  if (item.is_free === true || item.free === true) {
    return "Gratis";
  }

  const explicitLabel = firstString(item, ["priceLabel", "price_label", "price_text"], "");
  if (explicitLabel) {
    return explicitLabel;
  }

  const priceValue = item.price ?? item.ticket_price;
  if (typeof priceValue === "number") {
    return priceValue === 0
      ? "Gratis"
      : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
          priceValue
        );
  }

  if (typeof priceValue === "string" && priceValue.trim()) {
    return priceValue;
  }

  return "Gratis";
};

const extractCategoryName = (item: Record<string, unknown>) => {
  const directCategory = firstString(item, ["category_name", "type"], "");
  if (directCategory) {
    return directCategory;
  }

  const rawCategory = item.category;
  if (typeof rawCategory === "string" && rawCategory.trim()) {
    return rawCategory;
  }

  if (isObject(rawCategory)) {
    const nestedCategory = rawCategory as Record<string, unknown>;
    const nestedName = firstString(nestedCategory, ["name", "title", "label"], "");
    if (nestedName) {
      return nestedName;
    }
  }

  return "Lainnya";
};

const normalizeEvent = (rawItem: EventApiItem, index: number): EventCard => {
  const item = isObject(rawItem) ? rawItem : {};

  const imageUrl = firstString(item, ["image", "image_url", "thumbnail", "banner", "banner_url", "photo"], "");
  const rawDate = firstString(item, ["date", "event_date", "start_date", "startAt", "start_at"], "");
  const summary = firstString(item, ["description", "summary", "excerpt", "short_description"], "");
  const remainingTicketValue = firstNumber(item, ["remaining_tickets", "ticket_remaining", "quota_left", "remaining"], "");
  const quotaValue = firstNumber(item, ["quota"], "");
  const soldValue = firstNumber(item, ["sold"], "");

  let stockLabel = "";
  if (typeof quotaValue === "number" && typeof soldValue === "number") {
    const remainingFromQuota = Math.max(quotaValue - soldValue, 0);
    stockLabel = `${remainingFromQuota} tiket tersisa`;
  } else if (typeof remainingTicketValue === "number") {
    stockLabel = `${remainingTicketValue} tiket tersisa`;
  } else if (typeof remainingTicketValue === "string" && remainingTicketValue.trim()) {
    stockLabel = remainingTicketValue.toLowerCase().includes("tiket")
      ? remainingTicketValue
      : `${remainingTicketValue} tiket tersisa`;
  }

  const title = firstString(item, ["title", "name", "event_name"], `Event ${index + 1}`);
  const rawSlug = firstString(item, ["slug", "event_slug", "permalink"], "");
  const slug =
    rawSlug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  return {
    id: firstNumber(item, ["id", "event_id", "uuid"], `event-${index + 1}`),
    slug,
    title,
    category: extractCategoryName(item),
    location: firstString(item, ["location", "city", "venue", "place"], "Lokasi belum tersedia"),
    dateLabel: rawDate ? normalizeDate(rawDate) : "Tanggal belum tersedia",
    priceLabel: normalizePrice(item),
    summary: summary || undefined,
    stockLabel: stockLabel || undefined,
    image: imageUrl || dashImage,
  };
};

const extractEventArray = (payload: unknown): EventApiItem[] => {
  if (Array.isArray(payload)) {
    return payload as EventApiItem[];
  }

  if (!isObject(payload)) {
    return [];
  }

  const data = payload as EventListResponse;

  if (isObject(data.data) && !Array.isArray(data.data)) {
    const nested = data.data as Record<string, unknown>;

    if (isObject(nested.event)) {
      return [nested.event as EventApiItem];
    }

    if (isObject(nested.item)) {
      return [nested.item as EventApiItem];
    }

    const hasSingleEventKeys =
      (typeof nested.title === "string" && nested.title.trim()) ||
      (typeof nested.name === "string" && nested.name.trim()) ||
      typeof nested.id !== "undefined";

    if (hasSingleEventKeys) {
      return [nested as EventApiItem];
    }
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  if (isObject(data.data)) {
    if (Array.isArray(data.data.data)) {
      return data.data.data;
    }
    if (Array.isArray(data.data.events)) {
      return data.data.events;
    }
  }

  if (Array.isArray(data.events)) {
    return data.events;
  }

  if (Array.isArray(data.results)) {
    return data.results;
  }

  const hasSingleEventKeys =
    (typeof data.title === "string" && data.title.trim()) ||
    (typeof data.name === "string" && data.name.trim()) ||
    typeof data.id !== "undefined";

  if (hasSingleEventKeys) {
    return [data as EventApiItem];
  }

  return [];
};

const isLikelyEventItem = (rawItem: EventApiItem) => {
  const item = isObject(rawItem) ? rawItem : {};
  const eventSignalKeys = [
    "location",
    "city",
    "venue",
    "event_date",
    "start_date",
    "start_at",
    "price",
    "ticket_price",
    "is_free",
    "quota",
    "remaining_tickets",
    "image",
    "banner",
    "description",
    "slug",
  ];

  return eventSignalKeys.some((key) => key in item);
};

const extractCategoryArray = (payload: unknown): EventCategoryOption[] => {
  const normalizeCategory = (value: unknown): EventCategoryOption | null => {
    if (typeof value === "string" && value.trim()) {
      return {
        id: value.trim(),
        name: value.trim(),
        icon: undefined,
        event_count: undefined,
      };
    }

    if (isObject(value)) {
      const item = value as Record<string, unknown>;
      const name = firstString(item, ["name", "title", "category", "category_name", "label"], "");
      if (!name) {
        return null;
      }
      const id = firstString(item, ["id", "category_id", "uuid", "slug"], name);
      const icon = firstString(item, ["icon", "icon_url", "image", "image_url"], "");
      const hasEventCount =
        typeof item.event_count !== "undefined" ||
        typeof item.events_count !== "undefined" ||
        typeof item.count !== "undefined";

      const rawEventCount = hasEventCount ? firstNumber(item, ["event_count", "events_count", "count"], "") : "";
      const event_count =
        typeof rawEventCount === "number"
          ? rawEventCount
          : typeof rawEventCount === "string" && rawEventCount.trim()
            ? Number(rawEventCount) || undefined
            : undefined;

      return {
        id,
        name,
        ...(icon ? { icon } : {}),
        ...(typeof event_count === "number" ? { event_count } : {}),
      };
    }

    return null;
  };

  const toUniqueList = (items: unknown[]) => {
    const values = items
      .map(normalizeCategory)
      .filter((item): item is EventCategoryOption => item !== null && item.name.length > 0);

    const deduped = new Map<string, EventCategoryOption>();
    values.forEach((item) => {
      const dedupeKey = item.id || item.name;
      if (!deduped.has(dedupeKey)) {
        deduped.set(dedupeKey, item);
      }
    });

    return [...deduped.values()];
  };

  if (Array.isArray(payload)) {
    return toUniqueList(payload);
  }

  if (!isObject(payload)) {
    return [];
  }

  const data = payload as Record<string, unknown>;

  if (Array.isArray(data.data)) {
    return toUniqueList(data.data);
  }

  if (isObject(data.data)) {
    const nested = data.data as Record<string, unknown>;
    if (Array.isArray(nested.data)) {
      return toUniqueList(nested.data);
    }
    if (Array.isArray(nested.categories)) {
      return toUniqueList(nested.categories);
    }
  }

  if (Array.isArray(data.categories)) {
    return toUniqueList(data.categories);
  }

  return [];
};

export const getEvents = async () => {
  const queryOptions: EventQueryOptions = {};
  return getEventsByQuery(queryOptions);
};

export const getEventsByQuery = async (options: EventQueryOptions) => {
  const configuredEndpoint = process.env.NEXT_PUBLIC_EVENTS_ENDPOINT?.trim();
  const endpoints = configuredEndpoint
    ? [configuredEndpoint]
    : [DEFAULT_EVENTS_ENDPOINT, FALLBACK_EVENTS_ENDPOINT];

  const params: ApidogModel = {
    ...options,
    limit: options.limit ?? "5",
    page: options.page ?? "1",
    search: options.search ?? "",
    category_id: options.category_id ?? "",
    sort_by: options.sort_by ?? "created_at",
    sort_order: options.sort_order ?? "desc",
  };

  for (let i = 0; i < endpoints.length; i += 1) {
    try {
      const endpoint = endpoints[i];
      const isDetailEndpoint = /\/events\/[A-Za-z0-9_-]+$/.test(endpoint);
      const response = isDetailEndpoint
        ? await api.get<unknown>(endpoint)
        : await api.get<unknown>(endpoint, { params });
      return extractEventArray(response.data).map(normalizeEvent);
    } catch (error) {
      const isLastAttempt = i === endpoints.length - 1;
      if (isLastAttempt) {
        throw error;
      }
    }
  }

  return [];
};

export const getMyEvents = async (token: string, options: EventQueryOptions = {}) => {
  const configuredEndpoint = process.env.NEXT_PUBLIC_MY_EVENTS_ENDPOINT?.trim();
  const endpoint = configuredEndpoint || DEFAULT_MY_EVENTS_ENDPOINT;

  const params: ApidogModel = {
    ...options,
    limit: options.limit ?? "20",
    page: options.page ?? "1",
    search: options.search ?? "",
    category_id: options.category_id ?? "",
    sort_by: options.sort_by ?? "created_at",
    sort_order: options.sort_order ?? "desc",
  };

  const response = await api.get<unknown>(endpoint, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const rawItems = extractEventArray(response.data);
  const likelyEvents = rawItems.filter(isLikelyEventItem);
  return likelyEvents.map(normalizeEvent);
};

export const getCategories = async () => {
  const configuredEndpoint = process.env.NEXT_PUBLIC_CATEGORIES_ENDPOINT?.trim();
  const endpoint = configuredEndpoint || DEFAULT_CATEGORIES_ENDPOINT;

  const response = await api.get<unknown>(endpoint);
  return extractCategoryArray(response.data);
};

export const createEvent = async (token: string, payload: CreateEventPayload) => {
  const formData = new FormData();

  const appendStringField = (key: keyof CreateEventPayload) => {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      formData.append(key, value);
    }
  };

  appendStringField("category_id");
  appendStringField("title");
  appendStringField("summary");
  appendStringField("description");
  appendStringField("venue");
  appendStringField("address");
  appendStringField("google_maps_url");
  appendStringField("start_date");
  appendStringField("end_date");
  appendStringField("registration_deadline");
  appendStringField("is_paid");
  appendStringField("price");
  appendStringField("quota");

  if (payload.banner instanceof File) {
    formData.append("banner", payload.banner);
  }

  const response = await api.post<CreateEventResponse>("/events", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getEventBySlug = async (slug: string) => {
  const detailPrefix = process.env.NEXT_PUBLIC_EVENT_DETAIL_ENDPOINT_PREFIX?.trim() || DEFAULT_EVENT_DETAIL_ENDPOINT_PREFIX;
  const safeSlug = slug.trim();
  const response = await api.get<unknown>(`${detailPrefix}/${safeSlug}`);
  const events = extractEventArray(response.data).map(normalizeEvent);
  return events[0] || null;
};

const extractCommentArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isObject(payload)) {
    return [];
  }

  const data = payload as Record<string, unknown>;

  if (Array.isArray(data.data)) {
    return data.data;
  }

  if (isObject(data.data)) {
    const nested = data.data as Record<string, unknown>;
    if (Array.isArray(nested.data)) {
      return nested.data;
    }
    if (Array.isArray(nested.comments)) {
      return nested.comments;
    }
  }

  if (Array.isArray(data.comments)) {
    return data.comments;
  }

  return [];
};

const normalizeComment = (rawItem: unknown, index: number): EventComment => {
  const item = isObject(rawItem) ? rawItem : {};
  const author = firstString(item, ["name", "author", "user_name", "username", "created_by"], "User");
  const text = firstString(item, ["comment", "content", "message", "text", "body"], "Komentar kosong");
  const timeLabel = firstString(item, ["created_at", "createdAt", "time", "date"], "Baru saja");

  return {
    id: firstString(item, ["id", "comment_id", "uuid"], "") || `comment-${index + 1}`,
    author,
    text,
    timeLabel,
  };
};

const extractAttendeeArray = (payload: unknown): EventAttendeeApiItem[] => {
  if (Array.isArray(payload)) {
    return payload as EventAttendeeApiItem[];
  }

  if (!isObject(payload)) {
    return [];
  }

  const response = payload as EventAttendeeListResponse;

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (isObject(response.data)) {
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data.attendees)) {
      return response.data.attendees;
    }
  }

  if (Array.isArray(response.attendees)) {
    return response.attendees;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  return [];
};

const normalizePaymentStatus = (value: string): PromotorAttendee["paymentStatus"] => {
  const normalized = value.trim().toLowerCase();

  if (["lunas", "paid", "settlement", "success", "berhasil"].includes(normalized)) {
    return "lunas";
  }

  if (["dibatalkan", "cancel", "cancelled", "failed", "expire", "expired"].includes(normalized)) {
    return "dibatalkan";
  }

  return "menunggu";
};

const formatDateTimeMultiline = (raw: string) => {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  const dateText = parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const timeText = parsed.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dateText}\n${timeText} WIB`;
};

const normalizeAttendee = (rawItem: EventAttendeeApiItem, index: number): PromotorAttendee => {
  const item = isObject(rawItem) ? rawItem : {};
  const userObject = isObject(item.user) ? item.user : null;

  const fullName =
    firstString(item, ["name", "full_name", "user_name", "holder_name"], "") ||
    (userObject ? firstString(userObject, ["name", "full_name"], "") : "") ||
    `Peserta ${index + 1}`;

  const rawStatus =
    firstString(item, ["payment_status", "status", "transaction_status"], "") ||
    (userObject ? firstString(userObject, ["payment_status", "status"], "") : "");

  const registeredAtRaw =
    firstString(item, ["created_at", "createdAt", "registered_at", "booked_at"], "") ||
    (userObject ? firstString(userObject, ["created_at", "createdAt"], "") : "");

  const checkedIn =
    item.checked_in === true ||
    item.is_checked_in === true ||
    firstString(item, ["attendance_status", "checkin_status"], "").toLowerCase() === "checked_in" ||
    Boolean(firstString(item, ["checked_in_at"], ""));

  const ticketCode =
    firstString(item, ["ticket_code", "ticketCode", "code", "qr_code", "qrCode"], "") ||
    firstString(item, ["id", "ticket_id"], `ticket-${index + 1}`);

  return {
    id: firstString(item, ["id", "attendee_id", "ticket_id", "user_id"], `attendee-${index + 1}`),
    fullName,
    ticketCategory: firstString(item, ["ticket_type", "tier", "category"], "Reguler"),
    paymentStatus: normalizePaymentStatus(rawStatus || "pending"),
    registeredAt: registeredAtRaw ? formatDateTimeMultiline(registeredAtRaw) : "-",
    checkedIn,
    ticketCode,
  };
};

export const getEventAttendees = async (
  token: string,
  eventId: string,
  options: EventAttendeeQueryOptions = {}
): Promise<PromotorAttendee[]> => {
  const safeEventId = eventId.trim();
  const params: EventAttendeeQueryOptions = {
    search: typeof options.search === "string" ? options.search : "",
    page: typeof options.page === "string" ? options.page : "1",
    limit: typeof options.limit === "string" ? options.limit : "20",
  };

  const response = await api.get<unknown>(`/events/${safeEventId}/attendees`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const rows = extractAttendeeArray(response.data);
  return rows.map(normalizeAttendee);
};

export const checkInEventTicket = async (token: string, eventId: string, ticketCode: string) => {
  const safeEventId = eventId.trim();
  const safeTicketCode = ticketCode.trim();

  const response = await api.post(
    `/events/${safeEventId}/check-in`,
    {
      ticket_code: safeTicketCode,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getEventComments = async (eventId: string) => {
  const safeEventId = eventId.trim();
  const response = await api.get<unknown>(`/events/${safeEventId}/comments`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const comments = extractCommentArray(response.data);
  return comments.map(normalizeComment);
};

export const postEventComment = async (eventId: string, token: string, comment: string, parentId?: string) => {
  const safeEventId = eventId.trim();
  const safeComment = comment.trim();

  const payload: { comment: string; parent_id?: string } = {
    comment: safeComment,
  };

  if (parentId && parentId.trim()) {
    payload.parent_id = parentId.trim();
  }

  await api.post(`/events/${safeEventId}/comments`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
