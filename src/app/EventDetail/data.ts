import dashImage from "@/image/dash.png"

import type { CategoryFilter, EventCard } from "./types"

export const eventCards: EventCard[] = [
  {
    id: 1,
    title: "Parade Nusantara 2026",
    category: "Seni Pertunjukan",
    location: "Alun-Alun Malang",
    dateLabel: "15 Mei 2026",
    priceLabel: "Gratis",
    image: dashImage,
  },
  {
    id: 2,
    title: "Tong Tong Night Market",
    category: "Musik Tradisional",
    location: "Kampung Heritage",
    dateLabel: "21 Mei 2026",
    priceLabel: "Rp 20.000",
    image: dashImage,
  },
  {
    id: 3,
    title: "Festival Kampung Budaya",
    category: "Pameran Seni",
    location: "Balai Kota",
    dateLabel: "3 Juni 2026",
    priceLabel: "Rp 35.000",
    image: dashImage,
  },
  {
    id: 4,
    title: "Festival Tari Topeng",
    category: "Tari Daerah",
    location: "Gedung Kesenian",
    dateLabel: "12 Juni 2026",
    priceLabel: "Rp 25.000",
    image: dashImage,
  },
  {
    id: 5,
    title: "Pagelaran Angklung Senja",
    category: "Musik Tradisional",
    location: "Taman Krida",
    dateLabel: "17 Juni 2026",
    priceLabel: "Rp 30.000",
    image: dashImage,
  },
  {
    id: 6,
    title: "Pentas Lenong Nusantara",
    category: "Seni Pertunjukan",
    location: "Lapangan Rampal",
    dateLabel: "22 Juni 2026",
    priceLabel: "Rp 28.000",
    image: dashImage,
  },
]

export const categories: CategoryFilter[] = ["Semua", ...new Set(eventCards.map((item) => item.category))]