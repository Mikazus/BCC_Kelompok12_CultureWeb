export type EventApiItem = {
  [key: string]: unknown;
};

export type EventListResponse = {
  data?: EventApiItem[] | { data?: EventApiItem[]; events?: EventApiItem[] };
  events?: EventApiItem[];
  results?: EventApiItem[];
  [key: string]: unknown;
};
