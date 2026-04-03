export type EventApiItem = {
  [key: string]: unknown;
};

export interface ApidogModel {
  category_id?: string;
  limit?: string;
  page?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
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
  data?: unknown;
  [key: string]: unknown;
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
