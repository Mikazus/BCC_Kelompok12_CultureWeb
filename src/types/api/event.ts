export type EventApiItem = {
  [key: string]: unknown;
};

export interface ApidogModel {
  address?: string;
  banner?: string;
  category_id?: string;
  description?: string;
  end_date?: string;
  google_maps_url?: string;
  is_paid?: string;
  latitude?: string;
  longitude?: string;
  limit?: string;
  page?: string;
  price?: string;
  published_date?: string;
  quota?: string;
  registration_deadline?: string;
  search?: string;
  start_date?: string;
  sort_by?: string;
  sort_order?: string;
  summary?: string;
  title?: string;
  venue?: string;
  [property: string]: unknown;
}

export type CreateEventPayload = {
  address?: string;
  banner?: File | null;
  category_id?: string;
  description?: string;
  end_date?: string;
  google_maps_url?: string;
  is_paid?: string;
  price?: string;
  quota?: string;
  registration_deadline?: string;
  start_date?: string;
  summary?: string;
  title?: string;
  venue?: string;
};

export type CreateEventResponse = {
  success?: boolean;
  message?: string;
  payment_url?: string;
  payment_token?: string;
  data?: unknown;
  [key: string]: unknown;
};

export type CreateEventResult = {
  success: boolean;
  message: string;
  eventId: string | null;
  paymentUrl: string | null;
  paymentToken: string | null;
  raw: CreateEventResponse;
};

export type EventListResponse = {
  data?: EventApiItem[] | { data?: EventApiItem[]; events?: EventApiItem[] };
  events?: EventApiItem[];
  results?: EventApiItem[];
  [key: string]: unknown;
};

export type EventAttendeeQueryOptions = {
  limit?: string;
  page?: string;
  search?: string;
  [key: string]: unknown;
};

export type EventAttendeeApiItem = {
  [key: string]: unknown;
};

export type EventAttendeeListResponse = {
  data?: EventAttendeeApiItem[] | { data?: EventAttendeeApiItem[]; attendees?: EventAttendeeApiItem[] };
  attendees?: EventAttendeeApiItem[];
  results?: EventAttendeeApiItem[];
  [key: string]: unknown;
};
