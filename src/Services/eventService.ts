import dashImage from "@/image/dash.png";
import api from "@/lib/api";
import type { EventCard } from "@/app/EventDetail/types";
import type { EventApiItem, EventListResponse } from "@/types/api/event";

const DEFAULT_EVENTS_ENDPOINT = "/events";
const FALLBACK_EVENTS_ENDPOINT = "/event";
const DEFAULT_CATEGORIES_ENDPOINT = "/categories";

export type EventQueryOptions = {
  categoryId?: string;
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type EventCategoryOption = {
  id: string;
  name: string;
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

const normalizeEvent = (rawItem: EventApiItem, index: number): EventCard => {
  const item = isObject(rawItem) ? rawItem : {};

  const imageUrl = firstString(item, ["image", "image_url", "thumbnail", "banner", "photo"], "");
  const rawDate = firstString(item, ["date", "event_date", "start_date", "startAt", "start_at"], "");
  const summary = firstString(item, ["description", "summary", "excerpt", "short_description"], "");
  const remainingTicketValue = firstNumber(item, ["remaining_tickets", "ticket_remaining", "quota_left", "remaining"], "");

  let stockLabel = "";
  if (typeof remainingTicketValue === "number") {
    stockLabel = `${remainingTicketValue} tiket tersisa`;
  } else if (typeof remainingTicketValue === "string" && remainingTicketValue.trim()) {
    stockLabel = remainingTicketValue.toLowerCase().includes("tiket")
      ? remainingTicketValue
      : `${remainingTicketValue} tiket tersisa`;
  }

  return {
    id: firstNumber(item, ["id", "event_id", "uuid"], `event-${index + 1}`),
    title: firstString(item, ["title", "name", "event_name"], `Event ${index + 1}`),
    category: firstString(item, ["category", "category_name", "type"], "Lainnya"),
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

const extractCategoryArray = (payload: unknown): EventCategoryOption[] => {
  const normalizeCategory = (value: unknown): EventCategoryOption | null => {
    if (typeof value === "string" && value.trim()) {
      return {
        id: value.trim(),
        name: value.trim(),
      };
    }

    if (isObject(value)) {
      const item = value as Record<string, unknown>;
      const name = firstString(item, ["name", "title", "category", "category_name", "label"], "");
      if (!name) {
        return null;
      }
      const id = firstString(item, ["id", "category_id", "uuid", "slug"], name);
      return {
        id,
        name,
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
      if (!deduped.has(item.name)) {
        deduped.set(item.name, item);
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

  const params = {
    limit: options.limit ?? 5,
    page: options.page ?? 1,
    search: options.search ?? "",
    category_id: options.categoryId ?? "",
    sort_by: options.sortBy ?? "created_at",
    sort_order: options.sortOrder ?? "desc",
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

export const getCategories = async () => {
  const configuredEndpoint = process.env.NEXT_PUBLIC_CATEGORIES_ENDPOINT?.trim();
  const endpoint = configuredEndpoint || DEFAULT_CATEGORIES_ENDPOINT;

  const response = await api.get<unknown>(endpoint);
  return extractCategoryArray(response.data);
};
