import type { StaticImageData } from "next/image"

import dashImage from "@/image/dash.png"

export type EventDetailData = {
	eventId?: string | number
	title: string
	subtitle: string
	category: string
	dateLabel: string
	location: string
	priceLabel: string
	ticketLabel: string
	description: string
	image: string | StaticImageData
}

export type EventComment = {
	id: number | string
	author: string
	text: string
	timeLabel: string
}

export const eventDetailData: EventDetailData = {
	eventId: "7966c6f5-52e7-4c76-8a24-437fd6d64fbf",
	title: "Festival Tari Topeng Malangan",
	subtitle: "Festival seni tahunan dengan ciri khas topeng dan karawitan Jawa Timur",
	category: "Tari Topeng",
	dateLabel: "26 April 2026",
	location: "Alun-Alun Malang",
	priceLabel: "IDR 25.000",
	ticketLabel: "20 tiket tersisa",
	description:
		"Festival Tari Topeng Malangan adalah perayaan budaya yang menghadirkan ragam pertunjukan tari topeng tradisional, lokakarya gerak dasar, dan diskusi publik bersama pelaku seni lokal. Acara ini terbuka untuk seluruh masyarakat yang ingin mengenal lebih dekat warisan budaya Jawa Timur dengan pengalaman yang interaktif dan berkesan.",
	image: dashImage,
}

export const eventComments: EventComment[] = [
	{
		id: 1,
		author: "Nina",
		text: "Acaranya seru banget, terutama sesi workshop topeng. Semoga tahun depan lebih panjang.",
		timeLabel: "1 jam lalu",
	},
	{
		id: 2,
		author: "Rudi",
		text: "Lokasi nyaman dan pertunjukan pembuka keren. Recommended untuk keluarga.",
		timeLabel: "3 jam lalu",
	},
	{
		id: 3,
		author: "Putri",
		text: "Tolong info parkir motor terdekat ya, saya rencana datang besok sore.",
		timeLabel: "6 jam lalu",
	},
]
