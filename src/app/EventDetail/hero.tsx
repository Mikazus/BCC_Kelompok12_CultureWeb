import Image from "next/image"

import dashImage from "@/image/dash.png"

const Hero = () => {
  return (
    <section className="mx-auto mt-8 w-[92%] max-w-338">
      <div className="relative overflow-hidden rounded-[26px] border border-[#9f7a3f]/35">
        <Image
          src={dashImage}
          alt="Event budaya"
          priority
          className="h-105 w-full object-cover md:h-140"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(20,14,6,0.88)_8%,rgba(20,14,6,0.35)_56%,rgba(20,14,6,0.65)_100%)]" />

        <div className="absolute left-8 top-16 max-w-140 text-white sm:left-12">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">Event Detail</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-[52px]">
            Temukan Budaya,
            <br />
            Pilih Event Sesuai Minatmu
          </h1>
          <p className="mt-4 max-w-115 text-[13px] leading-6 text-white/85">
            Halaman ini disiapkan untuk menampilkan daftar event budaya dengan urutan kategori
            yang konsisten, sehingga saat data API masuk kamu tinggal mapping data ke kartu.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero