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
  [property: string]: any;
}

export type EventListResponse = {
  data?: EventApiItem[] | { data?: EventApiItem[]; events?: EventApiItem[] };
  events?: EventApiItem[];
  results?: EventApiItem[];
  [key: string]: unknown;
};
