import Image, { type ImageLoaderProps } from "next/image"
import Link from "next/link"
import { CalendarDays, Heart, MapPin } from "lucide-react"

import type { EventCard } from "./types"

type EventGridProps = {
  events: EventCard[]
}

const EventGrid = ({ events }: EventGridProps) => {
  const passthroughLoader = ({ src }: ImageLoaderProps) => src

  const buildSummary = (event: EventCard) => {
    if (event.summary && event.summary.trim()) {
      return event.summary;
    }

    return `${event.title} hadir dengan rangkaian pengalaman budaya yang seru, terbuka untuk semua kalangan.`;
  };

  const buildStockLabel = (event: EventCard) => {
    if (event.stockLabel && event.stockLabel.trim()) {
      return event.stockLabel;
    }

    return "Tiket terbatas";
  };

  return (
    <section className="mx-auto mt-8 w-[92%] max-w-338">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Daftar Event</h3>
        <p className="text-sm text-[#7a6543]">{events.length} event ditemukan</p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-[#d8c6a8] bg-[#f3e5cd] p-6 text-center text-sm text-[#6b5638]">
          Belum ada event yang tersedia untuk filter ini.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <article
            key={event.id}
            className="overflow-hidden rounded-[20px] border border-[#d8c6a8] bg-[#f3e5cd] shadow-[0_9px_20px_rgba(52,34,12,0.14)]"
          >
            <div className="relative m-3 mb-0 h-40 overflow-hidden rounded-[14px] sm:h-44">
              <Image
                loader={typeof event.image === "string" ? passthroughLoader : undefined}
                unoptimized={typeof event.image === "string"}
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                className="h-full w-full object-cover"
              />

              <p className="absolute left-2.5 top-2.5 rounded-full bg-black/45 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                {event.category}
              </p>

              <button
                type="button"
                aria-label="Simpan event"
                className="absolute right-2.5 top-2.5 rounded-full bg-black/45 p-1.5 text-white backdrop-blur-sm"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 p-4 pt-3 text-[#3a2a16]">
              <div className="flex items-center gap-3 text-[11px] text-[#5f4a2d]">
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {event.dateLabel}
                </p>
                <span className="h-1 w-1 rounded-full bg-[#8f7652]" aria-hidden="true" />
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {event.location}
                </p>
              </div>

              <h4 className="text-balance text-[31px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[#1f150b]">
                {event.title}
              </h4>

              <p className="line-clamp-2 text-[11px] leading-4 text-[#6b5638]">{buildSummary(event)}</p>

              <div className="border-t border-[#ccb58f] pt-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[26px] font-bold uppercase leading-none text-[#2d1f10]">{event.priceLabel}</p>
                  <p className="text-[10px] font-medium text-[#806744]">{buildStockLabel(event)}</p>
                </div>

                <Link
                  href={event.slug ? `/EventDetail?slug=${encodeURIComponent(event.slug)}` : "/EventDetail"}
                  className="flex h-10 w-full items-center justify-center rounded-full bg-[#ab8750] text-[12px] font-semibold text-white transition-colors hover:bg-[#946f3e]"
                >
                  Lihat Selengkapnya
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EventGrid